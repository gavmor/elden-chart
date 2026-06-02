import { useState, useCallback } from 'react';
import type { TargetConfiguration } from '../components/types';
import { DEFAULT_TARGET_CONFIG } from '../components/types';

export function useDeadlockTargetState() {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [targetConfig, setTargetConfig] = useState<TargetConfiguration>(DEFAULT_TARGET_CONFIG);

  const setTargetSpiritResistance = useCallback((value: number) => {
    setTargetConfig(prev => ({ ...prev, targetSpiritResistance: value }));
  }, []);

  const setTargetBulletResistance = useCallback((value: number) => {
    setTargetConfig(prev => ({ ...prev, targetBulletResistance: value }));
  }, []);

  return {
    selectedHero,
    setSelectedHero,
    targetConfig,
    setTargetSpiritResistance,
    setTargetBulletResistance
  };
}
