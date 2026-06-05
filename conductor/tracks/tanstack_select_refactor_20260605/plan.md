# Implementation Plan

## Phase 1: Refactor Deadlock Data Fetching Hooks
- [x] Task: Update `src/hooks/deadlockApi.ts`
    - [x] Modify `fetchDeadlockItems` and `fetchDeadlockAbilities` to return raw API responses instead of transforming them internally.
    - [x] Ensure `transformDeadlockItems` and `transformDeadlockAbilities` are stable, exported functions outside the component.
    - [x] Update `useDeadlockData` hook to pass the stable transformation functions into the `select` option.
- [x] Task: Update Deadlock tests
    - [x] Update `src/hooks/deadlockApi.test.ts` to assert that `queryFn` returns raw data and `select` transforms it correctly.
- [~] Task: Conductor - User Manual Verification 'Refactor Deadlock Data Fetching Hooks' (Protocol in workflow.md)

## Phase 2: Refactor Elden Ring Data Fetching Hooks
- [ ] Task: Update `src/hooks/useEquipmentData.ts`
    - [ ] Refactor the internal sequential fetcher (`fetchPages`) to return an array of raw API pages.
    - [ ] Extract the deduplication, parsing, and normalization logic into a stable, pure transformation function outside the hook.
    - [ ] Update the `useQuery` configuration to apply the pure transformation function via the `select` option.
- [ ] Task: Update Elden Ring tests
    - [ ] Update `src/hooks/useEquipmentData.test.ts` to align with the new fetching and transformation separation.
- [ ] Task: Conductor - User Manual Verification 'Refactor Elden Ring Data Fetching Hooks' (Protocol in workflow.md)
