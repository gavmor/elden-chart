import { ItemsApi } from 'deadlock_api_client/apis/items-api';
import { HeroesApi } from 'deadlock_api_client/apis/heroes-api';
import type { Item, Ability, HashMapItemSlotTypeVecMapModCostBonusValueInner } from 'deadlock_api_client/models';
import type { DeadlockUpgradeItem, DeadlockAbilityItem, AbilityTier, InvestmentTracks } from '../components/types';
import { getHeroNameFromClassName } from '../components/domain/math';

/**
 * Determine whether a raw Item from the Deadlock API is a shopable upgrade.
 * The API returns a union type (Ability | Upgrade | Weapon); we only want
 * upgrades that appear in the shop.
 */
const isShopableUpgrade = (item: Item): boolean => {
  if (!('type' in item)) return false;
  if (item.type !== 'upgrade') return false;
  if (!('shopable' in item) || !item.shopable) return false;
  if ('disabled' in item && item.disabled) return false;
  return true;
};

const parsePropertyValue = (val: string | null | undefined): number | null => {
  if (val === null || val === undefined) return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Map raw properties to our normalized shape, translating negative offensive debuffs
 * applied to enemies into explicit debuff stats (e.g., FireRateSlow) and aligning
 * buffs to calculation-friendly keys.
 */
const parseProperties = (
  propertiesRaw: Record<string, unknown>,
  renamedKeysTracker?: Map<string, string>
) => {
  return Object.entries(propertiesRaw)
    .map(([name, rawProp]) => {
      const prop = rawProp as { value?: string; bonus?: string; usage_flags?: string[] };
      const amount = parsePropertyValue(prop?.value);
      if (amount === null) return null;

      const isEnemyApplied = prop?.usage_flags?.includes('ConditionallyEnemyApplied');

      // Convert negative BonusFireRate applied to enemies into FireRateSlow
      if (name === 'BonusFireRate' && amount < 0 && isEnemyApplied) {
        if (renamedKeysTracker) renamedKeysTracker.set(name, 'FireRateSlow');
        return { name: 'FireRateSlow', amount: Math.abs(amount) };
      }

      // Treat BuffBaseWeaponPct as standard WeaponPower so theorycrafting captures the self-buff
      if (name === 'BuffBaseWeaponPct') {
        if (renamedKeysTracker) renamedKeysTracker.set(name, 'WeaponPower');
        return { name: 'WeaponPower', amount };
      }

      return { name, amount };
    })
    .filter((entry): entry is { name: string; amount: number } => entry !== null);
};

/**
 * Transform raw Deadlock API items into our normalized EquipmentItem shape.
 *
 * Mapping strategy:
 *  - `cost` → `weight` (the "cost" dimension, analogous to equip load)
 *  - `item_slot_type` → `category` (weapon / spirit / vitality)
 *  - `properties` → `properties[]` (first-class deadlock properties array)
 *  - `kind` = 'deadlock_upgrade'
 */
export const transformDeadlockItems = (rawItems: Item[]): DeadlockUpgradeItem[] => {
  return rawItems
    .filter(isShopableUpgrade)
    .map(item => {
      // Safe cast: isShopableUpgrade guarantees these fields exist
      const upgrade = item as import('deadlock_api_client/models').Upgrade;

      const propertiesRaw = upgrade.properties ?? {};
      const properties = parseProperties(propertiesRaw);

      const isStreetBrawl = upgrade.cost === 9999;
      return {
        id: String(upgrade.id),
        name: upgrade.name,
        image: upgrade.image ?? (upgrade as unknown as { shop_image?: string }).shop_image ?? null,
        category: isStreetBrawl ? 'Street Brawl' : upgrade.item_slot_type,
        description: upgrade.description?.desc ?? '',
        weight: upgrade.cost ?? 0,
        kind: 'deadlock_upgrade' as const,
        isActive: upgrade.is_active_item,
        properties,
      };
    });
};

/**
 * Transform raw Deadlock API items into our normalized DeadlockAbilityItem shape.
 */
export const transformDeadlockAbilities = (
  rawItems: Item[],
  heroMap?: Map<number, string>
): DeadlockAbilityItem[] => {
  return rawItems
    .filter((item): item is Ability => 'type' in item && item.type === 'ability')
    .filter(ability => ability.name !== ability.class_name)
    .filter(ability => ability.upgrades && ability.upgrades.length === 3)
    .map(ability => {
      const propertiesRaw = ability.properties ?? {};
      const renamedKeys = new Map<string, string>();
      const properties = parseProperties(propertiesRaw, renamedKeys);

      const rawUpgrades = ability.upgrades ?? [];
      const descKeys = [
        ability.description?.t1_desc,
        ability.description?.t2_desc,
        ability.description?.t3_desc,
      ];

      const upgrades: [AbilityTier, AbilityTier, AbilityTier] = [
        { tierIndex: 1, apCost: 1, description: descKeys[0] ?? '', modifiers: [] },
        { tierIndex: 2, apCost: 2, description: descKeys[1] ?? '', modifiers: [] },
        { tierIndex: 3, apCost: 5, description: descKeys[2] ?? '', modifiers: [] },
      ];

      for (let i = 0; i < 3; i++) {
        const rawUpgrade = rawUpgrades[i];
        if (rawUpgrade && rawUpgrade.property_upgrades) {
          upgrades[i].modifiers = rawUpgrade.property_upgrades
            .map(u => {
              let amount = parsePropertyValue(u.bonus);
              if (amount === null) return null;

              let name = u.name;

              // Apply translations from base properties
              if (renamedKeys.has(name)) {
                name = renamedKeys.get(name)!;
                if (name === 'FireRateSlow') {
                  amount = Math.abs(amount);
                }
              }

              // Also apply direct translations for upgrade properties that didn't appear in base
              if (name === 'BuffBaseWeaponPct') {
                name = 'WeaponPower';
              }

              return { name, amount };
            })
            .filter((entry): entry is { name: string; amount: number } => entry !== null);
        }
      }

      let heroName = '';
      if (heroMap && ability.hero !== null && ability.hero !== undefined) {
        heroName = heroMap.get(ability.hero) ?? '';
      }
      if (!heroName) {
        heroName = getHeroNameFromClassName(ability.class_name);
      }

      return {
        id: String(ability.id),
        name: ability.name,
        image: ability.image ?? (ability as unknown as { shop_image?: string }).shop_image ?? null,
        category: ability.ability_type ?? 'signature',
        description: ability.description?.desc ?? '',
        weight: ability.ability_type === 'ultimate' ? 3000 : 400,
        kind: 'deadlock_ability' as const,
        className: ability.class_name,
        heroName,
        isUltimate: ability.ability_type === 'ultimate',
        startTrained: ability.start_trained ?? false,
        properties,
        upgrades,
      };
    });
};

/**
 * Fetch all Deadlock items from the API.
 * Uses the ItemsApi class from the generated client.
 */
export const fetchDeadlockItemsRaw = async (): Promise<Item[]> => {
  const api = new ItemsApi();
  const response = await api.listItems({});
  return response.data;
};

/**
 * Fetch all Deadlock abilities from the API.
 */
export const fetchDeadlockAbilitiesRaw = async (): Promise<{ abilities: Item[], heroMap?: Map<number, string> }> => {
  const itemsApi = new ItemsApi();
  const heroesApi = new HeroesApi();

  try {
    const [itemsResponse, heroesResponse] = await Promise.all([
      itemsApi.listItems({}),
      heroesApi.listHeroes({}),
    ]);

    const heroMap = new Map<number, string>();
    for (const h of heroesResponse.data) {
      heroMap.set(h.id, h.name);
    }

    return { abilities: itemsResponse.data, heroMap };
  } catch (err) {
    console.error("Failed to fetch with HeroesApi, falling back to items only:", err);
    const response = await itemsApi.listItems({});
    return { abilities: response.data };
  }
};

export const fetchDeadlockInvestmentTracks = async (): Promise<InvestmentTracks> => {
  const api = new HeroesApi();
  const response = await api.listHeroes({ onlyActive: true });
  const firstHero = response.data[0];
  if (!firstHero || !firstHero.cost_bonuses) {
    throw new Error("No investment track data available from heroes API");
  }

  const mapTrack = (items: HashMapItemSlotTypeVecMapModCostBonusValueInner[] = []) => {
    return items.map(item => ({
      goldThreshold: item.gold_threshold,
      bonus: item.bonus,
      percentOnGraph: item.percent_on_graph
    }));
  };

  return {
    weapon: mapTrack(firstHero.cost_bonuses.weapon),
    vitality: mapTrack(firstHero.cost_bonuses.vitality),
    spirit: mapTrack(firstHero.cost_bonuses.spirit)
  };
};


