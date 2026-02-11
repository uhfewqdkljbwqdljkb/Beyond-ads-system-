import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { Button, Card, EmptyState } from '../ui';

export const EntityNotFound = ({ 
  entityName = 'Record', 
  backLink = '/dashboard', 
  backLabel = 'Dashboard',
  createLink 
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-20 animate-in fade-in duration-500">
      <Card className="max-w-2xl mx-auto border-none shadow-xl ring-1 ring-black/5 overflow-hidden" padding="none">
        <div className="h-2 bg-warning" />
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-amber-50 text-warning rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          
          <h2 className="text-2xl font-black text-textPrimary tracking-tight">{entityName} Not Found</h2>
          <p className="text-textSecondary mt-3 mb-8 max-w-sm mx-auto">
            The requested {entityName.toLowerCase()} could not be located. It may have been deleted, reassigned, or you may have entered an incorrect ID.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              variant="outline" 
              leftIcon={<ArrowLeft size={18} />} 
              onClick={() => navigate(backLink)}
            >
              Back to {backLabel}
            </Button>
            {createLink && (
              <Button 
                leftIcon={<Plus size={18} />} 
                onClick={() => navigate(createLink)}
              >
                Create New {entityName}
              </Button>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
             <p className="text-xs text-textMuted">
               Still having issues? <a href="#" className="text-primary font-bold hover:underline">Contact your administrator</a> or search using the command palette (Ctrl+K).
             </p>
          </div>
        </div>
      </Card>
    </div>
  );
};