import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button, Card } from '../ui';
import { GlobalSearch } from '../search/GlobalSearch';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative inline-block">
          <h1 className="text-[150px] font-black text-gray-200 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-6 rounded-full shadow-2xl ring-1 ring-black/5">
                <Search size={48} className="text-primary animate-pulse" />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-textPrimary tracking-tight uppercase">Page Not Found</h2>
          <p className="text-textSecondary text-lg max-w-md mx-auto">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="max-w-md mx-auto py-8">
           <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] mb-4">Try searching or use quick links</p>
           <GlobalSearch />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            variant="ghost" 
            leftIcon={<ArrowLeft size={18} />} 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            leftIcon={<Home size={18} />} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<HelpCircle size={18} />}
          >
            Help Center
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           {[
             { title: 'Leads', link: '/leads', icon: '👤' },
             { title: 'Deals', link: '/deals', icon: '💼' },
             { title: 'Invoices', link: '/invoices', icon: '📄' },
           ].map(item => (
             <Card 
               key={item.title} 
               onClick={() => navigate(item.link)} 
               hover 
               className="bg-white/50 backdrop-blur-sm"
               padding="sm"
             >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h4 className="font-bold text-textPrimary">{item.title}</h4>
                <p className="text-[10px] text-textMuted font-bold uppercase mt-1">Quick Access</p>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
};