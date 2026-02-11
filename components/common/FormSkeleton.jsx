import React from 'react';
import { Skeleton } from './Skeleton';

export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(fields).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};