
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button, EmptyState } from '../components/ui';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <EmptyState
        icon={<Search size={48} />}
        title="404 - Page Not Found"
        description="The page you are looking for might have been moved, renamed, or is temporarily unavailable."
        action={
          <Button 
            leftIcon={<Home size={18} />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
