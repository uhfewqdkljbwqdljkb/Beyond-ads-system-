import React from 'react';
import { Spinner } from './Spinner.jsx';

export const Button = ({
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed rounded-md select-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-blue-800 border-none',
    secondary: 'text-textSecondary hover:bg-surface active:bg-zinc-200 border-none',
    subtle: 'bg-surface text-textSecondary hover:bg-zinc-200 active:bg-zinc-300 border-none',
    danger: 'text-error hover:bg-red-50 active:bg-red-100 border-none',
    ghost: 'text-textMuted hover:text-textPrimary hover:bg-surface border-none',
    icon: 'p-1.5 text-textMuted hover:bg-surface hover:text-textPrimary border-none'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-md',
    lg: 'px-5 py-2.5 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Spinner size="sm" className="mr-1" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};