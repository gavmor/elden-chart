# Specification: Hybrid Offense & True DPS (Damage)

## 1. Overview
The **Hybrid Offense & True DPS** track focuses on establishing the mathematically correct offensive evaluation framework for Deadlock items. It corrects linear fire-rate assumptions for burst-fire heroes, models the true hybrid physical/spirit DPS transition for late-game carries, and implements dynamic distance-based DPS mapping and bifurcated damage amplification modeling.

## 2. Functional Requirements

### 2.1 Burst-fire `cycleTime` Scaling Penalty
- The Base DPS calculation must be refactored to account for Burst-Fire heroes (e.g., Paradox, Lash, Seven).
- Fire rate modifiers must exclusively affect the `pauseTime` (recovery delay), leaving `shotTime` (burst duration) static.
- **Formula:** `cycleTime = shotTime + (pauseTime / (1 + fireRate))`
- This will yield a mathematically accurate logarithmic, sub-linear curve for burst-fire fire rate scaling compared to the linear multiplier of continuous-fire weapons.

### 2.2 Ammunition Ceiling and Reload Bypass Mechanics
- Implement the strict ceiling function for calculating maximum ammunition: `Max Ammo = ceil(Base Ammo * (1 + Ammo Percent))`.
- Fractional bullets must yield full integers to accurately model power spikes.
- Accommodate true Reload Bypass mechanics (e.g., *Quicksilver Reload*, *Mercurial Magnum*, Dynamo's 2, Yamato's 4) as continuous magazines rather than `0.0s` reloads so that non-expiring buffs correctly persist in calculations. *Active Reload* speeds up the process but does NOT bypass it, so it should be calculated differently.

### 2.3 Combined Hybrid DPS Metric
- Model the late-game M1 carry transition to a 50/50 split of physical bullet damage and spirit-scaling damage (from on-hit items like *Toxic Bullets*, *Tesla Bullets*, and *Mystic Shot*).
- The metric must cleanly bifurcate damage calculations to ensure spirit damage bypasses physical defensive items (e.g., *Metal Skin*) and targets Spirit Resistance appropriately.
- **Primary metric for Offensive Analysis:** `Combined Hybrid DPS / Soul`

### 2.4 Engagement Distance & Bullet Velocity Scaling
- **Global Engagement Distance Slider:** Introduce an interactive slider (0m - 50m) in the main scatter plot interface. Adjusting this slider will recalculate `Combined Hybrid DPS` in real-time, penalizing short-range items (e.g., *Close Quarters*) and rewarding Additive Bullet Velocity items (e.g., *Sharpshooter*).
- **Companion Sidebar Plot (DPS vs. Distance):** When clicking/hovering an item, the sidebar must display a line graph rendering the item's mechanical drop-off curve (X-axis: Distance, Y-axis: Effective DPS).

### 2.5 Bifurcated Damage Amplification Model
- Implement separate damage amplification algorithms based on engine behavior.
- **Standard Linear Amplification:** Items like *Soul Shredder* apply a flat multiplier and can push base abilities over the single-tick damage thresholds required to trigger effects like *Mystic Burst*.
- **Double-Mitigation Penalty (*Escalating Exposure*):** Implement as a separate instance of spirit damage applied *after* initial mitigation. The amplified damage must be subjected to the target's spirit resistance a second time. This prevents it from triggering single-tick thresholds like *Mystic Burst* and correctly penalizes it against high-resistance targets.

## 3. Testing Requirements
- **Burst-Fire Heroes:** Rigorously validate the `cycleTime` logarithmic penalty against heroes like Seven, Lash, and Paradox to verify massive effective multiplier efficiency losses.
- **Hybrid On-Hit Carries:** Ensure testing covers Infernus, Wraith, Haze, and Warden equipped with core on-hit items to validate that the projected damage correctly targets dual resistance profiles.
- **Damage Amplification Validation:** Write tests specifically comparing *Soul Shredder* against *Escalating Exposure* on high-resistance targets. Verify that *Escalating Exposure* suffers the double-mitigation loop and mathematically fails to reach the single-tick *Mystic Burst* trigger threshold.

## 4. Acceptance Criteria
- `cycleTime` correctly limits fire-rate value on burst heroes, preventing the linear projection error.
- Ammunition is properly rounded up (`ceil`), and true reload bypass interactions correctly sustain temporary buffs.
- `Combined Hybrid DPS` seamlessly splits the damage and evaluates against distinct resistance types.
- The Global Engagement Distance Slider successfully manipulates the scatter plot's Y-axis (DPS) in real-time based on distance.
- Damage amplification correctly handles the double-mitigation loop for *Escalating Exposure*.
