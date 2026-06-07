import { calculateBulletDPS, calculateSustainedDPS, applyAmmoCeiling } from './src/components/deadlock-dps.js';

console.log("=== Manual Verification: Burst-Fire & Ammunition Mechanics ===\n");

console.log("1. Burst-fire cycleTime Scaling Penalty");
const shotTime = 0.38;
const pauseTime = 0.28;
const dps = calculateBulletDPS(100, shotTime, pauseTime, 0.5);
console.log(`Paradox with +50% fire rate: DPS multiplier is ${dps / 100} (Should be sub-linear ~1.16x instead of 1.5x)\n`);

console.log("2. Ammunition Ceiling Mechanics");
console.log(`Max Ammo (Base 46, +0.5% Ammo): ${applyAmmoCeiling(46 * 1.005)} (Should round up to 47)\n`);

console.log("3. Sustained DPS with Active Reload vs Reload Bypass");
const activeReloadDps = calculateSustainedDPS(10, 5, 20, 2.0, 0, 1.0);
console.log(`Sustained DPS (Active Reload 1s): ${activeReloadDps} (Should be 40)`);
const bypassDps = calculateSustainedDPS(10, 5, 20, 2.0, 1);
console.log(`Sustained DPS (Reload Bypass 1x): ${bypassDps} (Should be 40)\n`);

console.log("Verification Complete for Phase 1.\n");

import { calculateCombinedHybridDPS, calculateHybridDPSPerSoul } from './src/components/deadlock-dps.js';

console.log("=== Manual Verification: Combined Hybrid DPS Metric ===\n");

console.log("1. Bifurcated Damage (Physical + Spirit)");
const totalDPS1 = calculateCombinedHybridDPS(100, 50, 0.2, 0.1);
console.log(`Expected: 125 | Actual: ${totalDPS1}`);

console.log("\n2. Physical Immunities Bypassed by Spirit Damage");
const totalDPS2 = calculateCombinedHybridDPS(100, 50, 1.0, 0.0);
console.log(`Expected: 50 | Actual: ${totalDPS2}`);

console.log("\n3. Hybrid DPS per Soul Metric");
const perSoul = calculateHybridDPSPerSoul(125, 3000);
console.log(`Expected: ~0.0416 | Actual: ${perSoul}`);

console.log("Verification Complete for Phase 2.\n");

import { calculateLinearAmplification, calculateDoubleMitigationAmplification } from './src/components/deadlock-dps.js';

console.log("=== Manual Verification: Bifurcated Damage Amplification Model ===\n");

const baseDamage = 100;
const ampRatio = 0.12; // 12% amplification
const targetResistance = 0.25; // 25% base resistance

console.log("1. Double-Mitigation (Escalating Exposure)");
const eeResult = calculateDoubleMitigationAmplification(baseDamage, ampRatio, targetResistance);
console.log(`Expected Total Damage: ~81.75 | Actual: ${eeResult.totalDamage}`);
console.log(`Expected Single Tick (Highest): 75 | Actual: ${eeResult.highestSingleTick}`);

console.log("\n2. Linear Amplification (Soul Shredder)");
const ssResult = calculateLinearAmplification(baseDamage, ampRatio, targetResistance);
console.log(`Expected Total Damage: 84 | Actual: ${ssResult.totalDamage}`);
console.log(`Expected Single Tick (Highest): 84 | Actual: ${ssResult.highestSingleTick}`);

console.log("\nVerification Complete. If the values match expectations, the phase is successful.");
