# Product Guidelines

## Core Principles
1. **Visual Excellence First**: Deliver a stunning, highly polished UI inspired by the dark-fantasy aesthetic of Elden Ring. Utilize smooth micro-animations, halos, and custom HSL categorical colors.
2. **Performance-Driven**: Keep data-fetching resilient (TanStack React Query) and avoid parallel flooding. The scatter plot must handle thousands of items with smooth 60fps performance and instantaneous hovering and rendering.
3. **Immersive Feedback**: Incorporate tactile feedback for all user interactions, particularly the frameless transparent item previews and hover states.

## UX & Design Guidelines
- **Color Palette**: Void Charcoal panels, Tarnished Gold accents, Stormhill Gray labels, and Frost Blue for highlights and positive deltas.
- **Micro-Animations**: Hover actions should immediately trigger scaling (e.g., 15%) and precise drop-shadow halos, recovering instantaneously on mouseoff.
- **Accessibility**: Ensure high contrast for all text over dark backgrounds and intuitive error boundaries for data API failures.
- **Responsive Layout**: Provide a compact, easily accessible sidebar for custom builds and a fluid primary workspace for the scatter plot.
