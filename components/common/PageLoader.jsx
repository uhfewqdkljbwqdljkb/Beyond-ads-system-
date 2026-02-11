import React, { useEffect, useState } from 'react';

export const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        const next = old + Math.random() * 10;
        return next > 90 ? 90 : next;
      });
    }, 200);

    return () => {
      clearInterval(timer);
      setProgress(100);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[2000] h-1 bg-surface">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};