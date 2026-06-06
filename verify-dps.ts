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

console.log("Verification Complete. If the values match expectations, the phase is successful.");
