import { useState } from 'react';

export function useDeadlockTargetState() {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [enemyAttacker, setEnemyAttacker] = useState<string | null>(null);

  return {
    selectedHero,
    setSelectedHero,
    enemyAttacker,
    setEnemyAttacker
  };
}
