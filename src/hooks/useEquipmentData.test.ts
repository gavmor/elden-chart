import { describe, it, expect } from 'vitest';
import {
  getCleanCategory,
  CATEGORY_CLEANUP_MAP,
  getCleanStatName,
  STAT_NAME_CLEANUP_MAP,
  transformEquipmentData,
  fetchEquipmentDataRaw
} from './useEquipmentData';

describe('getCleanCategory', () => {
  it('correctly maps specific items in CATEGORY_CLEANUP_MAP', () => {
    expect(getCleanCategory("Spellblade's Gloves", 'Gauntlet')).toBe('Gauntlets');
    expect(getCleanCategory('Smoldering Shield', 'Small Shields')).toBe('Small Shield');
    expect(getCleanCategory('Cuckoo Greatshield', null)).toBe('Greatshield');
  });

  it('correctly standardizes generic category anomalies', () => {
    // Standardizes 'Gauntlet' to 'Gauntlets' for any item
    expect(getCleanCategory('Random Gloves', 'Gauntlet')).toBe('Gauntlets');
    // Standardizes 'Small Shields' to 'Small Shield' for any item
    expect(getCleanCategory('Random Shield', 'Small Shields')).toBe('Small Shield');
  });

  it('passes through standard categories unmodified', () => {
    expect(getCleanCategory('Iron Helm', 'Helm')).toBe('Helm');
    expect(getCleanCategory('Vagabond Knight Armor', 'Chest Armor')).toBe('Chest Armor');
    expect(getCleanCategory('Heater Shield', 'Medium Shield')).toBe('Medium Shield');
    expect(getCleanCategory('Fingerprint Stone Shield', 'Greatshield')).toBe('Greatshield');
  });

  it('handles null, undefined, and non-string inputs safely by falling back to empty string', () => {
    expect(getCleanCategory('Unknown Item', null)).toBe('');
    expect(getCleanCategory('Unknown Item', undefined)).toBe('');
  });

  it('has entries in CATEGORY_CLEANUP_MAP matching expected values', () => {
    expect(CATEGORY_CLEANUP_MAP["Spellblade's Gloves"]).toBe('Gauntlets');
    expect(CATEGORY_CLEANUP_MAP['Smoldering Shield']).toBe('Small Shield');
    expect(CATEGORY_CLEANUP_MAP['Cuckoo Greatshield']).toBe('Greatshield');
  });
});

describe('getCleanStatName', () => {
  it('correctly consolidates Sor to Sorc', () => {
    expect(getCleanStatName('Sor')).toBe('Sorc');
  });

  it('correctly standardizes malformed HTML and duplicate keys', () => {
    expect(getCleanStatName('e-color="">Mag')).toBe('Mag');
    expect(getCleanStatName('e">Mag')).toBe('Mag');
    expect(getCleanStatName('Mag63')).toBe('Mag');
    expect(getCleanStatName('Phy120')).toBe('Phy');
    expect(getCleanStatName('Light')).toBe('Ligt');
  });

  it('passes through normal keys unmodified', () => {
    expect(getCleanStatName('Phy')).toBe('Phy');
    expect(getCleanStatName('Mag')).toBe('Mag');
    expect(getCleanStatName('Fire')).toBe('Fire');
    expect(getCleanStatName('Ligt')).toBe('Ligt');
    expect(getCleanStatName('Holy')).toBe('Holy');
    expect(getCleanStatName('Sorc')).toBe('Sorc');
    expect(getCleanStatName('Inc')).toBe('Inc');
  });

  it('handles null and undefined safely by falling back to empty string', () => {
    expect(getCleanStatName(null)).toBe('');
    expect(getCleanStatName(undefined)).toBe('');
  });

  it('has entries in STAT_NAME_CLEANUP_MAP matching expected values', () => {
    expect(STAT_NAME_CLEANUP_MAP['Sor']).toBe('Sorc');
    expect(STAT_NAME_CLEANUP_MAP['e-color="">Mag']).toBe('Mag');
    expect(STAT_NAME_CLEANUP_MAP['e">Mag']).toBe('Mag');
    expect(STAT_NAME_CLEANUP_MAP['Mag63']).toBe('Mag');
    expect(STAT_NAME_CLEANUP_MAP['Phy120']).toBe('Phy');
    expect(STAT_NAME_CLEANUP_MAP['Light']).toBe('Ligt');
  });
});

describe('fetchEquipmentDataRaw', () => {
  it('is a function', () => {
    expect(typeof fetchEquipmentDataRaw).toBe('function');
  });
});

describe('transformEquipmentData', () => {
  it('is a function', () => {
    expect(typeof transformEquipmentData).toBe('function');
  });

  it('correctly maps raw items to EquipmentItem array', () => {
    const rawData = [
      [{ id: "1", name: "Armor 1", weight: 5 }],
      [{ id: "2", name: "Weapon 1", weight: 10 }],
      [{ id: "3", name: "Shield 1", weight: 4 }],
      [{ id: "4", name: "Ammo 1", weight: 0 }],
    ];
    // @ts-expect-error - testing mock
    const result = transformEquipmentData(rawData);
    expect(result).toHaveLength(4);
    expect(result[0].kind).toBe('armor');
    expect(result[1].kind).toBe('weapon');
    expect(result[2].kind).toBe('shield');
    expect(result[3].kind).toBe('ammo');
  });
});
