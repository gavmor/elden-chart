# AGENTS.md — Elden Ring Armor Visualizer

## Quick Commands

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies (**pnpm only** — no npm/yarn) |
| `pnpm run dev` | Dev server with HMR |
| `pnpm run codegen` | Regenerate `src/gql/` from inline GraphQL queries in `.tsx` files |
| `pnpm run build` | `codegen → tsc -b → vite build` (runs codegen first) |
| `pnpm run lint` | ESLint on all files |
| `pnpm run preview` | Preview production build locally |
| Push to `main` | Automatically triggers CI/CD build & deployment to GitHub Pages |

## Tech Stack

- **React 19** + **TypeScript 6.0** + **Vite 8**
- **@observablehq/plot** for scatter chart (imperative API, not React component)
- **TanStack React Query v5** for data fetching
- **graphql-request v7** + **GraphQL Code Generator** (`client` preset) for typed queries
- **Tailwind CSS v4** (Vite plugin)
- **Lucide React** for icons
- **ESLint 10** with `typescript-eslint`, `react-hooks`, `react-refresh` plugins

## Architecture

```
main.tsx
  → QueryClientProvider
    → ErrorBoundary (class component, catches render errors)
      → App
        → ArmorChart (all state lives here — useState hooks)
          ├── ArmorChartHeader       (title bar + item count)
          ├── ArmorChartSidebar      (axis selectors, category toggles, Pareto toggle, build set)
          ├── ArmorChartPlot         (@observablehq/plot imperative rendering)
          ├── ArmorChartTooltip      (conditional — shows on hover)
          └── ArmorCompareModal      (conditional — side-by-side stat comparison table)
```

**State ownership**: All state is in `ArmorChart`. Child components receive everything as props and call setters. No context, no external state library beyond React Query.

**Key state variables** (all in `ArmorChart.tsx`):
- `xVar` / `yVar` — selected axis stat keys (StatKey)
- `colorVar` — 'category' or any StatKey for heatmap coloring (ColorKey)
- `activeCategories` — which armor categories are visible
- `search` — text filter string
- `customSet: ArmorItem[]` — selected build set items
- `showPareto: boolean` — toggle Pareto frontier overlay
- `hoveredItem` / `tooltipPos` — tooltip state

## Data Flow

1. **API**: `https://eldenring.fanapis.com/api/graphql`
2. **Query**: Single `GetArmorPage` query (defined inline in `ArmorChart.tsx` via `graphql()` tagged template)
3. **Codegen**: `codegen.ts` scans `src/**/*.tsx` for `graphql()` calls, generates typed documents at `src/gql/`
4. **Fetching**: `ArmorChart` uses `useQuery` with a sequential page fetcher (pages 0–5, 100 items each) — sequential to avoid server connection floods
5. **Processing**: `safeFloat()` normalizes values (API can return weight as string or decimal). Duplicate names are deduplicated via `Map`.
6. **Filtering**: `useMemo` applies category toggles and text search to produce `filteredData`
7. **Pareto**: `getParetoFrontier()` in `utils.ts` computes the Pareto-optimal subset

## Critical Gotchas

### 1. `verbatimModuleSyntax: true` — use `import type` for type-only imports
```ts
// ✅ Correct
import type { ArmorItem } from './types';
// ❌ Will fail at build
import { ArmorItem } from './types'; // if only used as a type
```

### 2. `@ts-ignore` above `graphql` import is intentional
In `ArmorChart.tsx`, the `import { graphql } from '../gql/gql'` has a `@ts-ignore` comment. The generated `graphql()` function returns `unknown` at compile time but resolves correctly at runtime via the string-keyed document map. Do not remove this.

### 3. `codegen` must run before `tsc`
The `build` script runs `graphql-codegen && tsc -b && vite build`. If you change the GraphQL query or add new ones, run `pnpm run codegen` before typechecking.

### 4. GraphQL API partial-data errors
The API throws `ClientError` when a field's type doesn't match (e.g., weight as decimal vs. Int). The fetch loop **catches these errors and extracts `err.response.data.armor`** to salvage valid items from the failing page. Don't change this error handling pattern.

### 5. Imperative DOM manipulation in ArmorChartPlot
`ArmorChartPlot` does **not** use React to manage SVG elements. It:
- Clears the container (`containerRef.current.innerHTML = '';`) and rebuilds Plot via `Plot.plot()`
- Attaches mouse listeners directly to SVG `<image>` elements via `addEventListener`
- Uses `useRef` for callback references (`onHoverItemRef`, `customSetRef`) to **prevent the useEffect from re-running on every hover** — without this, the plot would be destroyed and recreated on each mouse move
- Applies hover effects by mutating SVG attributes (`width`, `height`, `x`, `y`) and inline CSS `filter`/`opacity`

### 6. Tailwind CSS v4 uses `@import "tailwindcss"` not `@tailwind` directives
In `src/index.css`, the import syntax is `@import "tailwindcss";` (Tailwind v4 style). The Vite plugin handles this automatically.

### 7. GitHub Pages base path
`vite.config.ts` sets `base: '/elden-chart/'`. All asset paths in production are relative to this base.

### 8. Mutable refs for Pareto IDs
In `ArmorChartPlot`, `paretoIds` is recomputed via `useMemo` but passed into the `useEffect` dependency array. The DOM handlers reference it via closure, so it must be a dependency.

### 9. ResizeObserver drives plot recreation
Any window resize triggers a full Plot rebuild (dependency: `size`). Chart dimensions come from `ResizeObserver` measuring the container.

## Type System

### Core types (in `src/components/types.ts`)

- **`ArmorItem`**: `{ id, name, image, category, description, weight, dmgNegation[], resistance[] }`
- **`ApiStat`**: `{ name: string, amount: number }`
- **`StatKey`**: Union of `'weight' | 'total_negation'` | 8 negation names | `'total_resistance'` | 4 resistance names + `'Poise'`
- **`ColorKey`**: `'category' | StatKey`
- **`CATEGORIES`**: `['Helm', 'Chest Armor', 'Gauntlets', 'Leg Armor']` as const

### Stat lookup (`getItemStat` in `utils.ts`)
- `'weight'` → `item.weight`
- `'total_negation'` → sum of all `dmgNegation` amounts
- `'total_resistance'` → sum of all `resistance` amounts **excluding Poise**
- Negation names: `Phy, Strike, Slash, Pierce, Magic, Fire, Ligt, Holy` (note: API uses `Ligt` not Lightning)
- Resistance names: `Immunity, Robustness, Focus, Vitality, Poise`

### Color system (`getItemColor` in `utils.ts`)
- `'category'` → fixed HSL colors per category
- Any StatKey → continuous heatmap: Blue (low, hue 220) → Red (high, hue 0), computed from `min/max` across filtered data

### Pareto frontier (`getParetoFrontier` in `utils.ts`)
- `'weight'` is always minimized; all other stats are maximized
- Returns items sorted by X ascending
- Uses O(n²) pairwise dominance check

## ESLint Config

- `globalIgnores(['dist'])`
- Extends: `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks` flat recommended, `react-refresh` Vite rules
- Targets: `**/*.{ts,tsx}`
- Browser globals

## Project Structure

```
elden-chart/
├── codegen.ts                  # GraphQL Code Generator config → src/gql/
├── eslint.config.js            # ESLint flat config
├── index.html                  # SPA entry point
├── package.json                # pnpm scripts + deps
├── vite.config.ts              # Vite + React + Tailwind plugins, base: '/elden-chart/'
├── tsconfig.json               # References tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json           # Strict TS: verbatimModuleSyntax, noUnusedLocals, erasableSyntaxOnly
├── lib/                        # Research documents (not part of the app)
└── src/
    ├── main.tsx                # QueryClient + ErrorBoundary + App mount
    ├── App.tsx                 # Thin wrapper → ArmorChart
    ├── index.css               # @import "tailwindcss";
    ├── gql/                    # Auto-generated — do not edit manually
    │   ├── index.ts
    │   ├── gql.ts              # graphql() tagged template map
    │   ├── graphql.ts          # Generated TypeScript types + DocumentNode
    │   └── fragment-masking.ts
    └── components/
        ├── types.ts            # Core types, CATEGORIES, STAT_OPTIONS
        ├── utils.ts            # getCategoryIcon, getItemStat, getItemColor, getItemImageUrl, getParetoFrontier
        ├── ErrorBoundary.tsx   # Class component error boundary
        ├── ArmorChart.tsx      # Main controller: state, useQuery, filtering, layout
        ├── ArmorChartHeader.tsx
        ├── ArmorChartSidebar.tsx
        ├── ArmorChartPlot.tsx  # @observablehq/plot imperative rendering + hover DOM manipulation
        ├── ArmorChartTooltip.tsx
        └── ArmorCompareModal.tsx
```
