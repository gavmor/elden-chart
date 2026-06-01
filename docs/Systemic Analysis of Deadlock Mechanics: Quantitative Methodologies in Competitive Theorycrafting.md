Competitive theorycrafting in Deadlock centers on translating highly complex, intersecting game systems into predictable, mathematical frameworks. Theorycrafters analyze mechanical interactions to optimize player performance, laning efficiency, and late-game scaling. By mapping practical competitive challenges—such as surviving heavy damage, maximizing kill potential, and maintaining map control—to quantitative metrics like Effective Health Pools, Time-To-Kill, and gold efficiency, analysts establish mathematically optimal itemization and tactical paths. This report delivers an exhaustive technical breakdown of these core mechanics, leveraging game telemetry, mathematical formulas, and comparative data to establish a rigorous reference for high-level play.

The Mathematics of Survivability: EHP and Resistance Modeling

Calculating survivability in Deadlock requires evaluating the relationship between a hero's raw health pool and their active resistances.[1] Theorycrafters use the concept of Effective Health Pool (EHP) to determine the absolute amount of raw, pre-mitigation damage of a specific type (bullet or spirit) required to reduce a hero’s health to zero.[2, 3]

Stacking Resistance and Inverted Diminishing Returns

In many multiplayer online battle arenas (MOBAs), stacking defensive attributes yields diminishing returns. Deadlock, however, utilizes a sequential multiplicative formula for calculating combined positive resistances, which results in inverted diminishing returns.[4] Each additional source of positive resistance reduces a percentage of the remaining, unmitigated damage.[3, 4] If a hero possesses n positive resistance sources denoted as R1​,R2​,…,Rn​, the total positive resistance, B, is modeled as:

B=1−i=1∏n​(1−Ri​)

Conversely, negative resistance modifications, or armor shred, are applied to the target.[3] If the target is subjected to m distinct sources of resistance reduction, denoted as S1​,S2​,…,Sm​, the total active shred, N, is calculated using the same multiplicative stacking logic [3]:

N=1−j=1∏m​(1−Sj​)

The final active resistance, A, which is applied directly to incoming damage, is determined by subtracting the total active shred from the total positive resistance [3]:

A=B−N

The resulting Effective Health Pool against a specific damage type is expressed as:

EHP=1−AHP​=1−(B−N)HP​

Because the damage multiplier is 1−A, every percentage point of active resistance gained at higher thresholds prevents a larger portion of incoming damage relative to the remaining damage pool.[3, 4] For example, a hero with 1000 HP moving from 0% to 20% resistance gains 250 EHP.[4] However, moving from 50% to 70% resistance increases EHP from 2000 to 3333.3—a marginal gain of 1333.3 EHP.[3] This exponential scaling behavior is illustrated in the table below, assuming a base health of 1000 HP under various itemization and shred scenarios:

|Base HP|Defensive Itemization State|Combined Positive Resistance (B)|Combined Active Shred (N)|Final Active Resistance (A)|Effective Health Pool (EHP)|Marginal EHP Change (%)|
|---|---|---|---|---|---|---|
|1000|Baseline|0.00 (0%)|0.00 (0%)|0.00 (0%)|1000.0|Baseline|
|1000|Single 20% Resistance Item [4]|0.20 (20%)|0.00 (0%)|0.20 (20%) [4]|1250.0 [4]|+25.0%|
|1000|20% + 30% Resistance Items [4]|0.44 (44%) [4]|0.00 (0%)|0.44 (44%) [4]|1785.7 [4]|+78.6% [4]|
|1000|Single 50% Resistance Item [4]|0.50 (50%)|0.00 (0%)|0.50 (50%) [4]|2000.0 [4]|+100.0%|
|1000|50% Resistance + Shredded [3]|0.50 (50%)|0.36 (36%) [3]|0.14 (14%) [3]|1162.8|-41.9%|

This mathematical structure demonstrates that securing a single, high-value resistance item provides a greater absolute EHP yield than splitting the equivalent nominal resistance across multiple lower-tier items.[4] Conversely, debuff mechanics like healing reductions or anti-heal apply sequentially without subtraction, ensuring that stacking these effects sequentially diminishes their individual impact, thus preventing absolute 100% scaling limits.[5]

The Threat of Hybridization and Late-Game Weapon Carries

A primary challenge in defensive planning is itemizing against late-game weapon-based carries, such as Haze, Wraith, Infernus, and Warden.[6] While these heroes are classified as weapon-based carries, their damage output approaches an even 50/50 split between bullet and spirit damage once they acquire core on-hit upgrades.[6] Items like Toxic Bullets, Tesla Bullets, and Mystic Shot convert a portion of their continuous weapon fire into spirit-scaling damage.[6, 7]

Because of this hybrid damage output, standard physical active items like Metal Skin are bypassed.[6] While Metal Skin grants bullet immunity, on-hit spirit components continue to deal damage and apply lifesteal.[6] Bullet Resilience also fails to mitigate these on-hit spirit components.[6] Consequently, theorycrafters prioritize Spirit Resistance as a core defensive stat even when countering primary weapon carries.[6, 8]

To counter this hybrid damage, analysts recommend passive, high-uptime defensive combinations like Suppressor, Juggernaut, and Plated Armor.[6] These items reduce the attacker's fire rate and lifesteal while providing flat physical damage reduction.[6] When facing high-EHP tanks like Abrams or Silver in wolf form, active items like Return Fire (which returns 65% of incoming bullet damage) are highly effective at turning an attacker's sustained DPS against them.[6, 8, 9]

Weapon Cadence, Ammunition Scaling, and Fire Rate Mechanics

For weapon-focused heroes, maximizing DPS is a key optimization goal.[10] However, the efficiency of fire rate upgrades depends heavily on the weapon's firing mechanism.[11]

The Burst-Fire Weapon Scaling Discrepancy

For standard, continuous-fire weapons, fire rate upgrades scale linearly.[11] If a hero has a baseline fire rate, a 50% fire rate upgrade results in a linear 1.5× multiplier to their weapon DPS.[11] This is because the cycle time between individual shots is effectively zero.[11]

For burst-fire weapons, such as those used by Paradox, Lash, and Seven, the firing cycle is divided into the active burst duration (shot time) and the recovery delay between bursts (pause time).[11] The game’s engine only applies fire rate modifiers to the recovery delay, leaving the active burst duration constant.[11] The cycle time and resulting DPS multiplier are calculated as:

cycleTime=shotTime+1+fireRatepauseTime​

DPS Multiplier=shotTime+1+fireRatepauseTime​shotTime+pauseTime​

Because the shot time remains unaffected, upgrading fire rate on burst-fire heroes yields a logarithmic, sub-linear curve.[11] The absolute efficiency loss of fire rate upgrades on burst-fire weapons is outlined below [11]:

|Weapon Profile|Nominal Fire Rate Upgraded|Theoretical DPS Multiplier (Linear)|Actual DPS Multiplier Achieved|Effective Multiplier Efficiency|
|---|---|---|---|---|
|**Continuous Fire**|+50%|1.50x|1.50x|100.0%|
|**Continuous Fire**|+100%|2.00x|2.00x|100.0%|
|**Paradox (Burst)**|+50%|1.50x|1.16x|32.0%|
|**Lash (Burst)**|+50%|1.50x|1.24x|48.0%|
|**Seven (Burst)**|+50%|1.50x|1.23x|46.0%|
|**Equal Shot/Pause Burst**|+100%|2.00x|1.34x|34.0%|

This sub-linear scaling means burst-fire heroes receive low marginal returns from heavy fire rate investments.[11] Theorycrafters instead recommend prioritizing raw weapon damage, bullet reload modifiers, or spirit utility items for these characters.[11, 12]

Ammunition Calculations and Ceiling Functions

Ammunition-modifying items are governed by strict mathematical operations.[13] Active items that grant situational ammunition—such as Vampiric Burst, which replenishes ammunition equal to 75% of the hero’s maximum magazine capacity—utilize a ceiling function to round up fractional bullets [13]:

Ammunition Gained=⌈0.75×Max Ammo⌉

For instance, Haze possesses a base magazine capacity of 25 rounds.[13] Activating Vampiric Burst yields 18.75 bullets, which the engine rounds up to 19, bringing the temporary active magazine capacity to 44 rounds in-game.[13] This rounding behavior is also applied to passive ammunition replenishment items like Melee Charge or specific character tier upgrades, ensuring high-frequency firing patterns are never rounded down.[13, 14]

Spirit Power Scaling and Advanced Ability Formulas

Spirit Power acts as a primary scaling vector, modifying ability damage, durations, heal amounts, and unique item effects.[1, 15] However, the game engine does not scale all attributes uniformly.[16] Theorycrafters have uncovered distinct mathematical pathways that dictate how different types of abilities benefit from Spirit Power and item-specific percentage multipliers.[16]

The Bifurcated Scaling of Ranged vs. Healing and Duration Abilities

Standard scaling is calculated using a linear coefficient [15]:

Attribute Value=Base Value+(Spirit Power×Spirit Coefficient)

When utility items that provide percentage-based attribute increases—such as Greater Expansion or Superior Duration—are introduced, the calculation changes depending on the ability's classification [16]:

- **Ranged Abilities:** The game applies the percentage item modifier strictly to the base value before adding the flat scaling gained from Spirit Power.[16] Final Range=(Base Range×(1+Item Modifier))+(Spirit Power×Range Coefficient)
- **Healing and Duration Abilities:** The game combines the base value and the Spirit Power scaling first, and then applies the percentage item modifier to the combined sum.[16] Final Heal/Duration=(Base Value+(Spirit Power×Coefficient))×(1+Item Modifier)

This divergence is mathematically significant.[16] Healing and duration abilities experience exponential scaling loops because their Spirit Power gains are directly multiplied by utility items.[16] In contrast, ranged abilities exhibit a linear progression, preventing players from achieving extreme, map-spanning utility ranges.[16]

The Double-Mitigation Penalty of Escalating Exposure

The interaction between damage amplification items and resistance calculations is exemplified by Escalating Exposure.[17] Rather than acting as a standard, final damage multiplier, the mechanics of Escalating Exposure treat the amplified damage as a separate, subsequent instance of spirit damage.[17] The mathematical representation of this double-mitigation loop is modeled as:

$$\text{Final Damage} = \left \times A_m$$

where Am​ represents the target's active spirit resistance modifier (1−Resistance).[17]

Because the amplified portion is recalculating based on the _post-mitigation_ damage of the initial hit and is then subjected to the target's spirit resistance _a second time_, heroes stacking high spirit resistance reduce the effectiveness of Escalating Exposure far more than they would against a standard flat damage multiplier.[17]

Unique Hero-Specific Spirit Power Scaling

To optimize late-game scaling, theorycrafters track unique, non-standard base stat scalings tied directly to a hero's Spirit Power.[18] While most hero attributes remain static outside of level-up boons, specific characters possess base stat modifiers that scale with Spirit Power [5, 18]:

|Hero|Base Attribute Scaling|Scaling Formula Modifier|
|---|---|---|
|**Haze**|Magazine Ammo Size|Scales ammunition capacity directly with Spirit Power.[18]|
|**Grey Talon**|Weapon Fire Rate & Move Speed|Increases weapon attack velocity and raw movement speed.[18]|
|**Seven**|Base Movement Speed|Direct additive velocity modifier per point of Spirit Power.[18]|
|**Warden**|Weapon Fire Rate|Scales weapon firing cadence directly with Spirit Power.[18]|
|**Wraith**|Base Sprint Speed|Enhances out-of-combat rotation and map movement velocity.[18]|
|**Yamato**|Magazine Ammo Size|Amplifies weapon magazine depth through Spirit Power acquisition.[18]|

Laning Efficiency, Regeneration Dynamics, and Early-Game Tempo

The early-game laning phase is a battle of resource attrition, decided by how efficiently heroes convert early soul wealth into health regeneration and trading power.[19, 20] Theorycrafters evaluate the three primary tier-1 healing items—Extra Regen, Healing Rite, and Restorative Shot—to maximize laning duration and map pressure.[20, 21]

Performance Profile of Tier-1 Healing Items

|Laning Item|Soul Cost|Base Healing Output|Maximum Theoretical Output|Integrated Utility Stats|Optimal Application Context|
|---|---|---|---|---|---|
|**Extra Regen**|500 [19]|+2.8 HP/s constant [21]|168 HP / minute [21]|+10% Ammo [22], +11% HP [19]|Passive health sustain; matches heroes with low base regen [20, 21]|
|**Healing Rite**|500 [19]|300 HP over 20s active [23]|370 HP / minute (inc. cooldown) [21]|+3 Spirit Power, +2m/s Sprint Speed [21, 22]|Roaming, post-engagement recovery, high-risk lanes [20, 24]|
|**Restorative Shot**|500 [19]|40 HP (hero) / 25 HP (NPC) per 5.5s [14, 21]|436 HP / minute (on-cooldown hero hit) [21]|+7% Bullet Resist, +8% Weapon Damage [21]|Aggressive trading; optimal on shotgun/high-velocity weapons [20, 21]|

Each item represents a distinct tactical trade-off:

- **Extra Regen:** Offers continuous health recovery, requiring no change in playstyle.[21] It is highly reliable but provides lower peak healing compared to active alternatives.[20, 21]
- **Healing Rite:** Provides rapid healing and a temporary out-of-combat movement boost.[21, 23] However, it is vulnerable to interruption; taking damage from an enemy player or tower cancels the remaining duration.[22, 23] This requires the player to retreat behind cover, potentially sacrificing lane presence.[20, 22]
- **Restorative Shot:** Delivers the highest potential health recovery per minute but is highly conditional.[20, 21] The shot must land on a target to trigger the heal; missing the shot puts the item on a 5.5-second cooldown without providing any healing.[20, 21] It scales exceptionally well on shotgun-profile characters or heroes with high bullet velocity, who can reliably secure heals during combat.[20, 21]

Tactical Repositioning and Crowd Control Mitigation

Active items are crucial tools for managing teamfights, adjusting positioning, and mitigating crowd control (CC) threats.[25, 26]

Spatial Mobility: Warp Stone vs. Majestic Leap

Theorycrafters distinguish active positioning items based on whether they are intended for combat evasion or initiating engagements.[12, 27]

- **Warp Stone:** Costs 3,000 souls and slots into the Weapon category.[12, 25] It provides an instant 11-meter directional teleport and grants a temporary +30% Bullet Resistance buff for 5 seconds.[25, 28] Crucially, Warp Stone can be activated while taking damage.[27] This makes it an invaluable defensive tool for dodging high-impact abilities or escaping ultimate skills.[25, 27]
- **Majestic Leap:** Costs 3,000 souls and occupies a Vitality slot.[10, 12] It enables significant vertical and horizontal movement, making it highly effective for map rotations and initiating fights over terrain.[27] However, Majestic Leap is disabled for a short duration upon taking damage.[27] This restriction limits its utility as an escape tool, designating it primarily as an offensive initiation mechanism.[27]

Teamfight Utility and Hard CC Denial

In coordinated engagements, active items are utilized to duplicate high-value abilities or neutralize threat windows.[28]

- **Echo Shard:** A 6,200-soul utility item that resets the cooldown of a hero's most recently used non-ultimate ability.[28] This enables double-cast strategies, such as Bebop deploying consecutive Sticky Bombs or Mirage executing back-to-back Tornadoes to control teamfights.[28]
- **Debuff Remover:** A situational active that clears negative status effects on a 48-second cooldown.[28] It is primarily bought to counter long-duration damage-over-time abilities or healing reductions, such as Pocket's Affliction, Infernus's passive burn, or Shiv's bleed.[28]
- **Unstoppable:** The primary late-game defensive item for Vitality slots.[26] It suppresses existing negative status effects and grants immunity to stuns, silences, sleep, roots, and disarms for 6 seconds on a 64-second cooldown.[26] However, theorycrafters note a key mechanical limitation: Unstoppable cannot be activated while already stunned or asleep.[26] This requires players to activate the item preemptively before entering high-threat areas to prevent being chain-CC'd.[26]

Economic Optimization: Soul Sharing, Denial, and Net Worth Scaling

Victory in Deadlock is fundamentally linked to resource accumulation, as souls serve as both experience points and currency.[29, 30] Efficiently managing soul mechanics is a core focus of high-level theorycrafting.[19, 29]

The Server-Side Mechanics of Securing and Denying

When a trooper dies, it releases a floating soul orb.[29, 30] To secure the souls, the killing team must shoot or melee the orb; the opposing team can shoot it to deny the souls.[29, 30] To minimize the impact of latency differences, the game utilizes a 90ms server-side buffer.[31, 32] If both players shoot the orb within this narrow window, the server favors the player attempting to secure the soul over the denier.[31, 32]

Additionally, melee attacks bypass the floating orb mechanic entirely.[31, 33] Eliminating a trooper with a melee strike instantly secures the souls without spawning a shootable orb.[31, 33] Melee strikes also feature a generous contact cone.[33] This allows players to quickly secure closely grouped troopers without needing to manually aim at individual floating orbs.[31, 33]

Unsecured Souls and Resource Risks

Souls acquired from neutral jungle camps (Denizens) or breaking destructible crates are classified as Unsecured Souls.[29, 30, 34] This resource pool is governed by specific rules:

- **Loss on Death:** Upon dying, a hero drops all accumulated unsecured souls, allowing any nearby player to collect them.[30, 34]
- **Passive Conversion:** Unsecured souls slowly convert into secured souls at a constant rate of 1 soul per second.[30]
- **Spending Priority:** When purchasing items, the game spends secured souls first.[30] Unsecured souls are only consumed once the secured pool is entirely depleted.[30] This makes immediate item purchases the most reliable method for securing loose wealth.[30, 34]

Late-Game Soul Duplication and Wave Management

A major mechanical update altered the rules of map-wide gold scaling.[35] Previously, the laning phase's duo-sharing rules terminated at a specific match time, causing split-pushing heroes to favor solo lanes.[35] Under current mechanics, soul sharing remains duplicated throughout the entire game.[35]

When two heroes are present in a lane, each receives the full soul value of dying troopers rather than splitting the gold pool.[35, 36] If three or more heroes are present, the soul value is split evenly among all participants.[36] This duplication mechanic makes dual-hero wave clearing highly efficient, encouraging teams to rotate in pairs to maximize map-wide net worth generation.[35]

Comparative Category Scaling and Investment Tracks

Items in Deadlock are categorized into three core types: Weapon, Vitality, and Spirit.[10] Each category features an Investment Track that grants passive stat bonuses as souls are spent within that category.[37]

Understanding the "Investment Spike" at the 4,800-soul milestone is key to mid-game power spikes.[37] Spending 4,800 souls in a single category provides a massive jump in bonuses compared to earlier tiers, allowing players to significantly accelerate their combat scaling.[37]

Category Investment Track Bonuses

|Total Category Souls Invested|Weapon Category Bonus (Weapon Damage)|Vitality Category Bonus (Base Health)|Spirit Category Bonus (Spirit Power)|
|---|---|---|---|
|**800** [37]|+7% Damage [37]|+75 Health [37]|+7 Spirit Power [37]|
|**1,600** [37]|+9% Damage [37]|+125 Health [37]|+11 Spirit Power [37]|
|**2,400** [37]|+13% Damage [37]|+200 Health [37]|+15 Spirit Power [37]|
|**3,200** [37]|+20% Damage [37]|+275 Health [37]|+19 Spirit Power [37]|
|**4,800★ (Investment Spike)** [37]|**+49% Damage** [37]|**+525 Health** [37]|**+38 Spirit Power** [37]|
|**7,200** [37]|+60% Damage [37]|+625 Health [37]|+52 Spirit Power [37]|
|**9,600** [37]|+80% Damage [37]|+750 Health [37]|+64 Spirit Power [37]|
|**16,000** [37]|+95% Damage [37]|+1000 Health [37]|+76 Spirit Power [37]|
|**22,400** [37]|+115% Damage [37]|+1200 Health [37]|+89 Spirit Power [37]|
|**28,800** [37]|+135% Damage [37]|+1400 Health [37]|+101 Spirit Power [37]|

_Note: The 4,800-soul milestone represents a critical power spike, offering a massive leap in stats compared to previous tiers. Players should plan their item purchases to hit this threshold in their primary category to maximize combat efficiency during mid-game fights.[37]_

By analyzing these mathematical systems—from resistance calculations and fire rate scaling to laning regeneration and soul-sharing mechanics—theorycrafters provide the essential blueprints for optimal play in Deadlock. Understanding these systems allows players to make informed, highly efficient decisions that translate directly into consistent in-game advantages.[19, 37]

--------------------------------------------------------------------------------

1. Understanding Items in Deadlock - Dignitas.gg, [https://dignitas.gg/articles/understanding-items-in-deadlock](https://www.google.com/url?sa=E&q=https%3A%2F%2Fdignitas.gg%2Farticles%2Funderstanding-items-in-deadlock)
2. You are building shred WRONG : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1t0413b/you_are_building_shred_wrong/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1t0413b%2Fyou_are_building_shred_wrong%2F)
3. Probably unnecessary question about builds: how exactly does resistence/resitence redution work? It seems to me that the bonus resistance from various items increases "logarithmically", but the reduction resistance increases linearly. I could be wrong, but that would make the reduction worth 2* more : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1fszsml/probably_unnecessary_question_about_builds_how/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1fszsml%2Fprobably_unnecessary_question_about_builds_how%2F)
4. Resistance math: Why stacking resists is better than you think! : r/DeadlockTheGame, [https://www.reddit.com/r/DeadlockTheGame/comments/1slmdzf/resistance_math_why_stacking_resists_is_better/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1slmdzf%2Fresistance_math_why_stacking_resists_is_better%2F)
5. Are there any videos that explain the math behind the game? : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1pyy6wg/are_there_any_videos_that_explain_the_math_behind/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1pyy6wg%2Fare_there_any_videos_that_explain_the_math_behind%2F)
6. Spirit Resist is better than bullet resist 99.99% of games. : r ... - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1s5b4qk/spirit_resist_is_better_than_bullet_resist_9999/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1s5b4qk%2Fspirit_resist_is_better_than_bullet_resist_9999%2F)
7. All Deadlock Weapon Items - Mobalytics, [https://mobalytics.gg/deadlock/weapon-items](https://www.google.com/url?sa=E&q=https%3A%2F%2Fmobalytics.gg%2Fdeadlock%2Fweapon-items)
8. Bullet, Spirit and Melee Resists Explained : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1s2o4a6/bullet_spirit_and_melee_resists_explained/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1s2o4a6%2Fbullet_spirit_and_melee_resists_explained%2F)
9. Patch - April 30, 2026 - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Patch_2026-04-30](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FPatch_2026-04-30)
10. Deadlock Items List - Weapons, Vitality & Spirit - Mobalytics, [https://mobalytics.gg/deadlock/items](https://www.google.com/url?sa=E&q=https%3A%2F%2Fmobalytics.gg%2Fdeadlock%2Fitems)
11. The Problem with Fire Rate on Burst Heroes - /kremovtort, [https://kremovtort.gitlab.io/blog/deadlock-burst-fire/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fkremovtort.gitlab.io%2Fblog%2Fdeadlock-burst-fire%2F)
12. Pocket's active items : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1t26cfm/pockets_active_items/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1t26cfm%2Fpockets_active_items%2F)
13. Deadlock - Ammunition - YouTube, [https://www.youtube.com/watch?v=yu7dzf5ottg](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dyu7dzf5ottg)
14. Gameplay Update - May 22, 2026 - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Gameplay_Update_2026-05-22](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FGameplay_Update_2026-05-22)
15. Spirit - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Spirit](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FSpirit)
16. Spirit scaling calculation is different for ranged abilities - Deadlock forums, [https://forums.playdeadlock.com/threads/spirit-scaling-calculation-is-different-for-ranged-abilities.135849/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fforums.playdeadlock.com%2Fthreads%2Fspirit-scaling-calculation-is-different-for-ranged-abilities.135849%2F)
17. Escalating Exposure damage affected by Resistance and Resistance Reduction TWICE - Deadlock forums, [https://forums.playdeadlock.com/threads/escalating-exposure-damage-affected-by-resistance-and-resistance-reduction-twice.27458/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fforums.playdeadlock.com%2Fthreads%2Fescalating-exposure-damage-affected-by-resistance-and-resistance-reduction-twice.27458%2F)
18. How Spirit Power Works and Scales in Deadlock - Mobalytics, [https://mobalytics.gg/deadlock/guides/how-spirit-power-works-and-scales](https://www.google.com/url?sa=E&q=https%3A%2F%2Fmobalytics.gg%2Fdeadlock%2Fguides%2Fhow-spirit-power-works-and-scales)
19. New player Question about tier one Items : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1h186ap/new_player_question_about_tier_one_items/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1h186ap%2Fnew_player_question_about_tier_one_items%2F)
20. Laning phase healing items : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1obx90f/laning_phase_healing_items/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1obx90f%2Flaning_phase_healing_items%2F)
21. Daily Item Discussion (11/117): Extra Regen : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1fz23sj/daily_item_discussion_11117_extra_regen/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1fz23sj%2Fdaily_item_discussion_11117_extra_regen%2F)
22. Extra Regen or Healing Rite? :: Deadlock Discussões gerais - Steam Community, [https://steamcommunity.com/app/1422450/discussions/0/4632608817409955392/?l=portuguese](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsteamcommunity.com%2Fapp%2F1422450%2Fdiscussions%2F0%2F4632608817409955392%2F%3Fl%3Dportuguese)
23. All Deadlock Vitality Items - Mobalytics, [https://mobalytics.gg/deadlock/vitality-items](https://www.google.com/url?sa=E&q=https%3A%2F%2Fmobalytics.gg%2Fdeadlock%2Fvitality-items)
24. Quick comparison between early healing items in lane. : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1gfm787/quick_comparison_between_early_healing_items_in/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1gfm787%2Fquick_comparison_between_early_healing_items_in%2F)
25. Warp Stone is an incredibly underutilized item that is viable on basically every hero : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1g8a9h2/warp_stone_is_an_incredibly_underutilized_item/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1g8a9h2%2Fwarp_stone_is_an_incredibly_underutilized_item%2F)
26. Unstoppable - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Unstoppable](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FUnstoppable)
27. Why would you buy majestic leap over warp stone? : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1f9345q/why_would_you_buy_majestic_leap_over_warp_stone/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1f9345q%2Fwhy_would_you_buy_majestic_leap_over_warp_stone%2F)
28. Don't sleep on Deadlock's active items - PC Gamer, [https://www.pcgamer.com/games/moba/dont-sleep-on-deadlocks-active-items/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.pcgamer.com%2Fgames%2Fmoba%2Fdont-sleep-on-deadlocks-active-items%2F)
29. Deadlock Souls Guide: Fundamentals You Should Know - Mobalytics, [https://mobalytics.gg/deadlock/guides/souls-guide](https://www.google.com/url?sa=E&q=https%3A%2F%2Fmobalytics.gg%2Fdeadlock%2Fguides%2Fsouls-guide)
30. Souls - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Souls](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FSouls)
31. how does denying souls work currently? : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1iszlr8/how_does_denying_souls_work_currently/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1iszlr8%2Fhow_does_denying_souls_work_currently%2F)
32. Purely visual nitpick: Delay when shooting souls : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1nmqtap/purely_visual_nitpick_delay_when_shooting_souls/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1nmqtap%2Fpurely_visual_nitpick_delay_when_shooting_souls%2F)
33. Does melee securing souls feel clunky to anyone else? : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1fmv6qh/does_melee_securing_souls_feel_clunky_to_anyone/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1fmv6qh%2Fdoes_melee_securing_souls_feel_clunky_to_anyone%2F)
34. Deadlock New Player Guide - Steam Community, [https://steamcommunity.com/sharedfiles/filedetails/?id=3310953543](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsteamcommunity.com%2Fsharedfiles%2Ffiledetails%2F%3Fid%3D3310953543)
35. In Deadlock Souls Share The Whole Game Now! - YouTube, [https://www.youtube.com/shorts/dbLU8yKXEBI](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.youtube.com%2Fshorts%2FdbLU8yKXEBI)
36. Question about how soul orbs are shared : r/DeadlockTheGame - Reddit, [https://www.reddit.com/r/DeadlockTheGame/comments/1f96kxf/question_about_how_soul_orbs_are_shared/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.reddit.com%2Fr%2FDeadlockTheGame%2Fcomments%2F1f96kxf%2Fquestion_about_how_soul_orbs_are_shared%2F)
37. Items - Liquipedia Deadlock Wiki, [https://liquipedia.net/deadlock/Portal:Items](https://www.google.com/url?sa=E&q=https%3A%2F%2Fliquipedia.net%2Fdeadlock%2FPortal%3AItems)
