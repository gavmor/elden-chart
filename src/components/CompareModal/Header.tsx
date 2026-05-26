import { X, Scale } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CompareModalHeader({ onClose }: Props) {
  return (
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
  );
}
