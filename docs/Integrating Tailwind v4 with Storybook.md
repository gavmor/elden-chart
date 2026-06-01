# **Architecture and Implementation of Idiomatic Tailwind CSS v4 and Storybook Integrations**

The release of Tailwind CSS v4 introduces a revolutionary, CSS-first configuration model that fundamentally simplifies frontend build pipelines.1 By moving away from JavaScript-based configuration files such as tailwind.config.js and embracing native CSS directives and cascade layers, the framework reduces external build dependencies and optimizes stylesheet compilation.1  
However, integrating this modernized architecture into Storybook requires a nuanced understanding of how Storybook manages its isolated development server.5 Because Storybook runs an independent builder instance, simply importing global styles is often insufficient.5 This report details the architectural shifts in Tailwind v4 and provides the most elegant, conventional, and idiomatic methods to achieve seamless integration across Vite, Webpack, and PostCSS pipelines, configure dark mode, and handle complex monorepo configurations.

## **Architectural Paradigm of Tailwind CSS v4**

In legacy versions of Tailwind CSS, styling configurations relied heavily on a centralized JavaScript file to define scan paths, theme extensions, and plugin configurations.6 Tailwind v4 shifts this responsibility directly to the CSS entrypoint.2 Through directives such as @import "tailwindcss", @theme, and @source, the stylesheet itself becomes the single source of truth for the compiler.1  
This architectural transition carries significant implications for Storybook environments. First, utility classes are resolved statically at build time, meaning that Storybook's bundler must actively compile the CSS entry point via the appropriate compiler plugin to avoid unstyled components in the Canvas.5 Second, automatic source detection automatically scans the project directory for utility class usage.1 However, classes utilized inside isolated components, external packages, or gitignored folders must be explicitly declared within the stylesheet using @source to avoid class purging during the static compilation phase.7 Finally, the compile-time architecture places theme variables and configurations inside native CSS cascade layers, improving selector precedence and eliminating styling conflicts between component libraries and global layouts.3

| Feature Category | Tailwind CSS v3 Paradigm | Tailwind CSS v4 Paradigm | Architectural Impact |
| :---- | :---- | :---- | :---- |
| **Configuration Model** | JavaScript-first (tailwind.config.js) 6 | CSS-first (@import "tailwindcss") 1 | Eliminates JS parser overhead; unifies token definitions within CSS.1 |
| **Dependency Footprint** | Heavy PostCSS, Autoprefixer, & Custom Parsers 6 | Unified @tailwindcss/vite or @tailwindcss/postcss 1 | Faster compilation times and minimized configuration scaffolding.1 |
| **Workspace Scanning** | Manual glob configurations in the content array 6 | Automatic source detection with targeted @source directives 7 | Reduces configuration maintenance; solves phantom class purging in monorepos.1 |
| **Dark Mode Mechanics** | Class/attribute mapping via JavaScript options 6 | Native CSS @custom-variant and @media queries 3 | Decouples theme toggling from JS runtimes, enabling pure CSS transitions.15 |

## **Vite-Based Integration Strategy**

Vite-based Storybook environments (using @storybook/react-vite, @storybook/vue3-vite, or similar frameworks) require integrating @tailwindcss/vite directly into Storybook's internal build pipeline.5  
A critical compatibility hurdle exists when integrating these tools. Storybook's configuration files are evaluated in a CommonJS context, whereas Tailwind v4's Vite plugin natively targets ES Modules.5 Attempting a static import (such as import tailwindcss from '@tailwindcss/vite') in .storybook/main.ts fails, throwing an evaluation error: Error: No "exports" main defined in /node\_modules/@tailwindcss/vite/package.json.5  
To bypass this evaluation barrier cleanly and idiomatically, the developer must dynamically import the plugin within Storybook's viteFinal configuration hook.5 Furthermore, Storybook configurations on Vite occasionally trigger asset pre-transform errors, specifically failing to locate /sb-preview/runtime.js.5 This is resolved by appending this path to Vite's assetsInclude array.5  
The standard .storybook/main.ts implementation for Vite is defined below:

TypeScript  
import type { StorybookConfig } from '@storybook/react-vite';  
import { mergeConfig } from 'vite';

const config: StorybookConfig \= {  
  stories: \['../src/\*\*/\*.mdx', '../src/\*\*/\*.stories.@(js|jsx|mjs|ts|tsx)'\],  
  addons: \[  
    '@storybook/addon-essentials',  
    '@storybook/addon-interactions',  
  \],  
  framework: {  
    name: '@storybook/react-vite',  
    options: {},  
  },  
  viteFinal: async (config) \=\> {  
    // Dynamic import resolves the CJS/ESM package export evaluation conflict  
    const { default: tailwindcss } \= await import('@tailwindcss/vite');  
      
    return mergeConfig(config, {  
      plugins: \[tailwindcss()\],  
      // Workaround for the Vite pre-transform runtime loading bug  
      assetsInclude: \['/sb-preview/runtime.js'\],  
    });  
  },  
};

export default config;

This configuration ensures that Storybook compiles the CSS entrypoint, injects the generated utility classes into the preview iframe, and styles all rendered UI components uniformly.6 Clean package installation cycles, such as deleting lockfiles and node modules, ensure dependencies resolve correctly to major version four without lingering legacy loaders.13

## **Webpack and PostCSS Integration Framework**

For frameworks relying on Webpack (such as Next.js, Angular, or custom Webpack setups), Tailwind v4 must be processed via @tailwindcss/postcss.4 This pipeline acts as a PostCSS plugin instead of a bundler-specific extension.4

### **Next.js Integration**

When integrating Tailwind v4 within a Next.js Storybook context, the framework leverages Webpack 5\.22 The setup utilizes @tailwindcss/postcss alongside standard styling plugins.4  
The developer must register the PostCSS plugin at the root of the project:

JavaScript  
// postcss.config.mjs  
const config \= {  
  plugins: {  
    '@tailwindcss/postcss': {},  
  },  
};  
export default config;

The global styles are subsequently imported into .storybook/preview.ts.23 To ensure that Next.js-specific features such as the App Router run correctly in isolation, parameters must be configured to set the app directory mode 22:

TypeScript  
//.storybook/preview.ts  
import type { Preview } from '@storybook/nextjs';  
import '../app/globals.css'; // Path to Next.js global styles \[21, 23\]

const preview: Preview \= {  
  parameters: {  
    nextjs: {  
      appDirectory: true, // Optimizes loading for Next.js App Router components   
    },  
  },  
};  
export default preview;

Additionally, next/font optimization and static asset directories are declared in .storybook/main.ts using the staticDirs array to ensure localized assets load properly inside the iframe.22

### **Angular 19+ Integration**

Integrating Tailwind v4 with Storybook in Angular 19+ requires careful management of CSS processing layers.19 Under the hood, Angular's default builder detects standard Tailwind configurations (such as tailwind.config.ts) and attempts to load them using legacy PostCSS v3 APIs, resulting in compilation failures.19  
To prevent the Angular CLI from auto-detecting and throwing errors, the developer should rename any legacy Tailwind files to storybook-tailwind.config.ts.19 The PostCSS processing is then delegated to @tailwindcss/postcss.19  
The highly refined integration pipeline for Angular is structured in the table below:

| Configuration Step | Implementation Target | Required Action | Technical Objective |
| :---- | :---- | :---- | :---- |
| **1\. Define PostCSS Plugin** | postcss.config.js | Register {'@tailwindcss/postcss': {}} 20 | Instructs Webpack to compile styles via Tailwind's v4 engine.4 |
| **2\. Declare Global Styles** | angular.json | Add "styles": \["src/styles.css"\] under Storybook target 20 | Unifies global styles as the single source of truth for the preview harness.20 |
| **3\. Cleanse Preview Imports** | .storybook/preview.ts | Remove any direct @import or CSS file references 20 | Avoids build conflicts and double-processing by Angular's loader pipeline.20 |
| **4\. Component-Level CSS** | Scoped CSS Files | Use @reference "../styles.css"; at the top of local stylesheets 20 | Grants component-level @apply access to global variables without duplicating CSS output.20 |

## **Implementing Idiomatic Themes and Native Dark Mode**

Tailwind v4 shifts theme definition away from JavaScript configurations, enabling native CSS variables to drive design systems.3 This design shift drastically simplifies theme switching and dark mode implementations in Storybook.3

### **Defining Custom CSS Variants and Tokens**

Rather than using explicit utility classes like bg-white dark:bg-black throughout the component markup, a more sustainable and elegant approach involves updating the CSS variables natively based on the active theme.3 This centralization keeps components highly readable.3  
To toggle themes using a class selector (such as .dark), a custom variant and its token mappings should be registered in the global CSS stylesheet 3:

CSS  
/\* src/index.css \*/  
@import "tailwindcss";

/\* Declare the custom dark mode variant selector \*/  
@custom-variant dark (&:where(.dark,.dark \*));

/\* Define semantic design tokens under the base theme \*/  
@theme {  
  \--color-canvas-bg: \#ffffff;  
  \--color-canvas-text: \#111111;  
  \--color-accent-primary: \#3b82f6;  
}

/\* Override variables in the dark theme layer \*/  
@layer theme {  
 .dark {  
    \--color-canvas-bg: \#0b0b0c;  
    \--color-canvas-text: \#f5f5f7;  
    \--color-accent-primary: \#60a5fa;  
  }  
}

Components can then leverage these tokens using standard utility classes:

TypeScript  
export const Card \= () \=\> (  
  \<div className="bg-canvas-bg text-canvas-text border-accent-primary border p-6 rounded-lg"\>  
    \<p\>This container switches colors natively without class manipulation.\</p\>  
  \</div\>  
);

### **Integrating @storybook/addon-themes**

To orchestrate theme switching inside the Storybook UI, the official @storybook/addon-themes package is the conventional tool.6 This addon can toggle classes directly on the story iframe's root element.6

TypeScript  
//.storybook/preview.ts  
import type { Preview } from '@storybook/react';  
import { withThemeByClassName } from '@storybook/addon-themes';  
import '../src/index.css';

const preview: Preview \= {  
  decorators:  
      },  
      defaultTheme: 'light',  
    }),  
  \],  
};

export default preview;

Once configured, a toolbar menu appears within the Storybook UI, allowing developers to switch between light and dark themes seamlessly.6 This toggling updates the class lists on the iframe root, causing Tailwind's @custom-variant to trigger variable swaps across native cascade layers automatically.3

## **Monorepos, NPM Workspaces, and the @source Directive**

In modular architectures (such as pnpm, Yarn, or npm Workspaces), component libraries are often isolated inside a dedicated package (such as @repo/ui), while Storybook lives in another app package (such as apps/storybook).1  
Because Tailwind v4's compiler automatically scans for classes using relative folder heuristics from the build entrypoint, it will miss utility classes written within sibling package files.8 Consequently, components will import without styling, resulting in broken stories.8  
Tailwind v4 solves this cleanly through the @source directive.7 This directive tells the compiler explicitly where to scan for utility classes during compilation, bypassing build-tool-specific glob configuration files.1  
To bridge sibling components within a monorepo setup, modify the global CSS entrypoint to point directly at the workspace directory containing the raw source code of the UI components 1:

CSS  
/\* apps/storybook/src/index.css \*/  
@import "tailwindcss";

/\* Explicitly direct the compiler to scan sibling workspace package files  \*/  
@source "../../../packages/ui/src/\*\*/\*.{ts,tsx,js,jsx,vue}";

To automate this setup in scaling micro-frontend systems, development teams can leverage workspace graph tools.1 For instance, Nx Sync Generators can be integrated to scan internal package configurations automatically and inject these exact @source paths into the primary CSS file prior to executing the Storybook build.1 This programmatic solution eliminates configuration maintenance and prevents missing styles.1

## **Automated Design System Documentation with Tailwind Autodocs**

For organizations building design systems, maintaining documentation that mirrors Tailwind configuration modifications is critical.25 The storybook-addon-tailwind-autodocs package streamlines this by extracting design tokens directly from the v4 CSS entrypoint.25

TypeScript  
//.storybook/main.ts  
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig \= {  
  stories:  
    '../src/\*\*/\*.stories.@(js|jsx|ts|tsx)'  
  \],  
  addons:,  
};

export default config;

This configuration parses CSS @theme layers directly, generating documentation pages for colors, spacing, typography, and responsive breakpoints dynamically.25 By feeding token metrics directly into Storybook's documentation pipeline, teams ensure that style guides and design outputs remain perfectly aligned.25

## **Strategic Architectural Recommendations**

Integrating Tailwind CSS v4 with Storybook provides an exceptionally clean, robust, and high-performance development experience when built on modern principles. Rather than relying on legacy configurations and double-compiling stylesheets, engineering teams should standardize their implementations on clean native Webpack/PostCSS and Vite pipelines.  
To ensure long-term ease of maintenance and peak rendering performance, frontend architects should design themes around CSS Custom Properties rather than utility class prefixes, which substantially reduces compiled asset sizes. Furthermore, using native @source directives in shared package layers cleanly resolves the scanning challenges typical of monorepo setups, and integrating automated documentation plugins guarantees that live design system guidelines stay perfectly synchronized with the codebase. Applying these idiomatic techniques guarantees a modular, future-proof, and highly optimized UI development workflow.

#### **Works cited**

1. Configure Tailwind 4 with Vite in an NPM Workspace: The Complete Guide | Nx Blog, accessed May 25, 2026, [https://nx.dev/blog/setup-tailwind-4-npm-workspace](https://nx.dev/blog/setup-tailwind-4-npm-workspace)  
2. Design system package in monorepo: Tailwind CSS ^4.1.5 not applied in Storybook ^8.6.12, accessed May 25, 2026, [https://stackoverflow.com/questions/79622613/design-system-package-in-monorepo-tailwind-css-4-1-5-not-applied-in-storybook](https://stackoverflow.com/questions/79622613/design-system-package-in-monorepo-tailwind-css-4-1-5-not-applied-in-storybook)  
3. TailwindCSS v4 dark theme by class not working without dark tag \- Stack Overflow, accessed May 25, 2026, [https://stackoverflow.com/questions/79487101/tailwindcss-v4-dark-theme-by-class-not-working-without-dark-tag](https://stackoverflow.com/questions/79487101/tailwindcss-v4-dark-theme-by-class-not-working-without-dark-tag)  
4. Installing Tailwind CSS with PostCSS, accessed May 25, 2026, [https://tailwindcss.com/docs/installation/using-postcss](https://tailwindcss.com/docs/installation/using-postcss)  
5. Integration of @tailwindcss/vite with Storybook Causes Vite CJS ..., accessed May 25, 2026, [https://github.com/tailwindlabs/tailwindcss/discussions/16687](https://github.com/tailwindlabs/tailwindcss/discussions/16687)  
6. Tailwind CSS | Storybook recipes, accessed May 25, 2026, [https://storybook.js.org/recipes/tailwindcss](https://storybook.js.org/recipes/tailwindcss)  
7. Tailwind v4 @theme styles not showing up in storybook stylesheet \- Stack Overflow, accessed May 25, 2026, [https://stackoverflow.com/questions/79487904/tailwind-v4-theme-styles-not-showing-up-in-storybook-stylesheet](https://stackoverflow.com/questions/79487904/tailwind-v4-theme-styles-not-showing-up-in-storybook-stylesheet)  
8. My Journey Building a Design System with Storybook and Tailwind CSS v4, accessed May 25, 2026, [https://www.designsystemscollective.com/my-journey-building-a-design-system-with-storybook-and-tailwind-css-v4-d463de06ae41](https://www.designsystemscollective.com/my-journey-building-a-design-system-with-storybook-and-tailwind-css-v4-d463de06ae41)  
9. Integrating Storybook with Tailwind CSS v4.1 in a React \+ Vite Project (TypeScript or JavaScript) | by Ayomitunde Isijola | Medium, accessed May 25, 2026, [https://medium.com/@ayomitunde.isijola/integrating-storybook-with-tailwind-css-v4-1-f520ae018c10](https://medium.com/@ayomitunde.isijola/integrating-storybook-with-tailwind-css-v4-1-f520ae018c10)  
10. Moving phoenix\_storybook to Tailwind 4.0 \- Questions / Help \- Elixir Forum, accessed May 25, 2026, [https://elixirforum.com/t/moving-phoenix-storybook-to-tailwind-4-0/69645](https://elixirforum.com/t/moving-phoenix-storybook-to-tailwind-4-0/69645)  
11. Theming in Tailwind CSS v4: Support Multiple Color Schemes and Dark Mode \- Medium, accessed May 25, 2026, [https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14)  
12. Setting Up Tailwind and Theming | Building Design Systems in ..., accessed May 25, 2026, [https://stevekinney.com/courses/storybook/setting-up-tailwind](https://stevekinney.com/courses/storybook/setting-up-tailwind)  
13. \[v4\] Tailwind 4 not working with Vite \+ Storybook \+ Nx · tailwindlabs tailwindcss · Discussion \#16451 \- GitHub, accessed May 25, 2026, [https://github.com/tailwindlabs/tailwindcss/discussions/16451](https://github.com/tailwindlabs/tailwindcss/discussions/16451)  
14. How to setup Next.js \+ Typescript \+ TailwindCSS \+ Storybook and adding theme switcher capabilities \- Yusuf Abid, accessed May 25, 2026, [https://yuxufm.medium.com/how-to-setup-next-js-typescript-tailwindcss-storybook-and-adding-theme-switcher-capabilities-a47af917ceee](https://yuxufm.medium.com/how-to-setup-next-js-typescript-tailwindcss-storybook-and-adding-theme-switcher-capabilities-a47af917ceee)  
15. Dark mode \- Core concepts \- Tailwind CSS, accessed May 25, 2026, [https://tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode)  
16. How can I toggle dark mode using a single class in Tailwind CSS? \- Reddit, accessed May 25, 2026, [https://www.reddit.com/r/tailwindcss/comments/1ncicfi/how\_can\_i\_toggle\_dark\_mode\_using\_a\_single\_class/](https://www.reddit.com/r/tailwindcss/comments/1ncicfi/how_can_i_toggle_dark_mode_using_a_single_class/)  
17. Dark mode using Tailwindcss v4.0 \- DEV Community, accessed May 25, 2026, [https://dev.to/tene/dark-mode-using-tailwindcss-v40-2lc6](https://dev.to/tene/dark-mode-using-tailwindcss-v40-2lc6)  
18. \[Bug\]: Configuration with TailwindCss · storybookjs storybook · Discussion \#26323 \- GitHub, accessed May 25, 2026, [https://github.com/storybookjs/storybook/discussions/26323](https://github.com/storybookjs/storybook/discussions/26323)  
19. \[Bug\]: Angular \- Storybook fails to consume postcss config file \#30208 \- Issuehunt OSS, accessed May 25, 2026, [https://oss.issuehunt.io/r/storybookjs/storybook/issues/30208](https://oss.issuehunt.io/r/storybookjs/storybook/issues/30208)  
20. \[Bug\]: Angular and Tailwind 4 · Issue \#31988 · storybookjs/storybook \- GitHub, accessed May 25, 2026, [https://github.com/storybookjs/storybook/issues/31988](https://github.com/storybookjs/storybook/issues/31988)  
21. Install Tailwind CSS with Next.js, accessed May 25, 2026, [https://tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs)  
22. Storybook for Next.js with Webpack, accessed May 25, 2026, [https://storybook.js.org/docs/get-started/frameworks/nextjs](https://storybook.js.org/docs/get-started/frameworks/nextjs)  
23. Guide to Integrating Next.js with Tailwind CSS & Storybook for Web Development, accessed May 25, 2026, [https://www.lost-pixel.com/blog/integrating-next-js-with-tailwind-and-storybook](https://www.lost-pixel.com/blog/integrating-next-js-with-tailwind-and-storybook)  
24. \[Bug\]: Angular \- Storybook fails to consume postcss config file · Issue \#30208 \- GitHub, accessed May 25, 2026, [https://github.com/storybookjs/storybook/issues/30208](https://github.com/storybookjs/storybook/issues/30208)  
25. Tailwind Autodocs | Storybook integrations, accessed May 25, 2026, [https://storybook.js.org/addons/storybook-addon-tailwind-autodocs](https://storybook.js.org/addons/storybook-addon-tailwind-autodocs)