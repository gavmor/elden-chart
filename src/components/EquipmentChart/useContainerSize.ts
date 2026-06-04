import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

export function useContainerSize(containerRef: RefObject<HTMLElement | null>, hasData: boolean) {
  const [size, setSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.max(width, 100), height: Math.max(height, 100) });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasData, containerRef]);

  return size;
}
