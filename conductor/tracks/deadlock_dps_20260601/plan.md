# Implementation Plan: Deadlock Effective DPS Calculator

## Phase 1: Data Models and Utility Functions [checkpoint: 869f622]
- [x] Task: Define Data Structures and Interfaces 7c38579
    - [ ] Define `Hero` type/interface with properties for `shotTime`, `pauseTime`, `spiritConversions`, and ability coefficients. Ensure `spiritConversions` can handle bespoke conversions such as Haze's 50% and Yamato's 15% Spirit Power to ammo conversions, or Grey Talon and Warden's Spirit to Weapon Fire Rate conversions.
    - [ ] Define constants for target configuration state (Target Spirit Resistance, Target Bullet Resistance).
- [x] Task: Implement DPS Calculation Utilities (Red Phase - Tests) 7c38579
    - [ ] Write unit tests for Bullet DPS calculations (continuous vs. burst). Include specific mock tests for Paradox (`shotTime`: 0.38s, `pauseTime`: 0.28s), Lash (0.22s, 0.30s), and Seven (0.23s, 0.29s) to verify sub-linear scaling curves.
    - [ ] Write unit tests for Spirit DPS calculations (ranged vs. healing/duration classification). 
    - [ ] Write unit tests for Effective Final DPS calculations (diminishing returns and shred).
    - [ ] Write unit tests for Double-Mitigation Amplified Damage. Verify output against the known Escalating Exposure formula: `((Amp From EE) * (Res Modifier) + 1) * (Res Modifier) * (Base Damage)`.
- [x] Task: Implement DPS Calculation Utilities (Green Phase - Implementation) 7c38579
    - [ ] Implement `calculateBulletDPS` accounting for `shotTime` and `pauseTime`.
    - [ ] Implement a `ceiling()` mathematical wrapper for all current and maximum ammunition calculations, as the game engine strictly rounds up partial ammo percentages.
    - [ ] Implement `calculateSpiritDPS` with correct sequence for utility modifiers.
    - [ ] Implement `calculateEffectiveResistance` and `calculateEffectiveDPS`.
    - [ ] Implement `calculateAmplifiedDamage` with double mitigation.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Models and Utility Functions' (Protocol in workflow.md)

## Phase 2: UI State Management and Sidebar Components
- [x] Task: Add State Management for Hero Selection and Target Settings (Red Phase - Tests) cf90d3d
    - [ ] Write tests for state updates related to Hero selection and target configuration sliders.
- [x] Task: Implement Sidebar Global Settings UI (Green Phase - Implementation) e42c8de
    - [ ] Add Hero Selection dropdown to `ArmorChartSidebar.tsx` (or new component).
    - [ ] Add Target Spirit Resistance and Target Bullet Resistance sliders to the sidebar.
    - [ ] Add input toggles for "Active Shred" items applied to the target (e.g., Hunter's Aura, Bullet Resist Shredder) to accurately calculate the sequential `A = B - N` resistance formula.
    - [ ] Connect sidebar controls to main chart state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI State Management and Sidebar Components' (Protocol in workflow.md)

## Phase 3: Plot Axis Integration & Pareto Updates
- [x] Task: Integrate Calculated DPS Stats into Plot Axes (Green Phase - Implementation) 8a1f810
    - [x] Update `EquipmentChart/index.tsx` to compute `Final Bullet DPS` and `Final Spirit DPS` for each item dynamically based on `targetConfig` and `selectedHero`.
    - [x] Inject these calculated stats into the scatter plot's axes data using `getAvailableStats` extensions.
- [x] Task: Update Scatter Plot and Pareto Frontier Rendering (Green Phase - Implementation) 8a1f810
    - [x] Ensure the declarative `@observablehq/plot` properly uses `Final Bullet DPS` as an axis, recalculating the `hull` shape when resistance inputs change.
- [x] Task: Update Comparison Modal (Green Phase - Implementation) 8a1f810
    - [x] Ensure the Comparison Table displays the custom DPS properties correctly alongside base stats.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Plot Axis Integration & Pareto Updates' (Protocol in workflow.md)
