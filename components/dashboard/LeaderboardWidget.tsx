import React from 'react';
import { Card, Avatar, Badge, Select } from '../ui';
import { Trophy, Medal, Star } from 'lucide-react';

interface RepPerformance {
  name: string;
  avatar: string;
  revenue: number;
  deals: number;
}

const mockData: RepPerformance[] = [
  { name: 'Sarah Miller', avatar: 'https://picsum.photos/seed/sarah/100/100', revenue: 142000, deals: 8 },
  { name: 'James Wilson', avatar: 'https://picsum.photos/seed/james/100/100', revenue: 118000, deals: 6 },
  { name: 'Robert Chen', avatar: 'https://picsum.photos/seed/robert/100/100', revenue: 95000, deals: 5 },
  { name: 'Elena Rodriguez', avatar: 'https://picsum.photos/seed/elena/100/100', revenue: 64000, deals: 4 },
];

export const LeaderboardWidget: React.FC = () => {
  const maxRev = mockData[0].revenue;

  return (
    <Card 
      title="Team Leaderboard" 
      headerAction={<Select options={[{label: 'This Month', value: 'm'}]} value="m" onChange={() => {}} className="border-none w-32" />}
    >
      <div className="space-y-6 mt-4">
        {mockData.map((rep, idx) => (
          <div key={rep.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <Avatar name={rep.name} src={rep.avatar} size="sm" />
                   {idx < 3 && (
                     <div className={`absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center border border-white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-gray-300' : 'bg-orange-400'}`}>
                        {idx === 0 ? <Trophy size={8} className="text-white" /> : <Medal size={8} className="text-white" />}
                     </div>
                   )}
                </div>
                <div>
                   <p className="text-sm font-bold text-textPrimary leading-none">{rep.name}</p>
                   <p className="text-[10px] text-textMuted uppercase font-black mt-1">{rep.deals} Deals Won</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-sm font-black text-textPrimary">${rep.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-primary' : 'bg-primary/40'}`} 
                 style={{ width: `${(rep.revenue / maxRev) * 100}%` }}
               />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};