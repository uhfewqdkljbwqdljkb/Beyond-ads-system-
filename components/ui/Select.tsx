
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Option {
  label: string;
  value: any;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  error,
  disabled,
  required,
  multiple,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = (options || []).filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optValue: any) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optValue)) {
        onChange(currentValues.filter(v => v !== optValue));
      } else {
        onChange([...currentValues, optValue]);
      }
    } else {
      onChange(optValue);
      setIsOpen(false);
    }
  };

  const selectedLabels = Array.isArray(value) 
    ? (options || []).filter(o => value.includes(o.value)).map(o => o.label)
    : [(options || []).find(o => o.value === value)?.label].filter(Boolean);

  return (
    <div className={`flex flex-col gap-1.5 w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-textPrimary flex gap-1">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between border rounded-md text-sm py-2 px-3 cursor-pointer transition-all
          ${disabled ? 'bg-surface text-textMuted cursor-not-allowed' : 'bg-white text-textPrimary'}
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : error ? 'border-error' : 'border-border'}
        `}
      >
        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((l, i) => (
              <span key={i} className={multiple ? 'bg-primary-light text-primary text-xs px-2 py-0.5 rounded flex items-center' : ''}>
                {l}
                {multiple && (
                  <X 
                    size={12} 
                    className="ml-1 cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); toggleOption((options || []).find(o => o.label === l)?.value || ''); }} 
                  />
                )}
              </span>
            ))
          ) : (
            <span className="text-textMuted">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-textMuted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1">
          <div className="p-2 border-b border-border bg-surface">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-white border border-border rounded-md pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = Array.isArray(value) ? value.includes(opt.value) : value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); toggleOption(opt.value); }}
                    className={`
                      px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                      ${isSelected ? 'bg-primary-light text-primary' : 'hover:bg-surface'}
                    `}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-textMuted italic">No options found</div>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
};
