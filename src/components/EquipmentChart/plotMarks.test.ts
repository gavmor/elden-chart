import { describe, it, expect } from 'vitest';
import { buildPlotMarks } from './plotMarks';

import type { EquipmentItem } from '../types';

// Mock EquipmentItem
const mockItem = {
  id: '1',
  name: 'Test Item',
  weight: 5,
  isActive: false,
} as unknown as EquipmentItem;

const activeItem = {
  ...mockItem,
  id: '2',
  isActive: true,
};

describe('buildPlotMarks', () => {
  it('builds basic marks without pareto and active items', () => {
    const marks = buildPlotMarks({
      filteredData: [mockItem],
      paretoItems: [],
      showPareto: false,
      colorVar: 'category',
      colorMinMax: null,
      getX: () => 1,
      getY: () => 1,
    });

    // Layer 4.75 (hull) + Layer 5 (image)
    expect(marks.length).toBe(2);
  });

  it('builds marks with pareto items', () => {
    const marks = buildPlotMarks({
      filteredData: [mockItem, mockItem],
      paretoItems: [mockItem, mockItem],
      showPareto: true,
      colorVar: 'category',
      colorMinMax: null,
      getX: () => 1,
      getY: () => 1,
    });

    // Layer 1 (line glow) + Layer 2 (line core) + Layer 3 (dot halos) + Layer 4.75 (hull) + Layer 5 (image)
    expect(marks.length).toBe(5);
  });

  it('builds marks with active items indicators', () => {
    const marks = buildPlotMarks({
      filteredData: [activeItem],
      paretoItems: [],
      showPareto: false,
      colorVar: 'category',
      colorMinMax: null,
      getX: () => 1,
      getY: () => 1,
    });

    // Layer 4.5 (active dot 1) + Layer 4.5 (active dot 2) + Layer 4.75 (hull) + Layer 5 (image)
    expect(marks.length).toBe(4);
  });

  it('does not render hull if colorVar is not category', () => {
    const marks = buildPlotMarks({
      filteredData: [mockItem],
      paretoItems: [],
      showPareto: false,
      colorVar: 'weight', // not category
      colorMinMax: null,
      getX: () => 1,
      getY: () => 1,
    });

    // Layer 5 (image) only
    expect(marks.length).toBe(1);
  });
});
