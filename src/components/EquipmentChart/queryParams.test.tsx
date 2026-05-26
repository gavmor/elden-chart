/**
 * Regression tests: URL query params x= and y= must be respected on (re)load.
 *
 * Root cause: `initialParams` in EquipmentChart/index.tsx is a module-level
 * constant evaluated once at import time.  Setting window.location.search
 * *after* the module has already been cached has no effect on the useState
 * initializers — they see stale 'weight' values regardless of the URL.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Minimal armor fixture — two items with distinct stat names so statOptions
// will include 'total_negation' and 'Poise', and the axis-reset guard won't
// clobber the URL-specified values.
// ---------------------------------------------------------------------------
const HELM: import('../types').ArmorItem = {
  id: 'helm-1',
  name: 'Iron Helm',
  image: null,
  category: 'Helm',
  description: '',
  weight: 4.5,
  kind: 'armor',
  dmgNegation: [
    { name: 'Phy', amount: 4 },
    { name: 'Magic', amount: 3 },
  ],
  resistance: [
    { name: 'Immunity', amount: 20 },
    { name: 'Poise', amount: 5 },
  ],
};

const CHEST: import('../types').ArmorItem = {
  id: 'chest-1',
  name: 'Iron Chest',
  image: null,
  category: 'Chest Armor',
  description: '',
  weight: 10,
  kind: 'armor',
  dmgNegation: [
    { name: 'Phy', amount: 10 },
    { name: 'Magic', amount: 7 },
  ],
  resistance: [
    { name: 'Immunity', amount: 40 },
    { name: 'Poise', amount: 15 },
  ],
};

// ---------------------------------------------------------------------------
// Mock useEquipmentData so we never hit the network.
// ---------------------------------------------------------------------------
vi.mock('../../hooks/useEquipmentData', () => ({
  useEquipmentData: () => ({ data: [HELM, CHEST], isLoading: false, error: null }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

async function renderChart() {
  // EquipmentChart must be re-imported fresh each time so that the
  // module-level `initialParams` constant re-runs getInitialParams()
  // against the current window.location.search.
  // vi.resetModules() + dynamic import achieves this per-test isolation.
  const { default: EquipmentChart } = await import('./index');
  const client = makeClient();
  render(
    <QueryClientProvider client={client}>
      <EquipmentChart />
    </QueryClientProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('EquipmentChart — URL query param restoration on refresh', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('uses default axes when no query params are present', async () => {
    window.history.replaceState({}, '', '/');
    await renderChart();

    await waitFor(() => {
      const xSelect = screen.getByRole('combobox', { name: 'X-Axis' }) as HTMLSelectElement;
      expect(xSelect.value).toBe('weight');
    });
  });

  it('restores x= and y= axis params from URL on mount', async () => {
    // Simulate a page load with ?x=total_negation&y=Poise in the URL.
    window.history.replaceState({}, '', '/?x=total_negation&y=Poise');
    await renderChart();

    await waitFor(() => {
      const xSelect = screen.getByRole('combobox', { name: 'X-Axis' }) as HTMLSelectElement;
      const ySelect = screen.getByRole('combobox', { name: 'Y-Axis' }) as HTMLSelectElement;

      // Verify that the controls successfully read the URL parameters on mount
      expect(xSelect.value).toBe('total_negation');
      expect(ySelect.value).toBe('Poise');
    });
  });
});
