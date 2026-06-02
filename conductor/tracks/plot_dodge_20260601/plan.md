# Implementation Plan: Resolve Overlapping Scatter Plot Items

## Phase 1: Overplot Jitter Integration
- [x] Task: Write tests to ensure chart scatter properties configure a dodge/jitter layout properly.
- [x] Task: Update `Plot.tsx` to implement `Plot.dodgeX`/`Plot.dodgeY` (or random jitter if native dodge causes issues) on the main scatter `Plot.dot` element.
- [x] Task: Ensure that hover tooltips and interactive elements correctly map back to the transformed visual positions.
- [x] Task: Verify that marker sizes stay uniform and only enlarge upon hover, preserving the existing size logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Overplot Jitter Integration' (Protocol in workflow.md)
