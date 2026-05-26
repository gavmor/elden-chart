import { Shield } from 'lucide-react';

export default function CompareModalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center gap-3">
      <Shield className="w-12 h-12 text-slate-700" />
      <p className="text-sm">Your build set is empty. Click points on the plot to add armor pieces.</p>
    </div>
  );
}
