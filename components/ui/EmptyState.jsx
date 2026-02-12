import React from 'react';

export const EmptyState = ({ 
  icon, title, description, action, className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}>
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-textMuted mb-6 border border-border shadow-inner">
        {React.cloneElement(icon, { size: 36 })}
      </div>
      <h3 className="text-xl font-black text-textPrimary mb-2">{title}</h3>
      <p className="text-textSecondary text-sm max-w-sm mb-8 leading-relaxed">{description}</p>
      {action && <div className="animate-in fade-in duration-700 delay-300">{action}</div>}
    </div>
  );
};