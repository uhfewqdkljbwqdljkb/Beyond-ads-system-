import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Card } from '../ui';

const funnelData = [
  { stage: 'Leads', count: 1240, color: '#3B82F6' },
  { stage: 'Qualified', count: 850, color: '#60A5FA' },
  { stage: 'Proposal', count: 420, color: '#93C5FD' },
  { stage: 'Negotiation', count: 180, color: '#BFDBFE' },
  { stage: 'Won', count: 95, color: '#10B981' },
];

export const FunnelChart: React.FC = () => {
  return (
    <Card title="Conversion Funnel" subtitle="Pipeline efficiency tracking">
      <div className="h-[300px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={funnelData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="stage" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#111827', fontSize: 12, fontWeight: 'bold'}} 
            />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="right" style={{fill: '#6B7280', fontSize: 12, fontWeight: 'bold'}} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
         <div className="text-center">
            <p className="text-[10px] font-black text-textMuted uppercase">Lead to Won</p>
            <p className="text-lg font-black text-emerald-600">7.6%</p>
         </div>
         <div className="text-center">
            <p className="text-[10px] font-black text-textMuted uppercase">Prop to Won</p>
            <p className="text-lg font-black text-primary">22.6%</p>
         </div>
      </div>
    </Card>
  );
};