import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false
}) => {
  const variants = {
    default: 'bg-zinc-100 text-textSecondary',
    primary: 'bg-blue-50 text-blue-600',
    blue: 'bg-blue-50 text-blue-600',
    success: 'bg-emerald-50 text-emerald-600',
    green: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    yellow: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-violet-50 text-violet-600',
  };

  const dotColors = {
    default: 'bg-textMuted',
    primary: 'bg-blue-600',
    blue: 'bg-blue-600',
    success: 'bg-emerald-600',
    green: 'bg-emerald-600',
    warning: 'bg-amber-600',
    yellow: 'bg-amber-600',
    error: 'bg-red-600',
    red: 'bg-red-600',
    purple: 'bg-violet-600',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-[11px]',
  };

  return (
    <span className={`inline-flex items-center rounded font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1 h-1 rounded-full mr-1.5 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};