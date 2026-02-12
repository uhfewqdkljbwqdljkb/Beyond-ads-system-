import React from 'react';

const TableRoot = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto w-full no-scrollbar ${className}`}>
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
};

const Header = ({ children }) => (
  <thead className="bg-zinc-50 border-b border-zinc-100">
    {children}
  </thead>
);

const Body = ({ children }) => (
  <tbody className="divide-y divide-zinc-50 bg-white">
    {children}
  </tbody>
);

const Row = ({ 
  children, onClick, selected, hover = true 
}) => (
  <tr 
    onClick={onClick}
    className={`
      ${onClick ? 'cursor-pointer' : ''}
      ${hover ? 'hover:bg-zinc-50/50 transition-colors duration-150' : ''}
      ${selected ? 'bg-blue-50/50' : ''}
    `}
  >
    {children}
  </tr>
);

const HeaderCell = ({ children, width, align = 'left' }) => (
  <th 
    style={{ width }}
    className={`px-4 py-2.5 text-[11px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap text-${align}`}
  >
    {children}
  </th>
);

const Cell = ({ 
  children, className = '', align = 'left', onClick
}) => (
  <td 
    onClick={onClick}
    className={`px-4 py-3.5 text-base text-textPrimary align-middle text-${align} ${className}`}
  >
    {children}
  </td>
);

export const Table = Object.assign(TableRoot, {
  Header,
  Body,
  Row,
  HeaderCell,
  Cell
});