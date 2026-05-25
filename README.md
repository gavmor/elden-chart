# 🛡️ Elden Ring Armor Visualizer

A state-of-the-art, high-fidelity interactive scatter plot visualizer that allows players to analyze Elden Ring armor stats across multiple dimensions in real-time. 

Live App: **[Elden Ring Armor Visualizer on GitHub Pages](https://gavmor.github.io/elden-chart/)**

---

## 🎨 Premium Visual Experience

The visualizer features a high-end dark-fantasy aesthetic built directly around in-game assets and tactile feedback systems:

### 🖼️ Frameless Transparent Item Previews
- Datapoint icons render the **actual transparent PNG cutout** of each armor piece using SVG `<foreignObject>` containers.
- Avoids clumsy boxed frames, allowing helmets, chest plates, gauntlets, and leg greaves to float cleanly and naturally on the grid background.
- Clean category fallback icons automatically activate when database assets are absent.

### ✨ Delicate Shape-Conforming Glow Halos
- Leverages CSS `filter: drop-shadow()` to cast a glowing halo outline **exactly to the solid pixels** of transparent armor assets rather than their rectangular boundaries.
- **Pristine Workspace**: Unhovered items carry a subtle, clean dark drop shadow (`drop-shadow(0 1px 2px rgba(0,0,0,0.6))`) to maximize grid clarity and avoid background noise.
- **Dynamic Tactile Glow**: Hovering over any item smoothly scales it by `15%` (`scale(1.15)`) while bursting into a soft, dynamic aura (`drop-shadow(0 0 5px ${color})`) matching its active color theme. Non-hovered items drop to `0.3` opacity to immediately focus attention.
- **Immediate Mouseoff Recovery**: Explicit mouse-leave boundaries clear hover scales, halos, and tooltip cards the millisecond the cursor leaves an item's footprint.

---

## 📊 Abstract Dynamic Coloring & Heatmaps

Color datapoints dynamically by **literally any dynamic property of an item** (categorical or numerical) via the interactive sidebar dropdown:

### 🎚️ Categorical Grouping
- **Category**: Points map to highly recognizable custom HSL colors representing Helms (Amber), Chest Armor (Purple), Gauntlets (Emerald), and Leg Armor (Sky).

### 🔥 Continuous Thermal Heatmaps
- Selecting any numerical stat (e.g. Weight, Poise, Physical/Magic negation, status resistances) automatically triggers the color pipeline to:
  1. Calculate dynamic bounds (`min` / `max`) across the currently filtered/active dataset using a high-performance `useMemo` cache.
  2. Project the relative ratio of each item's value onto a continuous thermal spectrum: **Blue (Low values) ➔ Cyan ➔ Green ➔ Yellow ➔ Orange ➔ Red (High values)**.

---

## ⚔️ Active Build Set Planner

We introduced a powerful custom build set designer directly integrated within the visualizer workspace:

### 1. **Interactive Point Selections**
- Click any transparent armor datapoint directly on the scatter plot to add it to your custom build set.
- Items currently active in your set are rendered on the plot with an **increased scale (`36px` / `1.08x`)** and a **distinct, glowing golden outline aura (`drop-shadow(0 0 4px #fbbf24)`)**.
- Active build set items remain fully bright and opaque at `1.0` even when other datapoints are faded out during hover interaction checks.

### 2. **Compact Sidebar Grid & Hover Overlays**
- A dedicated **"Active Build Set"** inspector card automatically renders in the sidebar under the Categories checklist.
- Lists all currently selected pieces as a **compact, horizontal flex grid of sleek icon badges**, featuring browser-native hover tooltips displaying the item's name.
- Hovering over any icon badge reveals a semi-transparent red overlay with a close icon (`X`), indicating that clicking it will cleanly remove it from the build set.
- Displays real-time, dynamic aggregates crucial for Elden Ring build planning (Equip Load / Roll speed estimations):
  - **Total Weight**: Summed weight of all active pieces.
  - **Total Poise**: Aggregate physical poise value.
  - **Total Negation**: Summed damage reduction percentages.

### 3. **Side-by-Side Attribute Comparison Modal**
- Clicking the `"Compare Set Attributes"` button opens a stunning glassmorphic overlay modal centered on the screen.
- Dynamically generates a side-by-side grid mapping of all crucial selected item stats:
  - **Armor Thumbnails & Category Badges**
  - **Weight**
  - **Damage Negations**: Physical, Strike, Slash, Pierce, Magic, Fire, Lightning, Holy.
  - **Status Resistances & Poise**: Immunity, Robustness, Focus, Vitality, Poise.
- Highly performant horizontal scroll mechanics prevent clipping and easily support comparison across a massive set of items.

---

## 🛠️ Unified Architectural Stack

The application is built on top of a highly resilient, modern frontend architecture matching industry best practices:

- **Core Framework**: React 19 + TypeScript + Vite.
- **State & Caching**: **TanStack React Query v5** for robust, declarative, and cached query states.
- **GraphQL Client**: **`graphql-request@7`** for lightweight, Promise-based operations.
- **Type Safety**: **GraphQL Code Generator** (`client` preset) with automatic type-only import compilations (`useTypeImports: true`) to comply with strict TypeScript bundler configs (`"verbatimModuleSyntax": true`).
- **Resilient Query Fetcher**: Sequential page querying inside the hook query function prevents server parallel flooding (socket resets on the public Elden Ring API server).
- **Partial-Data Salvage**: Catches GraphQL validation errors (e.g. database decimals conflicting with type schemas on specific pages) to extract and render successful items, maintaining a 99.9% render uptime.
- **Diagnostic Error Boundary**: Custom class boundary wraps the App, displaying custom dark diagnostic logs, component stack traces, and recovery triggers to avoid blank screens.

---

## 🚀 Getting Started

### Installation
Install the project dependencies using `pnpm`:
```bash
pnpm install
```

### Development Server
Run the dev server locally:
```bash
pnpm run dev
```

### Schema & Codegen Compilation
Compile the GraphQL schema and operations into type-safe generated TypeScript modules:
```bash
pnpm run codegen
```

### Production Build
Build and verify the optimized production bundles:
```bash
pnpm run build
```

---

## 📦 Deployment

The project is fully integrated with GitHub Pages. To trigger a production build and deploy live assets:
```bash
pnpm run deploy
```
*Note: This automatically runs the `predeploy` build pipeline and pushes the optimized `dist` folder to the `gh-pages` branch.*

---

## 📂 Project Structure

```
elden-chart/
├── codegen.ts                  # GraphQL Code Generator settings
├── package.json                # Project dependencies and gh-pages scripts
├── vite.config.ts              # Vite configurations and base path setups
└── src/
    ├── main.tsx                # React Query client provider mounting
    ├── gql/                    # Generated GraphQL types and documents
    └── components/
        ├── types.ts            # Core ArmorItem domain declarations
        ├── utils.ts            # HSL heatmap and stat lookup utilities
        ├── ErrorBoundary.tsx   # Diagnostic class error boundary
        ├── ArmorChart.tsx      # Main controller managing query states
        ├── ArmorChartHeader.tsx # Statistics panel header
        ├── ArmorChartSidebar.tsx # Sidebar filtering and axis selections
        ├── ArmorChartPlot.tsx  # SVGs, foreignObjects, and glow filters
        └── ArmorChartTooltip.tsx # Premium hovered detailed stat cards
```
