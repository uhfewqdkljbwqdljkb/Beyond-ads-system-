import React from 'react';
import { Skeleton } from './Skeleton';
import { Card } from '../ui';

export const CardSkeleton = ({ type = 'info' }) => {
  if (type === 'stat') {
    return (
      <Card padding="md" className="border-none ring-1 ring-border shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </Card>
    );
  }

  if (type === 'list') {
    return (
      <Card title={<Skeleton className="h-5 w-32" />} headerAction={<Skeleton className="h-4 w-12" />}>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 shrink-0" circle />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-16 w-16" circle />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="space-y-3 pt-6 border-t border-border">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </Card>
  );
};