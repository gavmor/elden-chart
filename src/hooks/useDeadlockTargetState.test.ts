import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDeadlockTargetState } from './useDeadlockTargetState';
import { DEFAULT_TARGET_CONFIG } from '../components/types';

describe('useDeadlockTargetState', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useDeadlockTargetState());

    expect(result.current.selectedHero).toBeNull();
    expect(result.current.targetConfig).toEqual(DEFAULT_TARGET_CONFIG);
  });

  it('updates selected hero', () => {
    const { result } = renderHook(() => useDeadlockTargetState());

    act(() => {
      result.current.setSelectedHero('Paradox');
    });

    expect(result.current.selectedHero).toBe('Paradox');
  });

  it('updates target spirit resistance', () => {
    const { result } = renderHook(() => useDeadlockTargetState());

    act(() => {
      result.current.setTargetSpiritResistance(0.25);
    });

    expect(result.current.targetConfig.targetSpiritResistance).toBe(0.25);
  });

  it('updates target bullet resistance', () => {
    const { result } = renderHook(() => useDeadlockTargetState());

    act(() => {
      result.current.setTargetBulletResistance(0.40);
    });

    expect(result.current.targetConfig.targetBulletResistance).toBe(0.40);
  });

});
