# Implementation Plan - Phase 2: Contextual Efficiency & EHP (Survivability)

## Phase 1: Domain Calculations (TDD) [checkpoint: 46453cd]
- [x] Task: Implement marginal stat calculations and EHP with 1-Damage Floor (TDD) (2e07e2a)
    - [x] Write failing tests verifying marginal health, damage, and spirit calculations (taking current spent souls and milestones into account)
    - [x] Write failing tests verifying EHP calculations with 1-damage floor constraint and parameterized incoming damage
    - [x] Implement marginal calculators and EHP math in `src/components/domain/math.ts`
- [x] Task: Conductor - User Manual Verification 'Domain Calculations' (Protocol in workflow.md)

## Phase 2: Attacker Data & UI Selectors (TDD)
- [x] Task: Expose base bullet damage and implement Enemy Attacker selection (TDD) (0689f7b)
    - [x] Write failing tests verifying hero dictionary has base bullet damage properties
    - [x] Create Attacker Dropdown component allowing selection of enemy hero
    - [x] Bind selected attacker's bullet damage to the EHP calculation context
- [x] Task: Conductor - User Manual Verification 'Attacker Data & UI Selectors' (Protocol in workflow.md)

## Phase 3: Active EHP & Debuff Mitigation Axes (TDD)
- [x] Task: Expose Active EHP and Debuff Mitigation stats as plot axes (TDD)
    - [x] Write failing tests verifying Juggernaut active EHP scaling and Plated Armor debuff mitigation calculations
    - [x] Expose 'Active EHP' and 'Debuff Mitigation' as selectable axes in `STAT_OPTIONS`
    - [x] Add visual badges/flags to identify active defensive items in the plot
- [x] Task: Conductor - User Manual Verification 'Active EHP & Debuff Mitigation Axes' (Protocol in workflow.md)

## Phase 4: Companion Sidebar Visualization (TDD/UI)
- [ ] Task: Implement Marginal EHP Gain line chart in sidebar (TDD/UI)
    - [ ] Write tests verifying coordinates generation for EHP vs. Resistance curve
    - [ ] Implement EHP curve visualization in the item details sidebar using current and projected markers
- [ ] Task: Conductor - User Manual Verification 'Companion Sidebar Visualization' (Protocol in workflow.md)
