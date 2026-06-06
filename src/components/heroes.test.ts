import { describe, it, expect } from 'vitest';
import { HERO_DICTIONARY, DEFAULT_HERO } from './heroes';

describe('Hero Attacker Data', () => {
  it('defines baseBulletDamage for every hero in the dictionary', () => {
    for (const hero of Object.values(HERO_DICTIONARY)) {
      expect(hero.baseBulletDamage).toBeDefined();
      expect(typeof hero.baseBulletDamage).toBe('number');
      expect(hero.baseBulletDamage).toBeGreaterThan(0);
    }
  });

  it('defines baseBulletDamage for the default hero', () => {
    expect(DEFAULT_HERO.baseBulletDamage).toBeDefined();
    expect(DEFAULT_HERO.baseBulletDamage).toBe(15); // Default EHP incoming damage is 15
  });
});
