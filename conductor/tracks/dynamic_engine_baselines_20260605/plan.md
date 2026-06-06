# Implementation Plan - Phase 1: Dynamic Engine Baselines

## Phase 1: Data Fetching and Package Setup
- [ ] Task: Install `ml-regression-multivariate-linear` package
- [ ] Task: Enhance `deadlockApi.ts` query hooks (TDD)
    - [ ] Write failing test for fetching Investment Track milestones and Item data from API
    - [ ] Implement query logic to fetch from a community API
- [ ] Task: Conductor - User Manual Verification 'Data Fetching and Package Setup' (Protocol in workflow.md)

## Phase 2: Multivariate Linear Regression Implementation
- [ ] Task: Create `calculateExchangeRates.ts` utility (TDD)
    - [ ] Write failing tests modeling Tier 1 items and their expected fractional soul values
    - [ ] Implement parsing of item data into X (features) and Y (soul cost) matrices
    - [ ] Implement MLR algorithm to compute the baseline exchange rates
- [ ] Task: Conductor - User Manual Verification 'Multivariate Linear Regression Implementation' (Protocol in workflow.md)

## Phase 3: Integration and State Access
- [ ] Task: Update TanStack Query hooks to expose calculated baselines (TDD)
    - [ ] Write failing tests ensuring exchange rates and investment milestones are exposed via the `select` transform
    - [ ] Implement the integration of `calculateExchangeRates` into the existing query selectors
- [ ] Task: Conductor - User Manual Verification 'Integration and State Access' (Protocol in workflow.md)
