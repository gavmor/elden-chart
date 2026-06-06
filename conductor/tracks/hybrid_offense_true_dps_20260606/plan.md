# Implementation Plan: Hybrid Offense & True DPS (Damage)

## Phase 1: Burst-Fire `cycleTime` & Ammunition Mechanics (TDD)
- [ ] Task: Implement logarithmic fire-rate penalties for burst heroes (TDD)
    - [ ] Write failing tests validating `cycleTime = shotTime + (pauseTime / (1 + fireRate))` for Seven, Lash, Paradox
    - [ ] Implement burst-fire cycleTime penalty into the Base DPS calculators
- [ ] Task: Implement Ammunition Ceiling and Reload Bypass Mechanics (TDD)
    - [ ] Write failing tests validating `ceil` function for max ammo step-functions
    - [ ] Write failing tests validating true reload bypass sustains temporary buffs (unlike Active Reload)
    - [ ] Implement ammo and reload bypass calculations into Sustained DPS mechanics
- [ ] Task: Conductor - User Manual Verification 'Burst-Fire `cycleTime` & Ammunition Mechanics' (Protocol in workflow.md)

## Phase 2: Combined Hybrid DPS Metric (TDD)
- [ ] Task: Implement Combined Hybrid DPS splitting (TDD)
    - [ ] Write failing tests validating Infernus, Wraith, Haze, Warden on-hit spirit damage correctly bifurcates from physical bullet damage
    - [ ] Write failing tests ensuring split spirit damage targets Spirit Resistance and bypasses physical immunities (Metal Skin)
    - [ ] Implement `Combined Hybrid DPS / Soul` metric calculation
- [ ] Task: Conductor - User Manual Verification 'Combined Hybrid DPS Metric' (Protocol in workflow.md)

## Phase 3: Bifurcated Damage Amplification Model (TDD)
- [ ] Task: Implement Escalating Exposure Double-Mitigation Penalty (TDD)
    - [ ] Write failing tests verifying *Escalating Exposure* is mitigated twice and cannot reach single-tick *Mystic Burst* thresholds
    - [ ] Write passing tests verifying *Soul Shredder* applies linear amplification and correctly triggers single-tick thresholds
    - [ ] Implement bifurcated amplification algorithms in the DPS calculators
- [ ] Task: Conductor - User Manual Verification 'Bifurcated Damage Amplification Model' (Protocol in workflow.md)

## Phase 4: Spatial Distance Mapping (TDD/UI)
- [ ] Task: Implement Engagement Distance UI and Backend Re-calculation (TDD/UI)
    - [ ] Write failing tests validating Additive Bullet Velocity scaling over defined ranges
    - [ ] Add interactive Global Engagement Distance Slider (0m - 50m) to recalculate Y-axis in real-time
    - [ ] Implement the Companion Sidebar Plot (DPS vs. Distance) to render line graphs for specific hovered/selected items
- [ ] Task: Conductor - User Manual Verification 'Spatial Distance Mapping' (Protocol in workflow.md)
