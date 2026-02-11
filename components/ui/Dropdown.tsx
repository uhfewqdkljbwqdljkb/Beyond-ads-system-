
import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

const DropdownRoot: React.FC<DropdownProps> = ({ trigger, children, align = 'left', width = '200px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div 
          style={{ width }}
          className={`
            absolute top-full mt-2 bg-white border border-border rounded-lg shadow-lg z-[60] overflow-hidden
            animate-in fade-in zoom-in-95 duration-150 origin-top
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const Item: React.FC<{ children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; danger?: boolean }> = ({ 
  children, onClick, icon, danger 
}) => (
  <button
    onClick={onClick}
    className={`
      w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface transition-colors
      ${danger ? 'text-error' : 'text-textPrimary'}
    `}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span className="truncate">{children}</span>
  </button>
);

const Divider: React.FC = () => <div className="h-px bg-border my-1" />;

export const Dropdown = Object.assign(DropdownRoot, {
  Item,
  Divider
});
