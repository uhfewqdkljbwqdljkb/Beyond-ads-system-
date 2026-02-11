import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-zinc-700">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full rounded-md border text-base transition-all outline-none py-2
            ${leftIcon ? 'pl-9' : 'pl-3'} pr-3
            ${error ? 'border-error focus:ring-1 focus:ring-error' : 'border-zinc-200 focus:border-primary focus:ring-1 focus:ring-blue-500/10'}
            bg-white text-textPrimary placeholder:text-zinc-400 disabled:bg-zinc-50 disabled:text-textMuted
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-error font-medium">{error}</p>}
    </div>
  );
};