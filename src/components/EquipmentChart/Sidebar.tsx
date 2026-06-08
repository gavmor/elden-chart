import { Info } from 'lucide-react';
import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';
import { SidebarEhpCurve } from './SidebarEhpCurve';
import { useSidebarContext } from './SidebarContext';
import { DoubleSlider } from './DoubleSlider';

export default function EquipmentChartSidebar() {
  const {
    activeGame,
    selectedHero,
    onHeroChange,
    enemyAttacker,
    onEnemyAttackerChange,
    engagementDistance,
    onEngagementDistanceChange,
    debuffFilterRange,
    onDebuffFilterRangeChange,
  } = useSidebarContext();

  return (
    <aside className="w-80 bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
      <SidebarSearch />
      
      <SidebarAxes />

      <SidebarCategories />



      
      {activeGame === 'deadlock' && (
        <SidebarEhpCurve />
      )}

      {activeGame === 'deadlock' && (
        <div className="space-y-4 pt-4 border-t border-border-main">
          <label className="block text-xs font-semibold text-brand-accent uppercase tracking-wider">Deadlock Configuration</label>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Hero Selection</label>
            <select
              value={selectedHero || ''}
              onChange={(e) => onHeroChange(e.target.value || null)}
              className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent"
            >
              <option value="">None / Base Stats</option>
              <option value="Paradox">Paradox</option>
              <option value="Lash">Lash</option>
              <option value="Seven">Seven</option>
              <option value="Haze">Haze</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Enemy Attacker (Incoming EHP Damage)</label>
            <select
              value={enemyAttacker || ''}
              onChange={(e) => onEnemyAttackerChange(e.target.value || null)}
              className="w-full bg-bg-card border border-border-main rounded-btn p-2 text-sm focus:outline-none focus:border-brand-accent animate-in fade-in"
              id="enemy-attacker-selector"
            >
              <option value="">Default (15 Damage)</option>
              <option value="Victor">Victor (25 Damage)</option>
              <option value="Holliday">Holliday (18 Damage)</option>
              <option value="Paradox">Paradox (12 Damage)</option>
              <option value="Lash">Lash (11 Damage)</option>
              <option value="Seven">Seven (10 Damage)</option>
              <option value="Infernus">Infernus (10 Damage)</option>
              <option value="Haze">Haze (6 Damage)</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Engagement Distance</label>
              <span className="text-xs text-brand-accent font-medium">{engagementDistance}m</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={engagementDistance}
              onChange={(e) => onEngagementDistanceChange(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </div>
          <div className="pt-2">
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
