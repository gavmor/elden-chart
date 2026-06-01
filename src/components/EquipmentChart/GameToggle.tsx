export type GameType = 'elden-ring' | 'deadlock';

interface GameToggleProps {
  activeGame: GameType;
  onGameChange: (game: GameType) => void;
}

export default function GameToggle({ activeGame, onGameChange }: GameToggleProps) {
  return (
    <div className="flex bg-bg-card-dark border border-border-main rounded-btn p-0.5" role="group" aria-label="Select Game Mode">
      <button
        onClick={() => activeGame !== 'elden-ring' && onGameChange('elden-ring')}
        data-active={activeGame === 'elden-ring'}
        className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-all cursor-pointer ${
          activeGame === 'elden-ring'
            ? 'bg-bg-sidebar text-brand-accent shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        Elden Ring
      </button>
      <button
        onClick={() => activeGame !== 'deadlock' && onGameChange('deadlock')}
        data-active={activeGame === 'deadlock'}
        className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-all cursor-pointer ${
          activeGame === 'deadlock'
            ? 'bg-bg-sidebar text-brand-sky shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        Deadlock
      </button>
    </div>
  );
}
