# Phase 2: Contextual Efficiency & EHP (Survivability) - Specification

## Overview
This track implements the second phase of the Deadlock calculated traits: Survivability and EHP. The core objective is to compute and visualize accurate, contextual defensive metrics (marginal values, exponential resistance scaling, and active/conditional mitigation) while respecting game engine constraints like the 1-Damage Floor and the rigid 16-item inventory limit.

## Functional Requirements

### 1. Marginal Contextual Stat per Soul
- Implement calculations that compute the *marginal* rate of return for a purchase: `(Base Stat + Dynamic Milestone Delta) / Item Cost`.
- The baseline state must look up the user's current inventory spent souls per category to evaluate what investment track milestones are triggered when adding the item.
- Expose the following metrics:
  - **Marginal Health per Soul (MHpS)**
  - **Marginal Weapon Damage % per Soul (MWDpS)**
  - **Marginal Spirit Power per Soul (MSPpS)**

### 2. Parameterized EHP with 1-Damage Floor
- Calculate Effective Health Pool (EHP) using the formula:
  $$\text{Actual Damage} = \max(1, \text{Incoming Damage} \times (1 - \text{Resistance}))$$
  $$\text{EHP} = \text{Health} \times \frac{\text{Incoming Damage}}{\text{Actual Damage}}$$
- **Incoming Damage Parameterization:** 
  - Default incoming damage per hit/tick: **15 damage**.
  - Provide a UI dropdown to select an "Enemy Attacker" (e.g. Victor, Holliday, Infernus, Haze). Pulling their specific base bullet damage dynamically updates the incoming damage value to calculate the exact engagement threshold for the 1-damage floor.
  
### 3. Active EHP & Debuff Mitigation Selectable Axes
- Expose **Active EHP** (EHP during active item usage/buffs) and **Debuff Mitigation** (mitigation from fire rate reduction and on-hit debuffs) as separate, selectable axes in the scatter plot.
- Do *not* blend these temporary or active states into persistent EHP.
- Add visual indicators/status flags (e.g. badges or visual halos) to active defense items to signal they require mechanical execution and cooldown management.

### 4. Interactive Companion Sidebar (Marginal EHP Gain)
- Upon item selection, display a dedicated EHP line graph in the sidebar.
- The graph plots **Nominal Resistance** on the X-axis against **Effective Health** on the Y-axis, showcasing the exponential upward bend.
- Plot two distinct markers on the curve:
  1. The user's **current EHP** (before purchase).
  2. The user's **projected EHP** (after purchase), visualizing the true marginal yield of stacking defenses.

## Acceptance Criteria
- [ ] Marginal value logic successfully integrates category investment tracks and inventory state.
- [ ] 1-Damage Floor calculation is implemented and parameterized (default 15 damage).
- [ ] UI includes an "Enemy Attacker" dropdown that dynamically adjusts the EHP damage threshold.
- [ ] "Active EHP" and "Debuff Mitigation" are available as independent selectable axes on the scatter plot.
- [ ] Selecting an item renders a companion sidebar with an exponential EHP scaling curve plotting current and projected states.
- [ ] Unit tests cover all EHP and floor-engaged edge cases.

## Out of Scope
- DPS and fire rate calculations (Phase 3).
- Ability Premium Cost and Slot Consolidation Premium (Phase 4).
