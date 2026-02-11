
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  onClear,
  debounceMs = 300,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(externalValue);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setInternalValue(externalValue);
  }, [externalValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInternalValue(newVal);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    
    debounceRef.current = window.setTimeout(() => {
      onChange(newVal);
    }, debounceMs);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInputChange}
        className="w-full bg-white border border-border rounded-md pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
