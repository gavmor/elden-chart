# Specification: Deadlock Effective DPS Calculator

## Overview
Implement advanced calculated statistics for the Deadlock visualizer, allowing users to analyze effective Damage Per Second (DPS) based on weapon behavior (continuous vs. burst), Spirit Power coefficients, target resistances, and damage amplification. These calculated stats will be selectable as X/Y axes in the scatter plot and viewable in the side-by-side Compare Modal.

## Functional Requirements
1. **Hero Selection:**
   - Add a Hero Selection dropdown in the UI.
   - The selected hero determines base variables for calculations: `shotTime` and `pauseTime` for burst-fire weapons, unique base stat modifiers (e.g., Haze converting Spirit Power to ammo), and specific Spirit Coefficients for abilities.
2. **Global Target Settings:**
   - Add global sliders/inputs in the sidebar for Target configuration (e.g., Target Spirit Resistance, Target Bullet Resistance).
   - Any adjustments to these global settings must dynamically update the plot and modal data in real-time.
3. **Bullet DPS Calculation:**
   - Distinguish between continuous-fire and burst-fire weapon scaling.
   - For continuous-fire: apply linear scaling for fire rate modifiers.
   - For burst-fire (e.g., Paradox, Lash, Seven): Apply fire rate items only to `pauseTime`. Multiplier formula: `(shotTime + pauseTime) / (shotTime + (pauseTime / (1 + fireRate)))`.
4. **Spirit DPS Calculation:**
   - Implement ability classification (ranged vs healing/duration) to correctly sequence percentage-based utility modifiers vs flat Spirit Power scaling.
   - Accurately process Double-Mitigation Amplified Damage (e.g., Escalating Exposure), mitigating the amplified damage by the target's spirit resistance a second time.
5. **Effective Final DPS Calculation:**
   - Calculate combined positive resistance and combined active shred with inverted diminishing returns: `A = B - N`, where `B = 1 - product(1 - Ri)` and `N = 1 - product(1 - Sj)`.
   - Use the Final Active Resistance (A) to reduce raw damage into Effective Final DPS.
6. **Data Visualization:**
   - Add the new calculated metrics to the list of selectable X/Y axes in the scatter plot configuration.
   - Include these metrics in the side-by-side Compare Modal for detailed item analysis.

## Out of Scope
- Detailed simulation of specific ability animations or projectile travel times.
- Dynamic in-game target dummy placement (handled via global sliders instead).
