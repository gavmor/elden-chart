import { describe, it, expect } from 'vitest';
import { BoonEngine } from './BoonEngine';

describe('BoonEngine', () => {
  it('initializes with default values', () => {
    const engine = new BoonEngine();
    const state = engine.calculateState();

    expect(engine.highestAchievedSouls).toBe(0);
    expect(engine.urnDeliveries).toBe(0);
    expect(state.currentBoons).toBe(0);
    expect(state.abilityPointsGranted).toBe(0);
    expect(state.isUltimateUnlocked).toBe(false);
    expect(state.nextBoonDelta).toBe(400); // 400 Souls for Boon 1
  });

  it('rewards first AP at exactly 400 cumulative Souls', () => {
    const engine = new BoonEngine();
    
    engine.updateSouls(399);
    expect(engine.calculateState().abilityPointsGranted).toBe(0);
    expect(engine.calculateState().currentBoons).toBe(0);

    engine.updateSouls(400);
    expect(engine.calculateState().abilityPointsGranted).toBe(1);
    expect(engine.calculateState().currentBoons).toBe(1);
    expect(engine.calculateState().nextBoonDelta).toBe(400); // 400 more for Boon 2 (800 total)
  });

  it('unlocks ultimate ability milestone at exactly 3,000 Souls', () => {
    const engine = new BoonEngine();
    
    engine.updateSouls(2999);
    expect(engine.calculateState().isUltimateUnlocked).toBe(false);

    engine.updateSouls(3000);
    const state = engine.calculateState();
    expect(state.isUltimateUnlocked).toBe(true);
    expect(state.currentBoons).toBe(7); // 3,000 threshold corresponds to Boon 7
    expect(state.abilityPointsGranted).toBe(7);
  });

  it('skips AP allocation on stat-only progression milestones', () => {
    const engine = new BoonEngine();

    // Boon 9 threshold is 4,000 (AP 9)
    // Boon 10 threshold is 5,000 (AP 10)
    // Boon 11 threshold is 6,200 (Stat increase only - AP remains 10)
    // Boon 12 threshold is 7,600 (AP 11)

    engine.updateSouls(5000);
    expect(engine.calculateState().currentBoons).toBe(10);
    expect(engine.calculateState().abilityPointsGranted).toBe(10);

    engine.updateSouls(6200);
    expect(engine.calculateState().currentBoons).toBe(11);
    expect(engine.calculateState().abilityPointsGranted).toBe(10); // Still 10 AP!

    engine.updateSouls(7600);
    expect(engine.calculateState().currentBoons).toBe(12);
    expect(engine.calculateState().abilityPointsGranted).toBe(11); // Incremented to 11 AP
  });

  it('levels out late-game scaling after 13.2k with +1.5k intervals', () => {
    const engine = new BoonEngine();

    // Boon 15 threshold is 13,200 (AP 14, since Boon 11 is stat-only)
    // Boon 16 threshold is 14,700 (+1,500)
    // Boon 17 threshold is 16,200 (+1,500)

    engine.updateSouls(13200);
    expect(engine.calculateState().currentBoons).toBe(15);
    expect(engine.calculateState().abilityPointsGranted).toBe(14);
    expect(engine.calculateState().nextBoonDelta).toBe(1500); // delta to 14,700

    engine.updateSouls(14700);
    expect(engine.calculateState().currentBoons).toBe(16);
    expect(engine.calculateState().abilityPointsGranted).toBe(15);
  });

  it('reaches maximum progression limit at 40,000 Souls awarding exactly 30 base AP', () => {
    const engine = new BoonEngine();

    engine.updateSouls(40000);
    const state = engine.calculateState();

    expect(state.currentBoons).toBe(33); // 33 total Boons
    expect(state.abilityPointsGranted).toBe(30); // 30 AP (33 Boons - 3 stat-only)
    expect(state.nextBoonDelta).toBeNull(); // No further milestones

    // Exceeding the cap does not award further Boons
    engine.updateSouls(50000);
    expect(engine.calculateState().currentBoons).toBe(33);
    expect(engine.calculateState().abilityPointsGranted).toBe(30);
  });

  it('grants exclusive carrier bonus AP upon successful Soul Urn delivery', () => {
    const engine = new BoonEngine();

    // Level Boon AP at 2,000 Souls is 5 AP
    engine.updateSouls(2000);
    expect(engine.calculateState().abilityPointsGranted).toBe(5);

    // Deliver Urn bypasses scaling thresholds
    engine.deliverUrn();
    expect(engine.calculateState().abilityPointsGranted).toBe(6);
    expect(engine.urnDeliveries).toBe(1);

    // Multiple deliveries scale linearly
    engine.deliverUrn();
    expect(engine.calculateState().abilityPointsGranted).toBe(7);
    expect(engine.urnDeliveries).toBe(2);

    // Revoke Urn delivery
    engine.revokeUrn();
    expect(engine.calculateState().abilityPointsGranted).toBe(6);
  });

  it('tracks the maximum soul count achieved and ignores bankruptcies or drops', () => {
    const engine = new BoonEngine(3000); // starts with 3,000 souls (Boon 7 achieved)
    expect(engine.calculateState().currentBoons).toBe(7);

    // Bankrupting to 0 does not decrease level milestones (highest achieved net worth is preserved)
    engine.updateSouls(0);
    expect(engine.highestAchievedSouls).toBe(3000);
    expect(engine.calculateState().currentBoons).toBe(7);
  });
});
