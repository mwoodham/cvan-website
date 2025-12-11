'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  showCount?: boolean;
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onChange,
  showCount = true,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayLimit = 5;
  const displayOptions = showAll ? options : options.slice(0, displayLimit);
  const hasMore = options.length > displayLimit;

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  if (options.length === 0) return null;

  return (
    <div className="border-b border-black/10 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold mb-3"
      >
        <span>
          {label}
          {showCount && selectedValues.length > 0 && (
            <span className="ml-2 text-sm font-normal text-black/60">
              ({selectedValues.length})
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2">
          {displayOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
                className="w-4 h-4 rounded border-black/20 text-black focus:ring-black"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}

          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-black/60 hover:text-black transition-colors mt-2"
            >
              {showAll ? 'Show Less' : `Show ${options.length - displayLimit} More`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
