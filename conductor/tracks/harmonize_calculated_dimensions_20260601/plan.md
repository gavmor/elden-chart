## Phase 1: Resolve Git Conflicts
- [ ] Task: Manually resolve conflicts in `src/components/EquipmentChart/Sidebar.tsx` (Merge "Calculated Dimensions" and "Deadlock DPS Configuration" UI blocks).
- [ ] Task: Manually resolve conflicts in `src/components/EquipmentChart/index.tsx` (Merge log-scale `ChartDimensions` parameters and `syncedCustomSet` logic).
- [ ] Task: Manually resolve conflicts in `conductor/tracks.md`.
- [ ] Task: Run `git rebase --continue` to finalize the rebase state so the branch is clean before refactoring.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Resolve Git Conflicts' (Protocol in workflow.md)

## Phase 2: Harmonize Calculated Metrics Architecture
- [ ] Task: Define the `SimulationContext` interface (containing Hero, TargetConfig, and BuildSet) in `src/components/types.ts`.
- [ ] Task: Update `getItemStat` in `src/components/utils.ts` to accept the `SimulationContext`.
- [ ] Task: Move the `Final Bullet DPS` and `Final Spirit DPS` calculation logic from `index.tsx` into `getItemStat`.
- [ ] Task: Refactor the HP/Defense metrics in `getItemStat` to utilize `SimulationContext` where applicable.
- [ ] Task: Update `getAvailableStats` to explicitly group the DPS metrics under the "Calculated Metrics" section.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Harmonize Calculated Metrics Architecture' (Protocol in workflow.md)

## Phase 3: Update Call Sites and Validate
- [ ] Task: Update all call sites of `getItemStat` in `EquipmentChart/index.tsx`, `EquipmentChart/Plot.tsx`, and `EquipmentCompareModal` to pass the active `SimulationContext`.
- [ ] Task: Verify that the scatter plot recalculates correctly when Target Configuration sliders or Hero selections change.
- [ ] Task: Run `pnpm test` and `pnpm tsc -b` to ensure all type-checks and tests pass.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Update Call Sites and Validate' (Protocol in workflow.md)
