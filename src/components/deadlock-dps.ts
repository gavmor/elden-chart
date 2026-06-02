export function calculateBulletDPS(baseDps: number, shotTime: number, pauseTime: number, fireRateMod: number): number {
  if (pauseTime <= 0) {
    return baseDps * (1 + fireRateMod);
  }
  
  const multiplier = (shotTime + pauseTime) / (shotTime + (pauseTime / (1 + fireRateMod)));
  return baseDps * multiplier;
}

export function calculateSpiritDPS(type: 'ranged' | 'healing' | 'duration' | 'other', baseValue: number, modifier: number, spiritPower: number, coefficient: number): number {
  if (type === 'ranged') {
    return (baseValue * (1 + modifier)) + (spiritPower * coefficient);
  } else {
    // healing or duration
    return (baseValue + (spiritPower * coefficient)) * (1 + modifier);
  }
}

export function calculateEffectiveResistance(positiveResistances: number[], activeShreds: number[]): number {
  const b = 1 - positiveResistances.reduce((acc, r) => acc * (1 - r), 1);
  const n = 1 - activeShreds.reduce((acc, s) => acc * (1 - s), 1);
  return b - n;
}

export function calculateEffectiveDPS(rawDamage: number, finalActiveResistance: number): number {
  return rawDamage * (1 - finalActiveResistance);
}

export function calculateAmplifiedDamage(baseDamage: number, ampFromEE: number, targetResistance: number): number {
  const resModifier = 1 - targetResistance;
  return ((ampFromEE * resModifier) + 1) * resModifier * baseDamage;
}

export function applyAmmoCeiling(ammo: number): number {
  return Math.ceil(ammo);
}
