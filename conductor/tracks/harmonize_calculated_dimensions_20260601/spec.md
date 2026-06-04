# Specification: Harmonize Calculated Dimensions Architecture

## Overview
This track resolves the architectural differences and git conflicts between the "Calculated Dimensions" implementation (from the base branch) and the "Deadlock DPS" implementation (from our current branch). The goal is to unify all calculated metrics (such as `Final Bullet DPS`, `Final Spirit DPS`, `Effective HP`, and `Total Integrated Armor`) under a single, reactive architectural pattern inside `utils.ts`, and to successfully complete the ongoing git rebase.

## Functional Requirements
1. **Resolve Rebase Conflicts:**
   - Resolve conflicts in `src/components/EquipmentChart/Sidebar.tsx` by logically sequencing the "Calculated Dimensions" UI block and the "Deadlock DPS Configuration" UI block.
   - Resolve conflicts in `src/components/EquipmentChart/index.tsx` by preserving the Deadlock DPS `syncedCustomSet` logic while incorporating the new log-scale parameters for `ChartDimensions`.
   - Resolve conflicts in `conductor/tracks.md`.
2. **Unified `SimulationContext`:**
   - Introduce a `SimulationContext` interface containing `customSet` (or `BuildSet`), `hero`, and `targetConfig`.
   - Update `getItemStat` in `utils.ts` to accept an optional `SimulationContext`.
3. **Migrate Metrics:**
   - Move the dynamic DPS calculation logic out of the mapping phase in `index.tsx` and into `getItemStat` in `utils.ts`.
   - Refactor the existing HP/Defense metrics (`ehp`, `integrated_armor`, `ehp_per_soul`) to utilize the new `SimulationContext` where applicable.
4. **Update Dropdowns:**
   - Ensure that `Final Bullet DPS` and `Final Spirit DPS` are explicitly declared in the "Calculated Metrics" group within `getAvailableStats` for a unified UX.

## Acceptance Criteria
- `git status` shows a clean working tree with the rebase successfully completed (`git rebase --continue`).
- The scatter plot correctly updates its layout when any state (hero, target config, build set, log scales) is changed.
- `getItemStat` correctly computes both DPS and Defense metrics using the active simulation context.
- The UI dropdowns display all calculated dimensions under a single "Calculated Metrics" section.
