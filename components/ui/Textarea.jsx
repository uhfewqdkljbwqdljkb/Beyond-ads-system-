import React from 'react';

export const Textarea = ({
  label,
  error,
  showCount,
  maxLength,
  value,
  className = '',
  required,
  id,
  ...props
}) => {
  const inputId = id || `textarea-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  const count = String(value || '').length;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-textPrimary flex gap-1">
            {label}
            {required && <span className="text-error">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className={`text-[10px] ${count >= maxLength ? 'text-error' : 'text-textMuted'}`}>
            {count}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={inputId}
        maxLength={maxLength}
        value={value}
        className={`
          w-full rounded-md border text-sm transition-all outline-none py-2 px-3 resize-none
          ${error 
            ? 'border-error focus:ring-error/20 focus:border-error' 
            : 'border-border focus:ring-primary/20 focus:border-primary'
          }
          bg-white text-textPrimary placeholder:text-textMuted disabled:bg-surface disabled:text-textMuted
        `}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
};