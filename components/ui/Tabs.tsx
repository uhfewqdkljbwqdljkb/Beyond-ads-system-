
import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

const TabsRoot: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const List: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center border-b border-border space-x-6 px-1 ${className}`}>
    {children}
  </div>
);

const Tab: React.FC<{ value: string; children: React.ReactNode; disabled?: boolean }> = ({ value, children, disabled }) => {
  const context = useContext(TabsContext);
  if (!context) return null;
  const isActive = context.value === value;

  return (
    <button
      disabled={disabled}
      onClick={() => context.onChange(value)}
      className={`
        py-3 text-sm font-medium transition-all relative border-b-2
        ${disabled ? 'opacity-50 cursor-not-allowed text-textMuted' : 'cursor-pointer'}
        ${isActive ? 'text-primary border-primary' : 'text-textSecondary border-transparent hover:text-textPrimary hover:border-border'}
      `}
    >
      {children}
    </button>
  );
};

const Panels: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;

const Panel: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const context = useContext(TabsContext);
  if (!context || context.value !== value) return null;
  return <div className="py-4 animate-in fade-in duration-300">{children}</div>;
};

export const Tabs = Object.assign(TabsRoot, {
  List,
  Tab,
  Panels,
  Panel
});
