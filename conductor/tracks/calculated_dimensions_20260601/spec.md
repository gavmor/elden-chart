# Specification: Calculated Dimensions

## Overview
This feature introduces "Calculated Dimensions" (meta-dimensions) to the scatter plot visualization for Deadlock items. By calculating Effective Health (eHP) and Cost-Benefit efficiency, it acts as a cognitive prosthesis—reducing extraneous cognitive load and decision fatigue. It supports both non-compensatory filtering and compensatory trade-off analysis (finding the Pareto Frontier) for players ranging from Satisficers to Maximizers.

## Functional Requirements
1. **New Calculated Metrics**: 
   - Calculate **Effective Health (eHP)** by factoring in raw health and active resistance.
   - Calculate **Total Integrated Armor** by combining positive resistance buffs and negative shredding (debuffs) using a sequential multiplicative formula.
   - Calculate **Cost-Benefit / Value Metrics** such as "eHP per Soul" or "[Stat] per Soul" to assess item efficiency.
2. **UI Integration**:
   - Update the Axis Selector dropdowns to include a new, distinct "Calculated Metrics" section to house these new dimensions.
3. **Handling Extreme Outliers**:
   - For outlier values that approach infinity, visually clamp these extreme values on the scatter plot axes to prevent compressing the rest of the data points.
   - Display the true, exact mathematical value within the item's hover tooltip.
4. **Active Item Indicator**:
   - Add a distinct visual indicator (e.g., a special marker shape, glow, or icon) on the scatter plot for items with "Active" abilities. 
   - This ensures items with high qualitative, unquantifiable utility (like mobility or silences) are not overlooked when sorting purely by quantitative calculated stats.

## Non-Functional Requirements
- **Performance**: The mathematical calculations must run efficiently so the scatter plot remains responsive.
- **Cognitive Optimization**: The interface must present data in a structured, signposted manner (e.g., grouped dropdowns) to minimize extraneous cognitive load.

## Acceptance Criteria
- [ ] Users can select calculated metrics from the axis selectors under a distinct "Calculated Metrics" group.
- [ ] Items with extreme outlier calculated values are visually clamped at bounds, with true values in tooltips.
- [ ] Active items are visually distinguished on the scatter plot to account for their unquantifiable utility.

## Out of Scope
- Time-to-Kill (TTK) estimates.
- Applying arbitrary hard caps to the underlying mathematical calculations.
