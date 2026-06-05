# Specification: Refactor Data Fetching Hooks to use TanStack Query `select`

## Overview
Refactor our data fetching hooks across both Elden Ring and Deadlock domains to move the data translation/transformation layers into the TanStack Query `select` option. This aligns with idiomatic TanStack Query v5 patterns, decoupling network fetching from data mapping, and enables render optimizations via structural sharing.

## Functional Requirements
1. **Elden Ring Hook Refactor:** Update `useEquipmentData` (and any related query configs) to return raw API data directly from the `queryFn`. Apply the item transformation logic via the `select` option.
2. **Deadlock Hooks Refactor:** Update `useDeadlockData` (and its underlying query configs) to return raw payload data from the `queryFn`. Move `transformDeadlockItems` and `transformDeadlockAbilities` into the `select` option.

## Non-Functional Requirements
1. **Memoization Strategy:** All `select` mapping functions must be extracted to stable function references outside of the custom hooks to ensure TanStack Query can properly optimize and avoid unnecessary re-renders.
2. **Type Safety:** Ensure TypeScript types correctly reflect the raw data shape cached by `queryFn` and the transformed UI model shape returned by `select`.

## Out of Scope
- Modifying the actual visualization logic, components, or UI rendering.
- Modifying the underlying calculation logic of the transformers themselves.
