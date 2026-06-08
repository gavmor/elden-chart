import { Info } from 'lucide-react';
import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';
import { DoubleSlider } from './DoubleSlider';
import { useSidebarContext } from './SidebarContext';

export default function EquipmentChartSidebar() {
  const { activeGame, debuffFilterRange, onDebuffFilterRangeChange } = useSidebarContext();

  return (
    <aside className="w-80 bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
      <SidebarSearch />
      <SidebarAxes />
      <SidebarCategories />

      {activeGame === 'deadlock' && (
        <div className="pt-4 border-t border-border-main">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Debuff Mitigation Filter (%)</label>
          </div>
          <DoubleSlider
            min={0}
            max={100}
            step={1}
            value={debuffFilterRange}
            onChange={onDebuffFilterRangeChange}
            formatValue={(val) => `${Math.round(val)}%`}
          />
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
