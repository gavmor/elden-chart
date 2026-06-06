# Proposed Calculated Traits for Deadlock Items: Efficiency and Utility Analysis

## 1. Introduction: The "Gigabytes per Dollar" Analogy
In consumer electronics, shoppers rarely buy products based solely on absolute capacity or absolute price; instead, they optimize for value, most commonly expressed as *Gigabytes per Dollar*. 

In the Deadlock economy, players face a similar optimization problem. Items cost "Souls" (the currency equivalent to dollars), and they provide specific stats or passive/active effects (the equivalent of gigabytes). Therefore, establishing calculated traits that reflect **Stat per Soul** efficiency is paramount for theoretical item analysis.

This document proposes an exhaustive list of calculated traits that can be derived from Deadlock's base item statistics. These traits are informed by the mathematical frameworks outlined in the *Worthwhile Item Statistics and Formulae* reference, explicitly mapping consumer value models to MOBA theorycrafting.

---

## 2. Raw Cost-Efficiency Metrics (The "GB/$" Equivalents)
The most fundamental calculated traits involve dividing a raw, isolated stat by the item's Soul cost. These metrics answer the fundamental question: *"What is the absolute cheapest way to acquire stat X?"*

However, in the Deadlock engine, calculating static `Stat / Cost` ratios in a vacuum is mathematically dangerous. The interface must calculate **Contextual Stat per Soul** based on dynamic engine mechanics and the user's current gamestate.

### 2.1 The "Investment Track" Power Spikes
In Deadlock, every soul spent in a specific category (Weapon, Vitality, Spirit) advances a passive "Investment Track". 
*   **Contextual Stat per Soul**: Calculations must account for major milestones. However, **these milestones must be strictly parameterized via a dynamic lookup table**, not hardcoded. For instance, the April 30, 2026 patch rescaled the 4,800-soul Weapon Investment bonus to 46%, and the May 22, 2026 update added a new 6.4k soul milestone. The interface must dynamically project efficiency based on the current patch's investment track thresholds relative to the user's current inventory net worth.
    *   **Health per Soul (HpS)**: `(Bonus Health + Dynamic Investment Track Bonus) / Soul Cost`
    *   **Weapon Damage % per Soul**: `(Bonus Weapon Damage + Dynamic Investment Track Bonus) / Soul Cost`
    *   **Spirit Power per Soul**: `(Bonus Spirit Power + Dynamic Investment Track Bonus) / Soul Cost`

### 2.2 The Fire Rate Deception
Fire rate scales linearly only for continuous-fire weapons. For burst-fire heroes (such as Paradox, Lash, and Seven), the engine applies the fire rate modifier *only* to the pause time between bursts, not the shot time itself.
*   **Effective DPS Multiplier / Soul**: Replaces standard `Fire Rate / Soul`. This metric recalculates dynamically based on the specific hero the user has selected. Because the `shotTime` cannot be reduced, the engine processes fire rate using the exact formula: `cycleTime = shotTime + (pauseTime / (1 + fireRate))`. The developers must code this as a logarithmic, sub-linear curve for burst-fire heroes. For a continuous-fire weapon, +50% fire rate yields a 1.50x multiplier, whereas for Paradox, it yields only 1.16x. The UI must expose this hidden mathematical penalty to prevent wasted soul investments.

### 2.3 Move Speed vs. Sprint Speed Distinction
Mobility in Deadlock utilizes two distinct stats subject to different conditions and scaling.
*   **Base Move Speed per Soul**: Affects in-combat strafing and general mobility.
*   **Sprint Speed per Soul**: Only applies when a hero has not taken recent damage (an out-of-combat/rotational stat).
*   *Note on Diminishing Returns*: Movement speed is subject to a diminishing returns scaling formula with a precise inflection point at **12m/s** (as established in the May 22, 2026 update). If a user is already moving at or near 12m/s, the UI must accurately project the heavily penalized speed gains of purchasing a new mobility item, charting the `Delta Speed / Cost` trajectory accurately.

### 2.4 Bundled Attributes Limitation
While useful, these single-stat metrics are inherently limited because almost all Deadlock items provide a bundle of attributes (hybrid items). Allowing users to rely exclusively on non-compensatory decision strategies (like Elimination-by-Aspects, where they filter by a single stat threshold) will cause them to prematurely exclude highly efficient options. This necessitates a push toward Compensatory strategies via Multi-Attribute Utility (MAU) models, weighing incremental performance gains across multiple stats against overall soul cost.

---

## 3. Survivability and Mitigation Efficiency
Borrowing the *Effective Health Pool (EHP)* formula (`HP / (1 - A)`), we can evaluate defensive items not just by the raw health they provide, but by how much *effective* damage they allow a hero to absorb relative to their cost. This captures the true exponential value of defensive itemization due to inverted diminishing returns.

However, the software must account for strict engine realities before pushing these metrics.

### 3.1 Effective Health Formulas
*   **Delta Bullet EHP**: `New EHP_Bullet - Base EHP_Bullet`
*   **Delta Spirit EHP**: `New EHP_Spirit - Base EHP_Spirit`
*   **Mixed EHP (The Late-Game Standard)**: An average calculation assuming a 50/50 split of incoming bullet and spirit damage.
    *   *Implementation Reality*: This is not merely a helpful average; it is a strict necessity. Because late-game M1 carries rely on on-hit spirit components (Tesla Bullets, Toxic Bullets, Mystic Shot), they transition to a 50/50 damage split. Building pure bullet resistance is mathematically inefficient in 99.99% of late-game scenarios. `Mixed EHP` must be the prominent defensive metric.
*   **The 1-Damage Floor Constraint**: The engineering team must program a hard ceiling into the maximum theoretical EHP. Deadlock's engine enforces a flat 1-damage floor for any damage instance. Even with 99% mitigation (e.g., Mo & Krill burrow mechanics), the mitigation hard-caps at 1 damage tick per health point.

### 3.2 EHP Efficiency Metrics
*   **Contextual EHP per Soul**: To calculate `Delta EHP / Soul Cost` accurately, the codebase must handle two hidden variables:
    1.  **The Vitality Investment Track**: Just as with Weapons, green Vitality items advance a passive track. The calculator must dynamically check the user's net worth against Vitality milestones—most notably the massive +525 Health power spike at the 4,800-soul threshold. If an item pushes a player over this threshold, the `Delta EHP` is exponentially higher.
    2.  **Debuff-Based Effective Health (The Juggernaut Anomaly)**: Relying solely on raw health and active resistances (B - N) mathematically undervalues items like Juggernaut, Plated Armor, and Suppressor. These items provide 0% "real" bullet resistance, but instead apply flat damage reduction, fire rate reduction, and lifesteal reduction to the attacker. The development team must build a secondary "Debuff Mitigation" modifier to mathematically translate the enemy's reduced DPS into an effective health equivalent for the user, allowing these items to be accurately ranked on the scatter plot.
    
    *Application*: These contextual constraints allow the UI to definitively answer whether buying *Bullet Armor* (1250 souls) or *Extra Health* (500 souls) is optimal against a hybrid carry at a specific game state.

---

## 4. Offensive and DPS Efficiency
Taking the *Burst-Fire cycleTime* and *DPS Multiplier* formulas, we can evaluate how efficiently an item increases a hero's damage output over time. However, this must account for strict engine mechanics to avoid generating inaccurate theoretical curves.

### 4.1 Sustained DPS Calculations
*   **Delta Base DPS**: `New Base DPS - Original Base DPS`
    *   *Factors included*: Bonus Weapon Damage, Fire Rate, Ammo capacity.
*   **Delta Sustained DPS**: `New Sustained DPS - Original Sustained DPS`
    *   *The Ammunition "Ceiling" Step-Function*: Ammunition does not scale linearly. The engine processes maximum ammunition using a strict ceiling function: `Max Ammo = ceil(Base Ammo * (1 + Ammo Percent))`. This creates distinct "step-function" power spikes where fractional bullets yield full integers. Calculations must use these rounded integers.
    *   *Reload Bypass Mechanics*: Items like *Quicksilver Reload* or *Active Reload* bypass the traditional reload animation entirely. Crucially, the engine does not treat these as "true" reloads, meaning buffs that expire upon reloading persist through them. The algorithm must model these not as 0.0s reloads, but as continuous magazines to accurately calculate buff uptime.

### 4.2 DPS Efficiency Metrics
*   **Combined Hybrid DPS per Soul (The Late-Game Standard)**: Replaces raw `Base DPS per Soul`. In the late game, M1 carries (Haze, Wraith, Infernus, Warden) transition to a 50/50 split of physical bullet damage and spirit-scaling damage due to on-hit items (Toxic Bullets, Tesla Bullets, Mystic Shot). The software must compute this hybrid damage conversion; otherwise, the Pareto Frontier will incorrectly penalize late-game on-hit items against pure bullet mitigation.
*   **Sustained DPS per Soul**: `Delta Sustained DPS / Soul Cost`
*   **Burst DPS per Soul (Sub-Linear Scaling Penalties)**: For burst-fire heroes (Seven, Lash, Paradox), the `cycleTime` formula drastically limits fire rate value. A +100% nominal fire rate increase yields roughly a 1.34x actual DPS multiplier on an equal shot/pause weapon. The system must dynamically recalculate the `Delta Burst DPS` using specific hero `shotTime` and `pauseTime` variables to accurately penalize sub-linear fire rate scaling.
*   **Effective DPS over Distance (Bullet Velocity Scaling)**: Following the May 22, 2026 update, Bullet Velocity stacks additively rather than diminishingly. This directly dictates effective sustained DPS over distance against mobile targets. The tool must be able to plot Effective DPS mapped against engagement distances to avoid overvaluing close-range damage items on immobile heroes.

---

## 5. Multi-Attribute Utility (MAU) Models
As referenced in the formula `f(x) = Σ αi fi(xi)` (Additive Utility Function), most items provide multiple stats alongside an active or passive ability. To fairly compare a multi-stat item (like *Enduring Spirit*) to a pure-stat item (like *Extra Health*), we must create a combined utility score, forcing compensatory trade-off analysis onto complex mechanics.

### 5.1 The "Soul Value" Standardization (Multivariate Baseline Calculation)
We must establish a baseline "Exchange Rate" for primitive stats. However, because every purchase triggers Investment Track scaling, there are no "pure" single-stat items.
*   **Linear Regression Sourcing**: To find the true, isolated Soul Value of 1 Health or 1 Spirit Power, the software backend must perform a linear regression across the entire matrix of Tier 1 items. By treating the 500-soul cost as the dependent variable and the provided stats (including hidden investment bonuses) as independent variables, the algorithm solves for the precise fractional soul cost of each primitive attribute. This creates a dynamic exchange rate that self-corrects during balance patches.

### 5.2 Composite Calculated Traits
*   **Raw Stat Soul Value (RSSV)**: The theoretical soul value of the raw stats an item provides using the calculated exchange rates.
*   **Ability Premium Cost**: `Actual Soul Cost - RSSV`
    *   *Application*: Quantifies abstract utility. For example, if *Warp Stone* costs 3,000 souls but its +34% Weapon Damage and +8 Spirit Power yield an RSSV of 1,000 souls, the "Premium Cost" of the teleport active is exactly 2,000 souls. Users can quantitatively compare this 2,000-soul combat mobility premium against the out-of-combat rotational mobility premium of *Majestic Leap*.
*   **Stat Value Ratio (SVR) and The "Slot Efficiency" Blindspot**: 
    *   *In a vacuum*: `SVR = RSSV / Actual Soul Cost`. If SVR > 1.0, the stats are worth more than the cost.
    *   *The Slot Constraint*: Deadlock enforces a rigid 16-item hard cap (12 base slots + 4 objective-based Flex Slots). Tier 1 items are intentionally hyper cost-efficient but offer low absolute power. A pure SVR metric mathematically encourages players to lose the game by filling 16 slots with 500-soul items.
    *   *Slot Consolidation Premium*: The engineering team must code a "Slot Consolidation Premium" into the SVR algorithm to account for late-game states where players must sell efficient Tier 1 items to make room for expensive, low-SVR items that grant massive absolute power. The UI should feature a toggle allowing the player to switch between **Soul Efficiency** (early-game optimization) and **Slot Efficiency** (late-game optimization).

---

## 6. Synergistic Scaling & Diminishing Returns

### 6.1 The Resistance "Diminishing Returns" Fallacy
While Deadlock uses a sequential multiplicative formula for resistances (`1 - Π(1 - Rn)`), calculating an "Effective Resistance Gain" to show users the nominal drop-off in efficiency is mathematically misleading. 
*   **Marginal EHP Gain (Exponential Scaling)**: While the *nominal percentage* of resistance suffers from diminishing returns, the actual EHP value scales exponentially. Because the damage multiplier is `1 - A`, every additional point of resistance mitigates the *remaining* damage pool. (e.g., A jump from 50% to 75% nominal resistance doubles the hero's EHP from 2,000 to 4,000 on a 1,000 HP base). 
*   **Implementation**: The development team must discard nominal percentage tracking and instead program a **Marginal EHP Gain** metric. The UI must explicitly visualize how the EHP curve bends *upward* as resistances are stacked, proving that stacking multiple resistance items is incredibly efficient and counter-intuitively powerful.

### 6.2 Damage Amplification Synergy
The software team must build two entirely separate damage amplification algorithms to account for how the engine treats different items.
*   **Standard Linear Amplification**: Items like *Soul Shredder* use the standard formula: `(1 + Amp) * (1 - Resistance)`. These amplify the base hit directly and can push base abilities over the single-tick damage thresholds required to trigger items like *Mystic Burst*.
*   **The Escalating Exposure Double-Mitigation Penalty**: The engine treats *Escalating Exposure* as a separate, subsequent instance of spirit damage, rather than a final damage multiplier. It calculates the amplified damage based on the *post-mitigation* damage of the initial hit, and subjects that new damage to the target's spirit resistance a *second* time.
    *   `Final Damage = [Initial Damage + (Initial Damage * Amp * Am)] * Am` (where `Am` is the target's active spirit resistance modifier).
    *   *Implementation*: The application must project *Escalating Exposure* as an anti-synergistic item against targets with positive spirit resistance, heavily penalizing its projected DPS against tank-heavy compositions. Furthermore, because it creates separate smaller ticks, it mathematically cannot trigger *Mystic Burst*. The platform must accurately flag these exact item interaction synergies and anti-synergies.

---

## 7. Implementation Roadmap
To integrate these into the Elden Chart application, the traits should be calculated and exposed in the following phased approach to ensure structural integrity:

1.  **Phase 1: Dynamic Engine Baselines (The Foundation)**
    *   Build the dynamic lookup tables for the Investment Track milestones (e.g., the 46% Weapon milestone, the +525 Vitality spike).
    *   Implement the linear regression algorithm across all Tier 1 items to solve for the true multivariate "Soul Value" exchange rates.
2.  **Phase 2: Contextual Efficiency & EHP (Survivability)**
    *   Deploy the Contextual Stat per Soul metrics.
    *   Implement the 1-Damage Floor constraint and calculate the `Mixed EHP` baseline.
    *   Build the secondary "Debuff Mitigation" modifier to accurately score items like *Juggernaut*.
    *   Deploy the **Marginal EHP Gain** visualization to highlight the exponential value of resistance stacking.
3.  **Phase 3: Hybrid Offense & True DPS (Damage)**
    *   Implement the Ammunition Ceiling step-function (`ceil`) and Reload Bypass mechanics.
    *   Apply the `cycleTime` logarithmic penalty algorithm for burst-fire heroes (Seven, Lash, Paradox).
    *   Calculate the **Combined Hybrid DPS / Soul** metric to accurately value late-game M1 carries.
    *   Map Additive Bullet Velocity for Effective DPS over distance.
4.  **Phase 4: Slot Efficiency & MAU Optimization (End-Game)**
    *   Roll out the Ability Premium Cost metric to quantify abstract utility (e.g., *Warp Stone*).
    *   Implement the **Slot Consolidation Premium** into the SVR algorithm.
    *   Add the UI toggle allowing users to seamlessly transition the scatter plot from *Soul Efficiency* (early game) to *Slot Efficiency* (late game constraints).
