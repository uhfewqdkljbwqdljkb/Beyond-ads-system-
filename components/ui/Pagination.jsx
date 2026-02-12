import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './Button.jsx';

export const Pagination = ({ 
  currentPage, totalPages, onPageChange, siblingsCount = 1 
}) => {
  const generatePages = () => {
    const pages = [];
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    if (leftSiblingIndex > 1) {
      pages.push(1);
      if (leftSiblingIndex > 2) pages.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    if (rightSiblingIndex < totalPages) {
      if (rightSiblingIndex < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
      >
        <ChevronsLeft size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </Button>

      {generatePages().map((page, i) => (
        <React.Fragment key={i}>
          {page === '...' ? (
            <span className="px-3 text-textMuted select-none">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(Number(page))}
              className="w-9 h-9"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
      >
        <ChevronsRight size={16} />
      </Button>
    </div>
  );
};