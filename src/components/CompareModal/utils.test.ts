import { describe, it, expect } from 'vitest';
import { getHeatmapBg, getStatRange } from '../utils';
import { helmItem, chestItem, gauntletsItem } from './test-fixtures';

describe('getHeatmapBg', () => {
  it('returns transparent when range is zero', () => {
    expect(getHeatmapBg(5, 5, 5, false)).toBe('transparent');
  });

  it('returns warm hue (reddish) for low value', () => {
    const result = getHeatmapBg(0, 0, 100, false);
    expect(result).toBe('hsl(0, 50%, 22%)');
  });

  it('returns cool hue (blueish) for high value', () => {
    const result = getHeatmapBg(100, 0, 100, false);
    expect(result).toBe('hsl(220, 50%, 22%)');
  });

  it('returns mid hue for midpoint', () => {
    const result = getHeatmapBg(50, 0, 100, false);
    expect(result).toBe('hsl(110, 50%, 22%)');
  });

  it('inverts the hue when invert is true', () => {
    const lowNormal = getHeatmapBg(10, 0, 100, false);
    const highInverted = getHeatmapBg(90, 0, 100, true);
    expect(lowNormal).toBe(highInverted);
  });

  it('clamps ratio correctly for edge values', () => {
    const low = getHeatmapBg(0, 0, 10, false);
    const high = getHeatmapBg(10, 0, 10, false);
    expect(low).toBe('hsl(0, 50%, 22%)');
    expect(high).toBe('hsl(220, 50%, 22%)');
  });
});

describe('getStatRange', () => {
  const items = [helmItem, chestItem, gauntletsItem];

  it('returns correct min and max for a stat across items', () => {
    const { min, max } = getStatRange(items, 'weight');
    expect(min).toBe(3.0);
    expect(max).toBe(11.5);
  });

  it('handles single item', () => {
    const { min, max } = getStatRange([helmItem], 'weight');
    expect(min).toBe(4.2);
    expect(max).toBe(4.2);
  });

  it('computes range for negation stats', () => {
    const { min, max } = getStatRange(items, 'Phy');
    expect(min).toBe(3.0);
    expect(max).toBe(12.0);
  });

  it('computes range for resistance stats', () => {
    const { min, max } = getStatRange(items, 'Immunity');
    expect(min).toBe(12);
    expect(max).toBe(35);
  });
});
