import { X, Scale } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CompareModalHeader({ onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-accent/20 bg-panel/50">
      <div>
        <h3 className="text-lg font-bold text-body flex items-center gap-2">
          <Scale className="w-5 h-5 text-accent" /> Equipment Set Comparison
        </h3>
        <p className="text-xs text-muted mt-0.5">Compare stats across your selected build items side-by-side</p>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg bg-panel-active hover:bg-worse/20 hover:text-worse flex items-center justify-center border border-accent/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
