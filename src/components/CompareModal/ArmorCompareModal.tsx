import type { ArmorItem } from '../types';
import CompareModalHeader from './Header';
import CompareModalEmptyState from './EmptyState';
import CompareModalTable from './Table';
import CompareModalFooter from './Footer';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  customSet: ArmorItem[];
}

export default function ArmorCompareModal({ isOpen, onClose, customSet }: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-panel/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-panel border border-accent/30 shadow-2xl rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CompareModalHeader onClose={onClose} />

        <div className="flex-1 overflow-auto p-6">
          {customSet.length === 0 ? (
            <CompareModalEmptyState />
          ) : (
            <CompareModalTable customSet={customSet} />
          )}
        </div>

        <CompareModalFooter onClose={onClose} />
      </div>
    </div>
  );
}
