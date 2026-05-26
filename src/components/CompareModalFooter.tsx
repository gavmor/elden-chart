interface Props {
  onClose: () => void;
}

export default function CompareModalFooter({ onClose }: Props) {
  return (
    <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex justify-end">
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
