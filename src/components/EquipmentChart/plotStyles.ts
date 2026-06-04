export const FOCAL_COLOR = '#fbbf24';
export const FOCAL_COLOR_DEEP = '#d97706';

export interface GlowFilterProps {
  isOptimal: boolean;
  isInSet: boolean;
  initialColor: string;
  auraSize: number;
  auraStyle: 'glow' | 'outline';
  datasetSize: number;
}

export function getGlowFilter({
  isOptimal,
  isInSet,
  initialColor,
  auraSize,
  auraStyle,
  datasetSize
}: GlowFilterProps): string {
  if (auraSize === 0) {
    return 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
  }

  const isFocalItem = isOptimal || isInSet;
  const color = isFocalItem ? FOCAL_COLOR : initialColor;

  // Adaptive performance bypass: if dataset is large, disable complex colored drop-shadow filters on non-focal items
  if (!isFocalItem && datasetSize > 80) {
    return 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))';
  }

  if (auraStyle === 'outline') {
    // Crisp outline thickness (1px for size 1-3, 2px for size 4-7, 3px for size 8+)
    const t = auraSize <= 3 ? 1 : auraSize <= 7 ? 2 : 3;

    if (isOptimal) {
      const baseOutline = `drop-shadow(${t}px 0 0 ${color}) drop-shadow(-${t}px 0 0 ${color}) drop-shadow(0 ${t}px 0 ${color}) drop-shadow(0 -${t}px 0 ${color})`;
      return `drop-shadow(0 0 3px ${FOCAL_COLOR}) ${baseOutline}`;
    }
    if (isInSet) {
      const baseOutline = `drop-shadow(${t}px 0 0 ${color}) drop-shadow(-${t}px 0 0 ${color}) drop-shadow(0 ${t}px 0 ${color}) drop-shadow(0 -${t}px 0 ${color})`;
      return `drop-shadow(0 0 2px ${FOCAL_COLOR}) ${baseOutline}`;
    }
    
    // Regular background items in a small dataset: simplify from 4 chained drop shadows to a lighter dual drop shadow
    return `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 1px ${color})`;
  }

  // Otherwise, 'glow' style
  if (isOptimal) {
    return `drop-shadow(0 0 ${auraSize * 2.5}px ${FOCAL_COLOR}) drop-shadow(0 0 ${auraSize}px ${FOCAL_COLOR_DEEP}) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
  }
  if (isInSet) {
    return `drop-shadow(0 0 ${auraSize * 2}px ${FOCAL_COLOR}) drop-shadow(0 0 ${auraSize * 0.7}px ${FOCAL_COLOR_DEEP}) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
  }

  // Regular background items in a small dataset: single-pass drop-shadow is extremely lightweight
  return `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 ${auraSize}px ${initialColor})`;
}
