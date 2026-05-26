interface Props {
  onClose: () => void;
}

export default function CompareModalFooter({ onClose }: Props) {
  return (
    <div className="p-4 border-t border-accent/20 bg-panel/30 flex justify-end">
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-lg bg-panel-active hover:bg-accent/20 text-body font-semibold text-sm border border-accent/20 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
