import { describe, it, expect } from 'vitest';
import { transformDeadlockItems, fetchDeadlockItems } from './deadlockApi';
import type { Upgrade } from 'deadlock_api_client/models';

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

describe('fetchDeadlockItems', () => {
  it('is a function', () => {
    expect(typeof fetchDeadlockItems).toBe('function');
  });
});
