export const statLabel = (stat: string): string => {
  switch (stat) {
    case 'Ligt': return 'Lightning';
    case 'Phy': return 'Physical';
    case 'Mag': return 'Magic';
    default: return stat;
  }
};

export const formatAttackLabel = (name: string): string => statLabel(name);
export const formatDefenceLabel = (name: string): string => statLabel(name);

export const renderCalculatedLabel = (stat: string) => {
  const labels: Record<string, { name: string; formula: string }> = {
    'ehp': { name: 'Effective HP', formula: 'BaseHealth / (1 - EffectiveResist)' },
    'active_ehp': { name: 'Active EHP', formula: 'BaseHealth / (1 - EffectiveResist - ActiveMitigation)' },
    'debuff_mitigation': { name: 'Debuff Mitigation', formula: 'Integrated mitigation factors' },
    'integrated_armor': { name: 'Total Integrated Armor', formula: '(1 - Π(1-Buff)) - (1 - Π(1-Shred))' },
    'ehp_per_soul': { name: 'eHP / Soul', formula: 'Marginal eHP / Soul Cost' },
    'MHpS': { name: 'Marginal Health per Soul (MHpS)', formula: 'Marginal Health / Soul Cost' },
    'MWDpS': { name: 'Marginal Weapon Damage % per Soul (MWDpS)', formula: 'Marginal Weapon Damage % / Soul Cost' },
    'MSPpS': { name: 'Marginal Spirit Power per Soul (MSPpS)', formula: 'Marginal Spirit Power / Soul Cost' },
    'Final Bullet DPS': { name: 'Final Bullet DPS', formula: 'BaseDPS * (1+WepPower) * FireRateMult * (1-EffectiveResist)' },
    'Final Spirit DPS': { name: 'Final Spirit DPS', formula: '(BaseDPS * (1+SpiritDmg) + TechPower * Coeff) * (1-EffectiveResist)' },
    'Combined Hybrid DPS': { name: 'Combined Hybrid DPS', formula: 'Bullet DPS + Spirit DPS' }
  };
  const data = labels[stat] || { name: stat, formula: '' };
  return (
    <div className="flex flex-col">
      <span>{data.name}</span>
      {data.formula && <span className="text-[9px] text-muted-foreground/70 font-mono mt-0.5">{data.formula}</span>}
    </div>
  );
};
