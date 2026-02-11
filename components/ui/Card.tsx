import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
  footer,
  padding = 'md',
  hover = false,
  elevated = false,
  onClick
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-xl transition-all duration-150 ease-out flex flex-col
        ${elevated ? 'border border-border shadow-sm' : 'border border-zinc-100'}
        ${hover ? 'hover:shadow-xs cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-4 py-3 border-b border-zinc-50 flex justify-between items-center bg-white rounded-t-xl">
          <div>
            {title && <h3 className="text-sm font-semibold text-textPrimary leading-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-textMuted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      <div className={`flex-1 ${paddings[padding]}`}>{children}</div>
      {footer && (
        <div className="px-4 py-3 bg-surface border-t border-zinc-50 mt-auto rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};