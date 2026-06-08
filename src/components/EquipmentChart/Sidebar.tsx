import { SidebarSearch } from './SidebarSearch';
import { SidebarAxes } from './SidebarAxes';
import { SidebarCategories } from './SidebarCategories';

export default function EquipmentChartSidebar() {
  return (
    <aside className="w-80 bg-bg-sidebar/50 border-r border-border-main p-5 flex flex-col gap-6 overflow-y-auto">
      <SidebarSearch />
      <SidebarAxes />
      <SidebarCategories />
    </aside>
  );
}
