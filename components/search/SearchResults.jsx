import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResultItem } from './SearchResultItem';

export const SearchResults = ({ results, query, selectedIndex, onResultClick }) => {
  const sections = [
    { key: 'leads', label: 'Leads' },
    { key: 'deals', label: 'Deals' },
    { key: 'clients', label: 'Clients' },
    { key: 'invoices', label: 'Invoices' }
  ].filter(s => results[s.key] && results[s.key].length > 0);

  if (sections.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-textSecondary font-medium">No results found for <span className="font-bold text-textPrimary">"{query}"</span></p>
        <p className="text-xs text-textMuted mt-2">Try different keywords or check for spelling errors.</p>
      </div>
    );
  }

  let globalIdx = 0;

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.key} className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em]">{section.label}</h3>
            <Link to={`/${section.key}?q=${query}`} onClick={onResultClick} className="text-[10px] font-bold text-primary hover:underline">
              VIEW ALL
            </Link>
          </div>
          <div className="space-y-1">
            {results[section.key].map(item => {
              const currentIdx = globalIdx++;
              return (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  type={section.key}
                  isSelected={selectedIndex === currentIdx}
                  onClick={onResultClick}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
