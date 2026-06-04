import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlotStableRefs } from './usePlotStableRefs';
import type { EquipmentItem } from '../types';
describe('usePlotStableRefs', () => {
  it('captures initial callbacks and props', () => {
    const onHoverItem = vi.fn();
    const onLeavePlot = vi.fn();
    const onClickItem = vi.fn();
    const customSet: EquipmentItem[] = [];

    const { result } = renderHook(() => usePlotStableRefs({
      onHoverItem,
      onLeavePlot,
      onClickItem,
      customSet
    }));

    expect(result.current.onHoverItemRef.current).toBe(onHoverItem);
    expect(result.current.onLeavePlotRef.current).toBe(onLeavePlot);
    expect(result.current.onClickItemRef.current).toBe(onClickItem);
    expect(result.current.customSetRef.current).toBe(customSet);
  });

  it('updates refs when props change', () => {
    const onHoverItem = vi.fn();
    const onLeavePlot = vi.fn();
    const onClickItem = vi.fn();
    const customSet: EquipmentItem[] = [{ id: '1' } as EquipmentItem];

    const { result, rerender } = renderHook(
      (props) => usePlotStableRefs(props),
      {
        initialProps: {
          onHoverItem,
          onLeavePlot,
          onClickItem,
          customSet
        }
      }
    );

    const newOnHoverItem = vi.fn();
    const newCustomSet = [{ id: '1' }, { id: '2' }] as unknown as EquipmentItem[];

    rerender({
      onHoverItem: newOnHoverItem,
      onLeavePlot,
      onClickItem,
      customSet: newCustomSet
    });

    expect(result.current.onHoverItemRef.current).toBe(newOnHoverItem);
    expect(result.current.customSetRef.current).toBe(newCustomSet);
    expect(result.current.onClickItemRef.current).toBe(onClickItem); // Remains the same
  });
});
