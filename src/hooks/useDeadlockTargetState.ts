import { useState } from 'react';

export function useDeadlockTargetState() {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [enemyAttacker, setEnemyAttacker] = useState<string | null>(null);
  const [engagementDistance, setEngagementDistance] = useState<number>(15);

  return {
    selectedHero,
    setSelectedHero,
    enemyAttacker,
    setEnemyAttacker,
    engagementDistance,
    setEngagementDistance
  };
}
