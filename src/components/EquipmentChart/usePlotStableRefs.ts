import { useLayoutEffect, useRef } from 'react';
import type { EquipmentItem } from '../types';

interface Callbacks {
  onHoverItem: (e: MouseEvent, item: EquipmentItem) => void;
  onLeavePlot: () => void;
  onClickItem: (item: EquipmentItem) => void;
  customSet: EquipmentItem[];
}

export function usePlotStableRefs(callbacks: Callbacks) {
  const onHoverItemRef = useRef(callbacks.onHoverItem);
  const onLeavePlotRef = useRef(callbacks.onLeavePlot);
  const onClickItemRef = useRef(callbacks.onClickItem);
  const customSetRef = useRef(callbacks.customSet);

  useLayoutEffect(() => {
    onHoverItemRef.current = callbacks.onHoverItem;
    onLeavePlotRef.current = callbacks.onLeavePlot;
    onClickItemRef.current = callbacks.onClickItem;
    customSetRef.current = callbacks.customSet;
  });

  return {
    onHoverItemRef,
    onLeavePlotRef,
    onClickItemRef,
    customSetRef
  };
}
