Systems Analysis: Mathematical Frameworks for Resistance and Combat Equilibrium

1. Strategic Context of Combat Mitigation Systems

In the architecture of high-fidelity combat simulations, formalizing resistance frameworks is not merely an aesthetic choice but a mathematical necessity for maintaining competitive integrity. By utilizing formal logic to define damage mitigation, we prevent "power creep"—the systemic devaluation of legacy assets through incremental stat inflation—and ensure that Effective Health (eHP) scaling remains within predictable bounds. Without a transparent, mathematically rigorous foundation, the interaction between armor stacking and health pools inevitably collapses into unintended invulnerability loops or catastrophic TTK (Time-to-Kill) compression.

From the perspective of Adaptive Decision Making (ADM) theory, combat balancing must account for the tension between compensatory and non-compensatory strategies. Non-compensatory designs cater to novice players by emphasizing "Best Value" filtering on a single attribute (e.g., raw HP). However, our analysis confirms that veteran players with high product knowledge prioritize compensatory strategies, specifically the Weighted Addition (WADD) and Elimination by Aspects (EBA) methods. These players perform complex trade-off analyses, weighing gold-per-eHP efficiency against situational utility. To sustain a high-skill ceiling, the mathematical framework must support these multi-layered durability calculations.

2. Formalization of Resistance Stacking Formulas

To prevent 100% damage immunity, multi-source resistance stacking must be governed by multiplicative logic. Standardizing on a multiplicative model ensures that each subsequent item provides a marginal benefit relative to the remaining damage, rather than an additive increase that would lead to mathematical singularity.

The following framework integrates positive buffs and negative shredding into a unified Armor (A) value.

* Positive Resistance (B): The cumulative effect of all incoming buffs (r_n). B = 1 - (1-r_1) \times (1-r_2) \times \dots
* Negative Resistance (N): The cumulative effect of all reduction/debuff sources (n_n). N = 1 - (1-n_1) \times (1-n_2) \times \dots
* Total Integrated Armor (A): The additive interaction of B and N. A = B - N

Architectural Warning: To prevent unintended damage amplification in "Negative Armor" scenarios, the value of A must be clamped. In our environment, A is typically floor-clamped at -1.0 (-100% resistance), effectively doubling incoming damage as the limit.

The Diminishing Returns Effect (eHP Scaling)

While resistance values appear to grow slowly, the actual durability provided (marginal eHP gain) scales exponentially.

Item Sources	Stated Resistance	Actual Cumulative Resistance	Marginal eHP Gain (per unit)
Baseline	0%	0.00%	1.00x
Item 1 (+25%)	25%	25.00%	+33.33%
Item 2 (+30%)	30%	47.50%	+41.50%
Item 3 (+40%)	40%	68.50%	+66.80%

This non-linear relationship is the primary lever for balancing "Tank" archetypes against "Glass Cannon" builds.

3. Effective Health (eHP) and Survivability Modeling

Effective Health represents the true durability of a combatant by integrating raw Health Points (HP) with the mitigation layer. It is the ultimate metric for combat duration and tactical planning.

The formal model for eHP is defined as: eHP = \frac{HP}{1 - Resistance}

High-resistance stacking creates a logarithmic-linear tension. For instance, at 70% resistance, a character possesses 233.33% more tankiness than their base state. However, the impact on Time-to-Kill (TTK) at the extreme end of the spectrum is where the system faces the greatest risk of collapse.

TTK Delta Analysis (Target: 1,000 HP | Incoming DPS: 200):

* 0% Resistance: eHP = 1,000. TTK: 5 seconds.
* 50% Resistance: eHP = 2,000. TTK: 10 seconds.
* 90% Resistance: eHP = 10,000. TTK: 50 seconds.

The 10x increase in TTK at 90% resistance demonstrates why exponential scaling at the high end must be monitored via strict statistical regression to ensure targets remain killable within competitive windows.

4. Systemic Vulnerabilities: Negative Resistance & Shredding

"Resistance Shredders" serve as the primary strategic counter-weight to high-eHP builds. The efficacy of these debuffs is dictated by the "Shredder Paradox": a negative resistance debuff is mathematically more valuable when applied to a high-resistance target than a low-resistance one.

This occurs because shredding acts as a divisor of the mitigation layer rather than a linear subtraction of total HP.

Case Study: Vindica vs. Mo & Krill

* Vindica (Base -10% Resist): Purchasing a +25% Armor item moves her to 15% resistance (A = 0.25 - 0.10). Negative debuffs against her result in nearly linear damage increases because her mitigation layer is thin.
* Mo & Krill (High Resist): Through ability stacking, Mo & Krill can reach 99% resistance (taking only 1% of incoming damage). If a character like Mirage applies a -25% "Fire Scarab" debuff, the resistance drops to 74% (A = 0.99 - 0.25).
  * The Paradox: Incoming damage increases from 1% to 26%. This results in a 2600% increase in bullet damage against the high-resist target.

This illustrates that shredding is not a minor debuff but a catastrophic failure of the mitigation layer for "super-tank" builds.

5. Visualizing Balance: Scatter Plot Methodology

To identify balance outliers, we employ Scatter Diagrams and statistical regression. This allows us to move beyond anecdotal feedback and locate items or characters that deviate from the expected "Process Variation."

Six Sigma Guidelines for Combat Balance Scatter Plots

1. Variable Assignment: Define the X-axis as the Independent Variable (e.g., Item Gold Cost) and the Y-axis as the Dependent Variable (e.g., Total eHP).
2. Trend Test (Correlation Analysis):
  * Divide the plot into four quadrants by drawing a vertical line at X/2 and a horizontal line at Y/2.
  * Calculate A (points in upper-left + lower-right) and B (points in upper-right + lower-left).
  * Define Q as the smaller sum of A and B, and N as the total points (A + B).
  * If Q is less than the limit defined in the trend test table, a non-random correlation is confirmed, indicating a systemic balance issue rather than random variation.
3. Scatter Bands: Establish shaded bands around the regression line. Any item falling outside these bands represents a "Root Cause" outlier requiring an immediate balance pass.

Causation Warning: We must avoid the "Shark attacks and ice cream" fallacy. A high correlation between eHP and win rate does not prove the armor value is the cause; it may be an underlying attribute interaction, such as mobility or hit-box size, that allows the player to avoid shredding entirely.

6. Attribute-Based Tier Analysis (Comparative Proxy)

Using hardware capacity as a structural proxy, we evaluate item efficiency via a "Value Metric" to identify non-compensatory "Best Value" choices and premium outliers.

Item Proxy	Capacity (HP)	Read Speed (DPS)	Price (Cost)	Value (HP per Gold)
SanDisk Extreme Pro	512 GB	1000 MB/s	$137.99	3.71
Samsung Bar Plus	256 GB	400 MB/s	$69.39	3.69
SanDisk Ultra Flair	256 GB	150 MB/s	$30.71	8.33
Samsung MUF	128 GB	400 MB/s	$39.99	3.20
Aiibe	64 GB	25 MB/s	$12.99	4.92

Outlier Analysis:

* The Best Value: The SanDisk Ultra Flair (Value 8.33) is a non-compensatory outlier. It provides the highest efficiency for players prioritizing economy over peak performance.
* The Premium Outlier: The SanDisk Extreme Pro (Value 3.71) represents a "Power Tax." High-tier players pay a massive premium for the final marginal gains in DPS (Read Speed), accepting lower resource efficiency for absolute performance dominance.

7. Recommendations for System Equilibrium

To maintain a stable competitive environment, the following strategic directives are issued:

* Directive 1: Implement Advisor Agents. eHP and multiplicative stacking are non-intuitive. Use in-game "Suggested Build" UI to guide players. Research shows "Advice" narrows tool choice and significantly improves user performance in complex tasks.
* Directive 2: Diversify High-Motivation Toolsets. Recognizing that high-involvement players prefer compensatory strategies, the UI must support complex "trade-off" tools. Ensure accessibility to Scatter Plots (SP), Concept Maps (CM), and Goodness of Fit (GF) matrices to allow veterans to perform the WADD and EBA analyses they require.
* Directive 3: Implement Resistance Hard Caps. Given the exponential TTK growth as resistance approaches 100%, we must implement hard caps (e.g., 85-90%) or aggressive diminishing returns. This keeps process variation within the "Scatter Bands" and prevents mathematically induced invulnerability.

These protocols establish a foundation of mathematical rigor, ensuring that combat outcomes are determined by player decision-making rather than systemic exploits.

