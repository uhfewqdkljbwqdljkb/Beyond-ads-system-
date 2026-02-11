
import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  placeholder,
  className = '',
  required,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-textPrimary flex gap-1">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary pointer-events-none transition-colors">
          <Calendar size={18} />
        </div>
        <input
          type="date"
          value={value}
          min={minDate}
          max={maxDate}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-md border text-sm transition-all outline-none py-2 pl-10 pr-3
            ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border focus:ring-primary/20 focus:border-primary'}
            bg-white text-textPrimary appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer
          `}
        />
        {/* Helper to show formatted date as native input can be inconsistent */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-textSecondary pointer-events-none">
          {value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
        </div>
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
};
