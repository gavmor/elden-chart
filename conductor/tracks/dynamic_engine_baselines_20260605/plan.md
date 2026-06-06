# Implementation Plan - Phase 1: Dynamic Engine Baselines

## Phase 1: Data Fetching and Package Setup [checkpoint: 8f80b94]
- [x] Task: Install `ml-regression-multivariate-linear` package (c0d4164)
- [x] Task: Enhance `deadlockApi.ts` query hooks (TDD) (fc0813e)
    - [x] Write failing test for fetching Investment Track milestones and Item data from API (fc0813e)
    - [x] Implement query logic to fetch from a community API (fc0813e)
- [x] Task: Conductor - User Manual Verification 'Data Fetching and Package Setup' (Protocol in workflow.md) (8f80b94)

## Phase 2: Multivariate Linear Regression Implementation [checkpoint: a0ba3a9]
- [x] Task: Create `calculateExchangeRates.ts` utility (TDD) (6cca898)
    - [x] Write failing tests modeling Tier 1 items and their expected fractional soul values
    - [x] Implement parsing of item data into X (features) and Y (soul cost) matrices
    - [x] Implement MLR algorithm to compute the baseline exchange rates
- [x] Task: Conductor - User Manual Verification 'Multivariate Linear Regression Implementation' (Protocol in workflow.md)

## Phase 3: Integration and State Access
- [ ] Task: Update TanStack Query hooks to expose calculated baselines (TDD)
    - [ ] Write failing tests ensuring exchange rates and investment milestones are exposed via the `select` transform
    - [ ] Implement the integration of `calculateExchangeRates` into the existing query selectors
- [ ] Task: Conductor - User Manual Verification 'Integration and State Access' (Protocol in workflow.md)
