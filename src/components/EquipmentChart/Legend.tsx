import React from 'react';

interface Props {
  activeGame: 'elden-ring' | 'deadlock';
}

export const EquipmentChartLegend: React.FC<Props> = ({ activeGame }) => {
  return (
    <div className="absolute top-6 right-6 bg-panel/80 backdrop-blur-md border border-accent/20 rounded-lg p-3 text-xs shadow-lg pointer-events-none z-10">
      <div className="font-semibold text-brand-accent mb-2 uppercase tracking-wider text-[10px]">Chart Legend</div>
      <div className="space-y-2">
        {activeGame === 'deadlock' && (
          <div className="flex items-center gap-2">
            <span className="w-5 text-center text-sm">⚡</span>
            <span className="text-body text-text-secondary">Active Item / Ability</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-5 text-center text-sm relative">
            <span className="absolute inset-0 flex items-center justify-center">🛡️</span>
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400 border-dashed opacity-50 scale-150"></span>
          </span>
          <span className="text-body text-text-secondary">Provides Debuff Mitigation</span>
        </div>
      </div>
    </div>
  );
};
