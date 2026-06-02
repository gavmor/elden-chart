# Specification: Resolve Overlapping Scatter Plot Items

## Overview
The current scatter plot suffers from visual congestion and overplotting, making it difficult to select or hover over densely packed items. Based on user feedback and best practices from visual cognitive optimization, we will implement a jitter or collision-avoidance layout to slightly separate overlapping points.

## Functional Requirements
- **Jitter / Dodge Layout:** Apply a layout transform (using whatever `@observablehq/plot` natively affords, such as `Plot.dodgeX`/`Plot.dodgeY` or a random jitter) to slightly separate points that map to the exact same X and Y coordinates.
- **Maintain Marker Size:** Marker sizes will remain uniform by default, increasing only when hovered or highlighted (as they currently do), rather than using size to indicate density.
- **Toggle / Config:** If the jitter heavily distorts precise spatial reading, ensure the user has a way to understand it is active (or potentially toggle it if necessary, though native implementation is preferred).

## Non-Functional Requirements
- Ensure the plot remains performant when calculating dodge/jitter transforms for hundreds of items.

## Acceptance Criteria
- [ ] Items with identical stats (e.g., identical weight and damage negation) no longer perfectly eclipse each other.
- [ ] Tooltips and hover states continue to function correctly on the newly adjusted points.
- [ ] Marker size logic is untouched (uniform except on hover).
