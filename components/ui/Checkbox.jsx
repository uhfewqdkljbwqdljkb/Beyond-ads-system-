import React from 'react';
import { Check, Minus } from 'lucide-react';

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  indeterminate,
  className = '',
}) => {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div 
          className={`
            w-5 h-5 rounded border transition-all flex items-center justify-center
            ${(checked || indeterminate) ? 'bg-primary border-primary' : 'bg-white border-border group-hover:border-primary'}
          `}
        >
          {indeterminate ? (
            <Minus size={14} className="text-white" strokeWidth={3} />
          ) : checked ? (
            <Check size={14} className="text-white animate-in zoom-in-50 duration-200" strokeWidth={3} />
          ) : null}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-textPrimary select-none">{label}</span>}
    </label>
  );
};