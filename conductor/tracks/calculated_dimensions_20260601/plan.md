# Implementation Plan: Calculated Dimensions

## Phase 1: Core Mathematical Calculations
- [ ] Task: Write Tests for eHP, Integrated Armor, and Value Metrics
    - [ ] Write unit tests for Effective Health (eHP) calculation factoring raw health and resistance
    - [ ] Write unit tests for Total Integrated Armor sequential multiplicative formula
    - [ ] Write unit tests for Cost-Benefit metrics (e.g., eHP per Soul, Stat per Soul)
    - [ ] Write unit tests for mathematical extremes to ensure calculations return true extreme values
- [ ] Task: Implement Core Mathematical Calculations
    - [ ] Implement Effective Health (eHP) logic
    - [ ] Implement Total Integrated Armor logic
    - [ ] Implement Cost-Benefit logic
    - [ ] Ensure extreme values calculate correctly without failing
- [ ] Task: Conductor - User Manual Verification 'Core Mathematical Calculations' (Protocol in workflow.md)

## Phase 2: UI Integration and Axis Selection
- [ ] Task: Write Tests for UI Axis Selector Groups
    - [ ] Write tests ensuring a "Calculated Metrics" section is rendered in the axis selector dropdown
    - [ ] Write tests confirming calculated metrics can be selected for X or Y axes
- [ ] Task: Implement UI Axis Selector Groups
    - [ ] Update axis selector component to group calculated metrics distinctively
    - [ ] Wire calculated metrics choices to the scatter plot data pipeline
- [ ] Task: Conductor - User Manual Verification 'UI Integration and Axis Selection' (Protocol in workflow.md)

## Phase 3: Scatter Plot Outlier Clamping and Tooltips
- [ ] Task: Write Tests for Scatter Plot Bounds and Tooltips
    - [ ] Write tests asserting extreme outliers are clamped visually on the plot axes
    - [ ] Write tests confirming the hover tooltip displays the true, un-clamped mathematical value
- [ ] Task: Implement Scatter Plot Bounds and Tooltips
    - [ ] Implement visual clamping logic for extreme values (e.g., pinning to plot bounds)
    - [ ] Update tooltip component to render exact mathematical values even if visually clamped
- [ ] Task: Conductor - User Manual Verification 'Scatter Plot Outlier Clamping and Tooltips' (Protocol in workflow.md)

## Phase 4: Active Item Indicator
- [ ] Task: Write Tests for Active Item Visuals
    - [ ] Write tests ensuring items with "Active" abilities have a distinct visual property on the scatter plot
- [ ] Task: Implement Active Item Visuals
    - [ ] Update plot rendering logic to apply a distinct marker, glow, or icon for Active items
- [ ] Task: Conductor - User Manual Verification 'Active Item Indicator' (Protocol in workflow.md)
