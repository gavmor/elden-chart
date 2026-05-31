import { ItemsApi } from 'deadlock_api_client/apis/items-api';
import type { Item } from 'deadlock_api_client/models';
import type { ArmorItem } from '../components/types';

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

/**
 * Parse a property value string into a number, returning null if non-numeric.
 */
const parsePropertyValue = (val: string | null | undefined): number | null => {
  if (val === null || val === undefined) return null;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Transform raw Deadlock API items into our normalized EquipmentItem shape.
 *
 * Mapping strategy:
 *  - `cost` → `weight` (the "cost" dimension, analogous to equip load)
 *  - `item_slot_type` → `category` (weapon / spirit / vitality)
 *  - `properties` → `dmgNegation[]` (reuses the armor stat array for dynamic axes)
 *  - `kind` = 'armor' (so the existing chart's stat accessor paths work)
 *  - `resistance` = [] (unused, but required by ArmorItem interface)
 */
export const transformDeadlockItems = (rawItems: Item[]): ArmorItem[] => {
  return rawItems
    .filter(isShopableUpgrade)
    .map(item => {
      // Safe cast: isShopableUpgrade guarantees these fields exist
      const upgrade = item as import('deadlock_api_client/models').Upgrade;

      const properties = upgrade.properties ?? {};
      const dmgNegation = Object.entries(properties)
        .map(([name, prop]) => {
          const amount = parsePropertyValue(prop.value);
          if (amount === null) return null;
          return { name, amount };
        })
        .filter((entry): entry is { name: string; amount: number } => entry !== null);

      return {
        id: String(upgrade.id),
        name: upgrade.name,
        image: upgrade.image ?? null,
        category: upgrade.item_slot_type,
        description: upgrade.description?.desc ?? '',
        weight: upgrade.cost ?? 0,
        kind: 'armor' as const,
        dmgNegation,
        resistance: [],
      };
    });
};

/**
 * Fetch all Deadlock items from the API.
 * Uses the ItemsApi class from the generated client.
 */
export const fetchDeadlockItems = async (): Promise<ArmorItem[]> => {
  const api = new ItemsApi();
  const response = await api.listItems({});
  return transformDeadlockItems(response.data);
};
