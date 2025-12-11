'use client';

import { X } from 'lucide-react';

export interface ActiveFilter {
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
  resultCount: number;
}

export function ActiveFilters({ filters, onClearAll, resultCount }: ActiveFiltersProps) {
  if (filters.length === 0) {
    return (
      <div className="text-sm text-black/60">
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-black/60">Active filters:</span>
      {filters.map((filter, index) => (
        <button
          key={`${filter.label}-${filter.value}-${index}`}
          onClick={filter.onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-sm hover:bg-black/80 transition-colors"
        >
          <span>{filter.label}: {filter.value}</span>
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-black/60 hover:text-black underline transition-colors"
      >
        Clear all
      </button>
      <span className="text-sm text-black/60 ml-auto">
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </span>
    </div>
  );
}
