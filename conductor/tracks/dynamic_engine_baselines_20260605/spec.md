# Phase 1: Dynamic Engine Baselines - Specification

## Overview
This track initiates the first phase of the Deadlock calculated traits implementation. The core objective is to establish the dynamic backend baseline data, allowing the application to accurately quantify "Soul Value" efficiency for complex item theorycrafting. 

## Functional Requirements
1. **Dynamic Engine Baselines API Integration**
   - Fetch the current patch data from a community Deadlock API.
   - Extract and cache the Investment Track milestones (e.g., Weapon track percentages, Vitality health spikes).
2. **Multivariate Linear Regression Engine**
   - Utilize the `ml-regression-multivariate-linear` package to compute base exchange rates.
   - Using Tier 1 (500 soul) items, perform a regression where the soul cost is the dependent variable and the provided stats (including hidden investment track bonuses) are the independent variables.
   - Isolate the true, fractional soul cost for primitive attributes (e.g., 1 Health, 1 Spirit Power).
3. **Data Availability**
   - Output the solved exchange rates and investment milestones as a stable reactive state (via TanStack Query) to be consumed by Phase 2 EHP/DPS calculators.

## Non-Functional Requirements
- **Dynamic Updates**: The system must not hardcode balance numbers; it must seamlessly self-correct when patches change item stats.
- **Client-Side Processing**: The linear regression must run efficiently in the browser without excessive bundle bloat.

## Acceptance Criteria
- [ ] Application successfully connects to a Deadlock API and fetches the latest item and patch data.
- [ ] `ml-regression-multivariate-linear` is integrated.
- [ ] The system accurately calculates and outputs the Soul Value exchange rate for primitive stats (Health, Weapon Damage, Spirit Power).
- [ ] Investment Track milestones are parameterized and accessible via a lookup map.

## Out of Scope
- Visual rendering of the scatter plots (Phase 4).
- DPS and EHP efficiency calculations (Phases 2 and 3).
