import type { EquipmentKind } from '../types';
import type { CategoryFilter } from '../domain/CategoryFilter';

interface SidebarCategoriesProps {
  categoryGroups: { kind: EquipmentKind; categories: string[] }[];
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
}

const formatKindLabel = (kind: EquipmentKind): string => {
  switch (kind) {
    case 'armor': return 'Armor';
    case 'weapon': return 'Weapons';
    case 'shield': return 'Shields';
    case 'ammo': return 'Ammunition';
    case 'deadlock_upgrade': return 'Upgrades';
    case 'deadlock_ability': return 'Abilities';
    default: return String(kind);
  }
};

export function SidebarCategories({
  categoryGroups,
  categoryFilter,
  onCategoryFilterChange,
}: SidebarCategoriesProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Categories</label>
        <div className="flex gap-1">
          <button
            onClick={() => onCategoryFilterChange(categoryFilter.withAllToggled(categoryGroups, true))}
            className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-sidebar text-text-secondary hover:text-brand-hover hover:bg-slate-700 border border-border-main transition-colors cursor-pointer"
          >
            All
          </button>
          <button
            onClick={() => onCategoryFilterChange(categoryFilter.withAllToggled(categoryGroups, false))}
            className="text-xxs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-bg-sidebar text-text-secondary hover:text-brand-danger hover:bg-slate-700 border border-border-main transition-colors cursor-pointer"
          >
            None
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {categoryGroups.map(group => (
          <div key={group.kind}>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-xxs uppercase tracking-wider font-semibold text-text-tertiary">
                {formatKindLabel(group.kind)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onCategoryFilterChange(categoryFilter.withGroupToggled(group.categories, true))}
                  className="text-tiny uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-bg-sidebar text-text-tertiary hover:text-brand-hover hover:bg-slate-700 border border-border-subtle transition-colors cursor-pointer"
                >
                  All
                </button>
                <button
                  onClick={() => onCategoryFilterChange(categoryFilter.withGroupToggled(group.categories, false))}
                  className="text-tiny uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-bg-sidebar text-text-tertiary hover:text-brand-danger hover:bg-slate-700 border border-border-subtle transition-colors cursor-pointer"
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.categories.map(cat => (
                <label
                  key={cat}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer select-none ${
                    categoryFilter.isActive(cat)
                      ? 'bg-brand-accent/15 text-brand-active border-brand-accent/40 hover:bg-brand-accent/25 hover:border-brand-accent/60'
                      : 'bg-bg-sidebar/40 text-text-secondary border-border-subtle hover:bg-bg-sidebar/80 hover:text-text-primary hover:border-border-main'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={categoryFilter.isActive(cat)}
                    onChange={(e) => onCategoryFilterChange(categoryFilter.withToggled(cat, e.target.checked))}
                    className="sr-only"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
