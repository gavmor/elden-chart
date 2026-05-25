
import { ShieldAlert } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  itemCount: number;
}

export default function ArmorChartHeader({ loading, itemCount }: HeaderProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between z-10 shadow-md">
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-amber-500 w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Elden Ring Armor Chart</h1>
          <p className="text-xs text-slate-400">Interactive equipment visualizer</p>
        </div>
      </div>
      <div className="text-sm text-slate-400">
        {loading ? 'Fetching library...' : `${itemCount} items plotted`}
      </div>
    </header>
  );
}
