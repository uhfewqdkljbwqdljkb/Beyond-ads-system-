import React from 'react';
import { Skeleton } from './Skeleton';
import { Card } from '../ui';

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <Card padding="none" className="overflow-hidden border-none shadow-none">
      <div className="divide-y divide-border">
        {/* Header Skeleton */}
        <div className="bg-surface px-6 py-4 flex gap-4">
          {Array(cols).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Row Skeletons */}
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="px-6 py-5 flex items-center gap-4">
            <Skeleton className="h-10 w-10 shrink-0" circle />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            {Array(cols - 1).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};