import { Shield } from 'lucide-react';

export default function CompareModalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted text-center gap-3">
      <Shield className="w-12 h-12 text-accent/30" />
      <p className="text-sm">Your build set is empty. Click points on the plot to add armor pieces.</p>
    </div>
  );
}
