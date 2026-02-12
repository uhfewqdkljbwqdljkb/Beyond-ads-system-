
import React, { useState } from 'react';
import { 
  Briefcase, Plus, Filter, Search, MoreHorizontal, 
  ExternalLink, Clock, DollarSign, Calendar, ChevronRight 
} from 'lucide-react';
import { 
  Card, Button, Badge, Table, Avatar, 
  Spinner, EmptyState, Dropdown 
} from '../../components/ui';
import { useNavigate } from 'react-router-dom';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  // Mock Data
  const projects = [
    { id: '1', name: 'Q4 Performance Marketing', client: 'Aura Media', status: 'active', type: 'retainer', budget: 12000, start: '2024-01-01', end: '2024-12-31' },
    { id: '2', name: 'Identity Rebrand', client: 'Nebula Labs', status: 'planning', type: 'project', budget: 25000, start: '2024-03-15', end: '2024-05-15' },
    { id: '3', name: 'E-commerce Overhaul', client: 'Zenith Retail', status: 'completed', type: 'project', budget: 45000, start: '2023-10-01', end: '2024-02-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Project Delivery</h1>
          <p className="text-sm text-textSecondary">Track ongoing client engagements and deliverables</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Initiate Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm" className="bg-blue-50/50 border-blue-100">
           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Deliverables</p>
           <h3 className="text-2xl font-black text-textPrimary mt-1">14</h3>
        </Card>
        <Card padding="sm" className="bg-emerald-50/50 border-emerald-100">
           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Revenue at Risk</p>
           <h3 className="text-2xl font-black text-textPrimary mt-1">$142,000</h3>
        </Card>
        <Card padding="sm" className="bg-purple-50/50 border-purple-100">
           <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Utilization</p>
           <h3 className="text-2xl font-black text-textPrimary mt-1">92%</h3>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
         <Table>
            <Table.Header>
               <Table.Row hover={false}>
                  <Table.HeaderCell>Project Name</Table.HeaderCell>
                  <Table.HeaderCell>Client</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Budget</Table.HeaderCell>
                  <Table.HeaderCell>Timeline</Table.HeaderCell>
                  <Table.HeaderCell align="right"></Table.HeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {projects.map(p => (
                 <Table.Row key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
                    <Table.Cell className="font-bold text-textPrimary">{p.name}</Table.Cell>
                    <Table.Cell className="text-textSecondary font-medium">{p.client}</Table.Cell>
                    <Table.Cell>
                       <Badge variant={p.status === 'active' ? 'success' : p.status === 'planning' ? 'primary' : 'default'} size="sm" dot>{p.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                       <Badge variant="default" size="sm" className="uppercase text-[9px] tracking-widest font-black">{p.type}</Badge>
                    </Table.Cell>
                    <Table.Cell className="font-bold">${p.budget.toLocaleString()}</Table.Cell>
                    <Table.Cell className="text-xs text-textSecondary">{p.start} → {p.end}</Table.Cell>
                    <Table.Cell align="right">
                       <ChevronRight size={16} className="text-zinc-300" />
                    </Table.Cell>
                 </Table.Row>
               ))}
            </Table.Body>
         </Table>
      </Card>
    </div>
  );
};

export default ProjectsPage;
