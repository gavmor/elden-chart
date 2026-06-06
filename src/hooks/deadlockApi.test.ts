import { describe, it, expect, vi } from 'vitest';
import {
  transformDeadlockItems,
  fetchDeadlockItemsRaw,
  transformDeadlockAbilities,
  fetchDeadlockAbilitiesRaw,
  fetchDeadlockInvestmentTracks,
} from './deadlockApi';
import type { Upgrade, Ability } from 'deadlock_api_client/models';

vi.mock('deadlock_api_client/apis/heroes-api', () => {
  return {
    HeroesApi: vi.fn().mockImplementation(function() {
      return {
        listHeroes: vi.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              name: 'Infernus',
              class_name: 'hero_inferno',
              cost_bonuses: {
                weapon: [
                  { gold_threshold: 800, bonus: 4, percent_on_graph: 7 },
                  { gold_threshold: 1600, bonus: 8, percent_on_graph: 7 },
                ],
                vitality: [
                  { gold_threshold: 800, bonus: 75, percent_on_graph: 7 },
                ],
                spirit: [
                  { gold_threshold: 800, bonus: 7, percent_on_graph: 7 },
                ],
              },
            },
          ],
        }),
      };
    }),
  };
});

/** Minimal Upgrade fixture matching the Deadlock API shape. */
const makeUpgrade = (overrides: Partial<Upgrade> = {}): Upgrade => ({
  activation: 'instant_cast' as Upgrade['activation'],
  class_name: 'citadel_item_test_thing',
  id: 1,
  is_active_item: false,
  item_slot_type: 'weapon',
  item_tier: 2,
  name: 'Test Item',
  shopable: true,
  type: 'upgrade',
  cost: 1250,
  image: 'https://example.com/test.png',
  properties: {
    BonusHealth: { value: '75' },
    BulletDamage: { value: '14.5' },
    WeaponPower: { value: '6' },
  },
  ...overrides,
});

/** Minimal Ability fixture matching the Deadlock API shape. */
const makeAbility = (overrides: Partial<Ability> = {}): Ability => ({
  class_name: 'hero_ability_test',
  id: 101,
  name: 'Test Ability',
  type: 'ability',
  description: {
    desc: 'Test description',
    t1_desc: 'Tier 1 desc',
    t2_desc: 'Tier 2 desc',
    t3_desc: 'Tier 3 desc',
  },
  ability_type: 'ultimate',
  start_trained: false,
  properties: {
    Cooldown: { value: '45' },
  },
  upgrades: [
    {
      property_upgrades: [
        { name: 'BonusCharges', bonus: '1' }
      ]
    },
    {
      property_upgrades: [
        { name: 'Cooldown', bonus: '-15' }
      ]
    },
    {
      property_upgrades: [
        { name: 'Damage', bonus: '150' }
      ]
    }
  ],
  ...overrides,
});

describe('transformDeadlockItems', () => {
  it('transforms a single Upgrade into an EquipmentItem', () => {
    const items = transformDeadlockItems([makeUpgrade()]);
    expect(items).toHaveLength(1);

    const item = items[0];
    expect(item.id).toBe('1');
    expect(item.name).toBe('Test Item');
    expect(item.image).toBe('https://example.com/test.png');
    expect(item.category).toBe('weapon');
    expect(item.kind).toBe('deadlock_upgrade');
    expect(item.weight).toBe(1250);  // cost maps to weight
  });

  it('maps properties to first-class properties array', () => {
    const items = transformDeadlockItems([makeUpgrade()]);
    const item = items[0];

    expect(item.kind).toBe('deadlock_upgrade');
    if (item.kind === 'deadlock_upgrade') {
      expect(item.properties).toEqual(
        expect.arrayContaining([
          { name: 'BonusHealth', amount: 75 },
          { name: 'BulletDamage', amount: 14.5 },
          { name: 'WeaponPower', amount: 6 },
        ])
      );
    }
  });

  it('filters out non-shopable items', () => {
    const items = transformDeadlockItems([
      makeUpgrade({ shopable: true, id: 1 }),
      makeUpgrade({ shopable: false, id: 2 }),
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('1');
  });

  it('filters out disabled items', () => {
    const items = transformDeadlockItems([
      makeUpgrade({ disabled: false, id: 1 }),
      makeUpgrade({ disabled: true, id: 2 }),
    ]);
    expect(items).toHaveLength(1);
  });

  it('only includes upgrade-type items', () => {
    const items = transformDeadlockItems([
      makeUpgrade({ type: 'upgrade', id: 1 }),
      // Abilities and weapons should be excluded
      makeUpgrade({ type: 'ability' as Upgrade['type'], id: 2 }),
    ]);
    expect(items).toHaveLength(1);
  });

  it('handles items with no properties', () => {
    const items = transformDeadlockItems([makeUpgrade({ properties: undefined })]);
    expect(items).toHaveLength(1);
    if (items[0].kind === 'deadlock_upgrade') {
      expect(items[0].properties).toEqual([]);
    }
  });

  it('handles items with null cost', () => {
    const items = transformDeadlockItems([makeUpgrade({ cost: null })]);
    expect(items).toHaveLength(1);
    expect(items[0].weight).toBe(0);
  });

  it('skips properties with non-numeric values', () => {
    const items = transformDeadlockItems([makeUpgrade({
      properties: {
        SomeFlag: { value: 'true' },
        NumericProp: { value: '42' },
      },
    })]);
    if (items[0].kind === 'deadlock_upgrade') {
      // 'true' is NaN, so it should be excluded
      expect(items[0].properties).toEqual([
        { name: 'NumericProp', amount: 42 },
      ]);
    }
  });

  it('uses item_slot_type as category', () => {
    const weapon = transformDeadlockItems([makeUpgrade({ item_slot_type: 'weapon' })]);
    const spirit = transformDeadlockItems([makeUpgrade({ item_slot_type: 'spirit' })]);
    const vitality = transformDeadlockItems([makeUpgrade({ item_slot_type: 'vitality' })]);

    expect(weapon[0].category).toBe('weapon');
    expect(spirit[0].category).toBe('spirit');
    expect(vitality[0].category).toBe('vitality');
  });
});

describe('transformDeadlockAbilities', () => {
  it('transforms an Ability item into DeadlockAbilityItem', () => {
    const items = transformDeadlockAbilities([makeAbility()]);
    expect(items).toHaveLength(1);

    const item = items[0];
    expect(item.id).toBe('101');
    expect(item.name).toBe('Test Ability');
    expect(item.kind).toBe('deadlock_ability');
    expect(item.category).toBe('ultimate');
    expect(item.weight).toBe(3000);
    expect(item.heroName).toBe('Test');
    expect(item.isUltimate).toBe(true);
    expect(item.startTrained).toBe(false);
    expect(item.properties).toEqual([{ name: 'Cooldown', amount: 45 }]);

    expect(item.upgrades).toHaveLength(3);
    expect(item.upgrades[0]).toEqual({
      tierIndex: 1,
      apCost: 1,
      description: 'Tier 1 desc',
      modifiers: [{ name: 'BonusCharges', amount: 1 }],
    });
    expect(item.upgrades[1]).toEqual({
      tierIndex: 2,
      apCost: 2,
      description: 'Tier 2 desc',
      modifiers: [{ name: 'Cooldown', amount: -15 }],
    });
    expect(item.upgrades[2]).toEqual({
      tierIndex: 3,
      apCost: 5,
      description: 'Tier 3 desc',
      modifiers: [{ name: 'Damage', amount: 150 }],
    });
  });

  it('maps hero names accurately using heroMap lookup and class name fallbacks', () => {
    const heroMap = new Map<number, string>();
    heroMap.set(2, 'Seven');
    heroMap.set(50, 'Pocket');

    const abilities = transformDeadlockAbilities([
      makeAbility({ class_name: 'citadel_ability_storm_cloud', hero: 2, id: 104 }),
      makeAbility({ class_name: 'synth_affliction', hero: 50, id: 105 }),
      makeAbility({ class_name: 'citadel_ability_kelvin_blizzard', hero: 12, id: 106 }),
    ], heroMap);

    expect(abilities).toHaveLength(3);
    expect(abilities[0].heroName).toBe('Seven');
    expect(abilities[1].heroName).toBe('Pocket');
    expect(abilities[2].heroName).toBe('Kelvin');
  });

  it('resolves isUltimate flag and signature classification correctly', () => {
    const abilities = transformDeadlockAbilities([
      makeAbility({ ability_type: 'signature', id: 102 }),
      makeAbility({ ability_type: 'ultimate', id: 103 }),
    ]);

    expect(abilities).toHaveLength(2);
    expect(abilities[0].isUltimate).toBe(false);
    expect(abilities[0].category).toBe('signature');
    expect(abilities[1].isUltimate).toBe(true);
    expect(abilities[1].category).toBe('ultimate');
  });

  it('handles empty properties safely', () => {
    const items = transformDeadlockAbilities([
      makeAbility({ properties: undefined, description: undefined }),
    ]);
    expect(items).toHaveLength(1);
    const item = items[0];
    expect(item.properties).toEqual([]);
    expect(item.upgrades).toHaveLength(3);
    expect(item.upgrades[0].description).toBe('');
    expect(item.upgrades[0].modifiers).toEqual([ { name: 'BonusCharges', amount: 1 } ]);
  });

  it('filters out internal triggers and items without 3 upgrades', () => {
    const items = transformDeadlockAbilities([
      // Same name and class_name means internal trigger
      makeAbility({ name: 'internal_trigger', class_name: 'internal_trigger' }),
      // Missing upgrades
      makeAbility({ upgrades: undefined }),
      // Less than 3 upgrades
      makeAbility({ upgrades: [ { property_upgrades: [] } ] }),
    ]);
    expect(items).toHaveLength(0);
  });
});

describe('fetchDeadlockItemsRaw', () => {
  it('is a function', () => {
    expect(typeof fetchDeadlockItemsRaw).toBe('function');
  });
});

describe('fetchDeadlockAbilitiesRaw', () => {
  it('is a function', () => {
    expect(typeof fetchDeadlockAbilitiesRaw).toBe('function');
  });
});

describe('fetchDeadlockInvestmentTracks', () => {
  it('fetches and transforms investment track data', async () => {
    const data = await fetchDeadlockInvestmentTracks();
    expect(data).toEqual({
      weapon: [
        { goldThreshold: 800, bonus: 4, percentOnGraph: 7 },
        { goldThreshold: 1600, bonus: 8, percentOnGraph: 7 },
      ],
      vitality: [
        { goldThreshold: 800, bonus: 75, percentOnGraph: 7 },
      ],
      spirit: [
        { goldThreshold: 800, bonus: 7, percentOnGraph: 7 },
      ],
    });
  });
});

