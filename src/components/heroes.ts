import type { Hero } from './types';

export const HERO_DICTIONARY: Record<string, Hero> = {
  Paradox: {
    name: 'Paradox',
    shotTime: 0.38,
    pauseTime: 0.28,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 12
  },
  Lash: {
    name: 'Lash',
    shotTime: 0.22,
    pauseTime: 0.30,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 11
  },
  Seven: {
    name: 'Seven',
    shotTime: 0.23,
    pauseTime: 0.29,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 10
  },
  Haze: {
    name: 'Haze',
    shotTime: 1, // Continuous fire
    pauseTime: 0,
    spiritConversions: [
      { stat: 'ammo', multiplier: 0.5 }
    ],
    abilityCoefficients: [],
    baseBulletDamage: 6
  },
  Infernus: {
    name: 'Infernus',
    shotTime: 1,
    pauseTime: 0,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 10
  },
  Holliday: {
    name: 'Holliday',
    shotTime: 1,
    pauseTime: 0,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 18
  },
  Victor: {
    name: 'Victor',
    shotTime: 1,
    pauseTime: 0,
    spiritConversions: [],
    abilityCoefficients: [],
    baseBulletDamage: 25
  }
};

export const DEFAULT_HERO: Hero = {
  name: 'Default',
  shotTime: 1,
  pauseTime: 0,
  spiritConversions: [],
  abilityCoefficients: [],
  baseBulletDamage: 15
};
