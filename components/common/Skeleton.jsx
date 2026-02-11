import React from 'react';

export const Skeleton = ({ className = '', circle = false }) => {
  return (
    <div 
      className={`skeleton-shimmer ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
    />
  );
};