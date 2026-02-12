import React from 'react';

export const Toggle = ({
  label,
  checked,
  onChange,
  disabled,
  size = 'md',
  className = '',
}) => {
  const trackSizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
  };

  const thumbSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
  };

  const translations = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-5' : 'translate-x-0.5',
  };

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`${trackSizes[size]} rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`} />
        <div 
          className={`
            absolute top-0.5 bg-white rounded-full shadow-sm transition-transform duration-200
            ${thumbSizes[size]} ${translations[size]}
          `}
        />
      </div>
      {label && <span className="text-sm font-medium text-textPrimary select-none">{label}</span>}
    </label>
  );
};