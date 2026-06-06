import MLR from 'ml-regression-multivariate-linear';
import type { DeadlockUpgradeItem, InvestmentTracks } from '../types';

export interface ExchangeRates {
  weaponDamage: number;
  vitalityHealth: number;
  spiritPower: number;
}

const FALLBACK_RATES: ExchangeRates = {
  weaponDamage: 50.0,
  vitalityHealth: 2.5,
  spiritPower: 50.0,
};

/**
 * Get the printed Weapon Damage stat from an item's properties.
 */
const getWeaponDamage = (item: DeadlockUpgradeItem): number => {
  const stats = ['WeaponPower', 'BaseAttackDamagePercent', 'BonusDamagePercent'];
  return item.properties
    .filter(p => stats.includes(p.name))
    .reduce((sum, p) => sum + p.amount, 0);
};

/**
 * Get the printed Vitality Health stat from an item's properties.
 */
const getVitalityHealth = (item: DeadlockUpgradeItem): number => {
  const stats = ['BonusHealth', 'BaseHealth', 'Health'];
  return item.properties
    .filter(p => stats.includes(p.name))
    .reduce((sum, p) => sum + p.amount, 0);
};

/**
 * Get the printed Spirit Power stat from an item's properties.
 */
const getSpiritPower = (item: DeadlockUpgradeItem): number => {
  const stats = ['SpiritPower', 'TechPower'];
  return item.properties
    .filter(p => stats.includes(p.name))
    .reduce((sum, p) => sum + p.amount, 0);
};

/**
 * Calculates the baseline exchange rates for weapon damage, vitality health, and spirit power
 * using multivariate linear regression on Tier 1 (500 soul) items.
 *
 * @param items List of all deadlock upgrades
 * @param investmentTracks The current investment tracks milestone data
 */
export function calculateExchangeRates(
  items: DeadlockUpgradeItem[],
  investmentTracks: InvestmentTracks
): ExchangeRates {
  // Filter for Tier 1 items (500 soul cost)
  const tier1Items = items.filter(item => item.weight === 500);

  // We need at least 3 items to run a regression on 3 variables
  if (tier1Items.length < 3) {
    return FALLBACK_RATES;
  }

  // Get first milestone bonuses (default to 0 if missing)
  const weaponBonus = investmentTracks.weapon[0]?.bonus ?? 0;
  const vitalityBonus = investmentTracks.vitality[0]?.bonus ?? 0;
  const spiritBonus = investmentTracks.spirit[0]?.bonus ?? 0;

  const X: number[][] = [];
  const Y: number[][] = [];

  for (const item of tier1Items) {
    const category = item.category.toLowerCase();

    // Inherent item properties
    let weaponDamage = getWeaponDamage(item);
    let vitalityHealth = getVitalityHealth(item);
    let spiritPower = getSpiritPower(item);

    // Apply category investment track bonuses
    if (category === 'weapon') {
      weaponDamage += weaponBonus;
    } else if (category === 'vitality') {
      vitalityHealth += vitalityBonus;
    } else if (category === 'spirit') {
      spiritPower += spiritBonus;
    }

    X.push([weaponDamage, vitalityHealth, spiritPower]);
    Y.push([item.weight]);
  }

  try {
    // Perform Multivariate Linear Regression with 0 intercept
    const mlr = new MLR(X, Y, { intercept: false });

    const weaponDamage = mlr.weights[0][0];
    const vitalityHealth = mlr.weights[1][0];
    const spiritPower = mlr.weights[2][0];

    // Check if the results are valid numbers and physically meaningful (greater than 0)
    if (
      isNaN(weaponDamage) || weaponDamage <= 0 ||
      isNaN(vitalityHealth) || vitalityHealth <= 0 ||
      isNaN(spiritPower) || spiritPower <= 0
    ) {
      return FALLBACK_RATES;
    }

    return {
      weaponDamage,
      vitalityHealth,
      spiritPower,
    };
  } catch (error) {
    console.error('Error running multivariate linear regression:', error);
    return FALLBACK_RATES;
  }
}
