import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

export const NotificationBell = () => {
  const { data: count = 0 } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [prevCount, setPrevCount] = useState(count);
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    if (count > prevCount) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2.5 rounded-full transition-all relative
          ${isOpen ? 'bg-primary-light text-primary' : 'text-textSecondary hover:bg-surface'}
        `}
      >
        <Bell size={20} className={shouldPulse ? 'animate-bounce' : ''} />
        
        {count > 0 && (
          <span className={`
            absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-error rounded-full border-2 border-white 
            text-[9px] font-black text-white flex items-center justify-center
            ${shouldPulse ? 'animate-ping' : ''}
          `}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};