export type GameType = 'elden-ring' | 'deadlock';

interface GameToggleProps {
  activeGame: GameType;
  onGameChange: (game: GameType) => void;
}

export default function GameToggle({ activeGame, onGameChange }: GameToggleProps) {
  return (
    <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5" role="group" aria-label="Select Game Mode">
      <button
        onClick={() => activeGame !== 'elden-ring' && onGameChange('elden-ring')}
        data-active={activeGame === 'elden-ring'}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
          activeGame === 'elden-ring'
            ? 'bg-neutral-800 text-amber-500 shadow-sm'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        Elden Ring
      </button>
      <button
        onClick={() => activeGame !== 'deadlock' && onGameChange('deadlock')}
        data-active={activeGame === 'deadlock'}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
          activeGame === 'deadlock'
            ? 'bg-neutral-800 text-sky-400 shadow-sm'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        Deadlock
      </button>
    </div>
  );
}
