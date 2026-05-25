import { X, Scale, Shield } from 'lucide-react';
import type { ArmorItem } from './types';
import { getCategoryIcon, getItemStat } from './utils';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  customSet: ArmorItem[];
}

export default function ArmorCompareModal({ isOpen, onClose, customSet }: CompareModalProps) {
  if (!isOpen) return null;

  // Key stats to compare
  const negationStats = ['Phy', 'Strike', 'Slash', 'Pierce', 'Magic', 'Fire', 'Ligt', 'Holy'];
  const resistanceStats = ['Immunity', 'Robustness', 'Focus', 'Vitality', 'Poise'];

  // Row-normalized heatmap background: cool (blue) to warm (red) via HSL hue sweep.
  // invert=true means lower values get warm colors (used for weight).
  const getHeatmapBg = (value: number, min: number, max: number, invert: boolean): string => {
    const range = max - min;
    if (range === 0) return 'transparent';
    let ratio = (value - min) / range;
    if (invert) ratio = 1 - ratio;
    const hue = 220 - ratio * 220;
    return `hsl(${hue}, 30%, 18%)`;
  };

  // Compute row-wide min/max for a given stat across all customSet items
  const statRange = (statName: string): { min: number; max: number } => {
    const vals = customSet.map(item => getItemStat(item, statName));
    return { min: Math.min(...vals), max: Math.max(...vals) };
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" /> Armor Set Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Compare stats across your selected build items side-by-side</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-400 flex items-center justify-center border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {customSet.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center gap-3">
              <Shield className="w-12 h-12 text-slate-700" />
              <p className="text-sm">Your build set is empty. Click points on the plot to add armor pieces.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/20 w-40">Stat</th>
                    {customSet.map(item => (
                      <th key={`th-${item.id}`} className="p-3 bg-slate-950/10 min-w-[150px]">
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-12 h-12 rounded bg-slate-950 flex items-center justify-center border border-slate-800 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              getCategoryIcon(item.category, { className: "w-6 h-6 text-slate-600", fill: "currentColor" })
                            )}
                          </div>
                          <span className="font-bold text-white text-xs line-clamp-1">{item.name}</span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-750 flex items-center gap-1 w-fit">
                            {getCategoryIcon(item.category, { className: "w-2.5 h-2.5", fill: "currentColor" })}
                            {item.category.replace(' Armor', '')}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {/* General Stats */}
                  <tr className="hover:bg-slate-850/50">
                    <td className="p-3 font-semibold text-slate-350 bg-slate-950/20 pl-4">Weight</td>
                    {(() => {
                      const { min, max } = statRange('weight');
                      return customSet.map(item => (
                        <td
                          key={`weight-${item.id}`}
                          className="p-3 text-center text-white font-medium transition-colors"
                          style={{ backgroundColor: getHeatmapBg(item.weight, min, max, true) }}
                        >
                          {item.weight.toFixed(1)}
                        </td>
                      ));
                    })()}
                  </tr>
                  
                  {/* Negation Subheading */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={customSet.length + 1} className="p-2 px-3 text-[10px] uppercase font-bold text-amber-500/80 tracking-wider pl-4">
                      Damage Negation (%)
                    </td>
                  </tr>

                  {negationStats.map(stat => {
                    const { min, max } = statRange(stat);
                    return (
                    <tr key={stat} className="hover:bg-slate-855/30">
                      <td className="p-3 text-slate-400 pl-6 bg-slate-950/20">
                        {stat === 'Ligt' ? 'Lightning' : (stat === 'Phy' ? 'Physical' : stat)}
                      </td>
                      {customSet.map(item => (
                        <td
                          key={`${stat}-${item.id}`}
                          className="p-3 text-center text-white font-medium transition-colors"
                          style={{ backgroundColor: getHeatmapBg(getItemStat(item, stat), min, max, false) }}
                        >
                          {getItemStat(item, stat).toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  )})}

                  {/* Resistance Subheading */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={customSet.length + 1} className="p-2 px-3 text-[10px] uppercase font-bold text-amber-500/80 tracking-wider pl-4">
                      Resistances & Poise
                    </td>
                  </tr>

                  {resistanceStats.map(stat => {
                    const { min, max } = statRange(stat);
                    return (
                    <tr key={stat} className="hover:bg-slate-855/30">
                      <td className="p-3 text-slate-400 pl-6 bg-slate-950/20 font-semibold">
                        {stat}
                      </td>
                      {customSet.map(item => (
                        <td
                          key={`${stat}-${item.id}`}
                          className="p-3 text-center text-white font-medium transition-colors"
                          style={{ backgroundColor: getHeatmapBg(getItemStat(item, stat), min, max, false) }}
                        >
                          {getItemStat(item, stat).toFixed(0)}
                        </td>
                      ))}
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
