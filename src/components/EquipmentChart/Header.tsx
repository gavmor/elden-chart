import { ShieldAlert } from 'lucide-react';
import GameToggle, { type GameType } from './GameToggle';

interface HeaderProps {
  loading: boolean;
  itemCount: number;
  activeGame: GameType;
  onGameChange: (game: GameType) => void;
}

export default function EquipmentChartHeader({ loading, itemCount, activeGame, onGameChange }: HeaderProps) {
  return (
    <header className="bg-bg-header border-b border-border-main p-4 flex items-center justify-between z-10 shadow-md">
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-brand-accent w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold text-text-bright tracking-wide">
            {activeGame === 'elden-ring' ? 'Elden Ring Equipment Chart' : 'Deadlock Items Chart'}
          </h1>
          <p className="text-xs text-text-secondary">Interactive equipment visualizer</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <GameToggle activeGame={activeGame} onGameChange={onGameChange} />
        <div className="text-sm text-text-secondary">
          {loading ? 'Fetching library...' : `${itemCount} items plotted`}
        </div>
      </div>
    </header>
  );
}
