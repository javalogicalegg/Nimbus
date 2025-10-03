import React from 'react';
import CloudIcon from './icons/CloudIcon';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex justify-center items-center animate-fade-in">
      <div className="animate-pulse-glow">
        <CloudIcon className="w-32 h-32 text-white" outline />
      </div>
    </div>
  );
};

export default SplashScreen;
