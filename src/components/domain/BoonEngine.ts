/**
 * Domain service representing the automated Boon and leveling progression system in Deadlock.
 * Governs the non-linear conversion of Cumulative Souls into Boons and Ability Points (AP),
 * handles ultimate ability unlocks, and incorporates Urn delivery bonuses.
 */
export interface BoonState {
  currentBoons: number;
  highestAchievedSouls: number;
  abilityPointsGranted: number;
  isUltimateUnlocked: boolean;
  urnDeliveries: number;
  nextBoonDelta: number | null; // Souls required to hit the next level (null if at cap)
}

export class BoonEngine {
  // Exact 33 Boon thresholds mapping to cumulative Soul counts
  private static readonly BOON_THRESHOLDS: number[] = [
    400,   // Boon 1 (AP +1)
    800,   // Boon 2 (AP +1)
    1200,  // Boon 3 (AP +1)
    1600,  // Boon 4 (AP +1)
    2000,  // Boon 5 (AP +1)
    2500,  // Boon 6 (AP +1)
    3000,  // Boon 7 (AP +1) - Ultimate Gate!
    3500,  // Boon 8 (AP +1)
    4000,  // Boon 9 (AP +1)
    5000,  // Boon 10 (AP +1)
    6200,  // Boon 11 (Stat Increase Only - No AP)
    7600,  // Boon 12 (AP +1)
    9200,  // Boon 13 (AP +1)
    11000, // Boon 14 (AP +1)
    13200, // Boon 15 (AP +1) - Peak of early scaling curve
    14700, // Boon 16 (AP +1) - Late game +1.5k intervals start
    16200, // Boon 17 (AP +1)
    17700, // Boon 18 (AP +1)
    19200, // Boon 19 (AP +1)
    20700, // Boon 20 (AP +1)
    22200, // Boon 21 (Stat Increase Only - No AP)
    23700, // Boon 22 (AP +1)
    25200, // Boon 23 (AP +1)
    26700, // Boon 24 (AP +1)
    28200, // Boon 25 (AP +1)
    29700, // Boon 26 (AP +1)
    31200, // Boon 27 (AP +1)
    32700, // Boon 28 (AP +1)
    34200, // Boon 29 (AP +1)
    35700, // Boon 30 (AP +1)
    37200, // Boon 31 (Stat Increase Only - No AP)
    38700, // Boon 32 (AP +1)
    40000, // Boon 33 (AP +1) - Absolute Progression Cap
  ];

  // Specific Boon indexes that only grant base stat increases and do NOT grant AP (1-indexed)
  private static readonly STAT_ONLY_BOONS = new Set([11, 21, 31]);

  private _highestAchievedSouls = 0;
  private _urnDeliveries = 0;

  constructor(initialSouls = 0, urnDeliveries = 0) {
    this._highestAchievedSouls = Math.max(0, initialSouls);
    this._urnDeliveries = Math.max(0, urnDeliveries);
  }

  public get highestAchievedSouls(): number {
    return this._highestAchievedSouls;
  }

  public get urnDeliveries(): number {
    return this._urnDeliveries;
  }

  /**
   * Tracks a net worth update. If cumulative net worth increases, we record the
   * highest achieved soul threshold.
   */
  public updateSouls(souls: number): void {
    if (souls > this._highestAchievedSouls) {
      this._highestAchievedSouls = souls;
    }
  }

  /**
   * Record a successful Soul Urn delivery, awarding +1 bonus AP to the carrier.
   */
  public deliverUrn(): void {
    this._urnDeliveries++;
  }

  /**
   * Remove a Soul Urn delivery.
   */
  public revokeUrn(): void {
    if (this._urnDeliveries > 0) {
      this._urnDeliveries--;
    }
  }

  /**
   * Resets the carrier's state.
   */
  public reset(): void {
    this._highestAchievedSouls = 0;
    this._urnDeliveries = 0;
  }

  /**
   * Calculates the current Boon levels, unlocked abilities, and total AP yield.
   */
  public calculateState(): BoonState {
    let currentBoons = 0;
    let baseApGranted = 0;

    // Calculate Boons achieved
    for (let i = 0; i < BoonEngine.BOON_THRESHOLDS.length; i++) {
      const threshold = BoonEngine.BOON_THRESHOLDS[i];
      if (this._highestAchievedSouls >= threshold) {
        currentBoons = i + 1;
        // Grant AP if this milestone is not a stat-only level
        if (!BoonEngine.STAT_ONLY_BOONS.has(currentBoons)) {
          baseApGranted++;
        }
      } else {
        break;
      }
    }

    // Ultimate ability unlocks at exactly 3,000 Souls
    const isUltimateUnlocked = this._highestAchievedSouls >= 3000;

    // Total AP = Boon AP + Soul Urn Carrier Bonus AP
    const abilityPointsGranted = baseApGranted + this._urnDeliveries;

    // Determine soul delta to trigger the next milestone
    let nextBoonDelta: number | null = null;
    if (currentBoons < BoonEngine.BOON_THRESHOLDS.length) {
      const nextThreshold = BoonEngine.BOON_THRESHOLDS[currentBoons];
      nextBoonDelta = Math.max(0, nextThreshold - this._highestAchievedSouls);
    }

    return {
      currentBoons,
      highestAchievedSouls: this._highestAchievedSouls,
      abilityPointsGranted,
      isUltimateUnlocked,
      urnDeliveries: this._urnDeliveries,
      nextBoonDelta,
    };
  }

  /**
   * Static helper to get the Soul threshold for a given Boon milestone index (1-indexed).
   */
  public static getThresholdForBoon(boonIndex: number): number | null {
    if (boonIndex < 1 || boonIndex > this.BOON_THRESHOLDS.length) return null;
    return this.BOON_THRESHOLDS[boonIndex - 1];
  }
}
