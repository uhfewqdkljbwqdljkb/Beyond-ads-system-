import React from 'react';
import { Spinner } from '../ui/Spinner';
import { ActivityItem } from './ActivityItem';

interface ActivityTimelineProps {
  activities: any[];
  isLoading?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return <div className="py-12 flex justify-center"><Spinner /></div>;
  }

  if (!activities || activities.length === 0) {
    return <div className="py-12 text-center text-textMuted">No activity logged yet.</div>;
  }

  return (
    <div className="relative pl-6 py-4 space-y-8 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-px before:bg-border">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};