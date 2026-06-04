import { describe, it, expect } from 'vitest';
import { getGlowFilter } from './plotStyles';

describe('plotStyles', () => {
  describe('getGlowFilter', () => {
    it('returns minimal dropshadow if auraSize is 0', () => {
      const result = getGlowFilter({
        isOptimal: true,
        isInSet: true,
        initialColor: '#ff0000',
        auraSize: 0,
        auraStyle: 'glow',
        datasetSize: 10
      });
      expect(result).toBe('drop-shadow(0 1px 2px rgba(0,0,0,0.6))');
    });

    it('disables complex glow for non-focal items in large datasets (> 80)', () => {
      const result = getGlowFilter({
        isOptimal: false,
        isInSet: false,
        initialColor: '#ff0000',
        auraSize: 5,
        auraStyle: 'glow',
        datasetSize: 100
      });
      expect(result).toBe('drop-shadow(0 1px 2px rgba(0,0,0,0.6))');
    });

    it('returns optimal glow when item is optimal', () => {
      const result = getGlowFilter({
        isOptimal: true,
        isInSet: false,
        initialColor: '#ff0000',
        auraSize: 3,
        auraStyle: 'glow',
        datasetSize: 50
      });
      expect(result).toContain('#fbbf24');
      expect(result).toContain('#d97706');
    });

    it('returns set glow when item is in set but not optimal', () => {
      const result = getGlowFilter({
        isOptimal: false,
        isInSet: true,
        initialColor: '#ff0000',
        auraSize: 3,
        auraStyle: 'glow',
        datasetSize: 50
      });
      expect(result).toContain('#fbbf24');
    });

    it('handles outline style for optimal items', () => {
      const result = getGlowFilter({
        isOptimal: true,
        isInSet: false,
        initialColor: '#ff0000',
        auraSize: 3,
        auraStyle: 'outline',
        datasetSize: 50
      });
      expect(result).toContain('drop-shadow(1px 0 0 #fbbf24)');
      expect(result).toContain('drop-shadow(0 0 3px #fbbf24)');
    });

    it('handles regular background items for small datasets', () => {
      const result = getGlowFilter({
        isOptimal: false,
        isInSet: false,
        initialColor: '#00ff00',
        auraSize: 3,
        auraStyle: 'glow',
        datasetSize: 20
      });
      expect(result).toContain('#00ff00');
      expect(result).toContain('drop-shadow(0 1px 2px rgba(0,0,0,0.6))');
    });
  });
});
