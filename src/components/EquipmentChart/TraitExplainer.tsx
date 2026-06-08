import { Info } from 'lucide-react';
import { useMemo } from 'react';

const CALCULATED_METRICS: Record<string, { description: string; formula?: string }> = {
  'ehp': { 
    description: 'Effective Health Pool. Measures total incoming damage required to kill you, including active bullet/spirit resistances.', 
    formula: 'BaseHealth / (1 - EffectiveResist)' 
  },
  'active_ehp': { 
    description: 'Active EHP. Effective HP factoring in active mitigation abilities and debuffs applied to enemies.', 
    formula: 'BaseHealth / (1 - EffectiveResist - ActiveMitigation)' 
  },
  'debuff_mitigation': { 
    description: 'Debuff Mitigation. Measures the protective value of reducing enemy damage output.', 
    formula: 'Integrated mitigation factors' 
  },
  'integrated_armor': { 
    description: 'Total Integrated Armor. Represents your marginal armor. Defenses in Deadlock stack multiplicatively, meaning adding an item gives less raw armor if you already have high armor.', 
    formula: '(1 - Π(1-Buff)) - (1 - Π(1-Shred))' 
  },
  'ehp_per_soul': { 
    description: 'eHP per Soul. Measures the cost-efficiency of defensive items. Higher is better.', 
    formula: 'Marginal eHP / Soul Cost' 
  },
  'MHpS': { 
    description: 'Marginal Health per Soul. Cost efficiency for raw health.', 
    formula: 'Marginal Health / Soul Cost' 
  },
  'MWDpS': { 
    description: 'Marginal Weapon Damage per Soul. Cost efficiency for weapon damage.', 
    formula: 'Marginal Weapon Damage % / Soul Cost' 
  },
  'MSPpS': { 
    description: 'Marginal Spirit Power per Soul. Cost efficiency for spirit power.', 
    formula: 'Marginal Spirit Power / Soul Cost' 
  },
  'Final Bullet DPS': { 
    description: 'Calculated final bullet damage per second including weapon power, fire rate, and active resists.', 
    formula: 'BaseDPS * (1+WepPower) * FireRateMult * (1-EffectiveResist)' 
  },
  'Final Spirit DPS': { 
    description: 'Calculated final spirit damage per second including spirit damage scaling and resists.', 
    formula: '(BaseDPS * (1+SpiritDmg) + TechPower * Coeff) * (1-EffectiveResist)' 
  },
  'Combined Hybrid DPS': { 
    description: 'Combined Bullet and Spirit DPS.', 
    formula: 'Bullet DPS + Spirit DPS' 
  },
  'weight': {
    description: 'The cost of the item in souls (Deadlock) or equip weight (Elden Ring).'
  },
  'category': {
    description: 'The category or slot of the equipment (e.g., Weapon, Armor, Vitality).'
  }
};

interface TraitExplainerProps {
  statId: string;
  rotateTooltip?: boolean;
}

export function TraitExplainer({ statId, rotateTooltip = false }: TraitExplainerProps) {
  const info = useMemo(() => {
    if (CALCULATED_METRICS[statId]) {
      return CALCULATED_METRICS[statId];
    }
    return {
      description: `Base game stat: ${statId.replace(/([A-Z])/g, ' $1').trim()}`,
      formula: undefined
    };
  }, [statId]);

  return (
    <div className="relative group flex items-center justify-center">
      <Info className="w-4 h-4 text-brand-accent/70 cursor-help transition-colors group-hover:text-brand-accent" />
      
      <div className={`absolute left-1/2 -translate-x-1/2 ${rotateTooltip ? 'top-full mt-2 rotate-90' : 'bottom-full mb-2'} w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-bg-card border border-border-main rounded-md shadow-xl p-3 z-50 pointer-events-none`}>
        <p className="text-xs text-text-primary leading-relaxed">
          {info.description}
        </p>
        {info.formula && (
          <p className="text-[10px] text-text-secondary font-mono mt-2 pt-2 border-t border-border-subtle">
            {info.formula}
          </p>
        )}
        {/* Triangle arrow */}
        <div className={`absolute border-4 border-transparent ${rotateTooltip ? 'right-full mr-[1px] top-1/2 -translate-y-1/2 border-r-border-main' : 'top-full left-1/2 -translate-x-1/2 border-t-border-main'}`} />
        <div className={`absolute border-4 border-transparent ${rotateTooltip ? 'right-[calc(100%-1px)] top-1/2 -translate-y-1/2 border-r-bg-card' : 'top-[calc(100%-1px)] left-1/2 -translate-x-1/2 border-t-bg-card'}`} />
      </div>
    </div>
  );
}
