import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useContainerSize } from './useContainerSize';

describe('useContainerSize', () => {
  beforeEach(() => {
    // Mock ResizeObserver
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });

  it('returns default size initially', () => {
    const mockRef = { current: document.createElement('div') };
    const { result } = renderHook(() => useContainerSize(mockRef, true));
    
    expect(result.current).toEqual({ width: 600, height: 400 });
  });

  it('observes the container if ref is provided and data exists', () => {
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    globalThis.ResizeObserver = class ResizeObserver {
      observe = observeMock;
      unobserve() {}
      disconnect = disconnectMock;
    } as unknown as typeof ResizeObserver;

    const mockRef = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useContainerSize(mockRef, true));

    expect(observeMock).toHaveBeenCalledWith(mockRef.current);

    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });
});
