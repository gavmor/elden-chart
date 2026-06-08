import { Info } from 'lucide-react';
import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';
import { DoubleSlider } from './DoubleSlider';
import { useSidebarContext } from './SidebarContext';

export default function EquipmentChartSidebar() {
  const { activeGame, statGroups, metricFilters, metricBounds, onMetricFilterChange } = useSidebarContext();

  return (
    <aside className="w-80 bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
      <SidebarSearch />
      <SidebarAxes />
      <SidebarCategories />

      {activeGame === 'deadlock' && statGroups['Calculated Metrics'] && statGroups['Calculated Metrics'].length > 0 && (
        <div className="pt-4 border-t border-border-main flex flex-col gap-5">
          {statGroups['Calculated Metrics'].map(metric => {
            const bounds = metricBounds[metric.id] || [0, 100];
            const currentRange = metricFilters[metric.id] || bounds;
            const range = bounds[1] - bounds[0];
            const step = range > 1000 ? 10 
                       : range > 100 ? 1 
                       : range > 10 ? 0.1 
                       : range > 1 ? 0.01 
                       : range > 0.1 ? 0.001 
                       : range > 0.01 ? 0.0001
                       : 0.00001;
            
            const formatValue = (val: number) => {
              if (val === 0) return '0';
              if (range > 10) return Math.round(val).toString();
              if (range > 1) return val.toFixed(1);
              if (range > 0.1) return val.toFixed(2);
              if (range > 0.01) return val.toFixed(3);
              return val.toFixed(4);
            };

            return (
              <div key={metric.id}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">{metric.label}</label>
                </div>
                <DoubleSlider
                  min={bounds[0]}
                  max={bounds[1]}
                  step={step}
                  value={currentRange}
                  onChange={(val) => onMetricFilterChange(metric.id, val)}
                  formatValue={formatValue}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-auto bg-bg-card/50 rounded-card p-4 border border-border-subtle">
        <h3 className="text-sm font-medium text-brand-accent flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Usage Tips
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Hover over items for details.<br/><br/>
          <strong>Icons</strong> represent equipment type.<br/>
          <strong>Auras</strong> represent color theme stats.
        </p>
      </div>
    </aside>
  );
}
