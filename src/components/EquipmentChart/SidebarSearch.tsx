import { Search } from 'lucide-react';

interface SidebarSearchProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export function SidebarSearch({ search, onSearchChange }: SidebarSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <input
        type="text"
        placeholder="Search equipment..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-bg-card border border-border-main rounded-btn pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
      />
    </div>
  );
}
