import React from 'react';
import { Theme } from '../types';

interface DynamicBackgroundProps {
  theme: Theme;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
  let backgroundClass = '';
  switch (theme) {
    case Theme.Dark:
      backgroundClass = 'gradient-bg-dark';
      break;
    case Theme.White:
      backgroundClass = 'gradient-bg-white';
      break;
    case Theme.Custom:
      backgroundClass = 'gradient-bg-custom';
      break;
  }

  return <div className={`fixed inset-0 -z-10 ${backgroundClass}`}></div>;
};

export default DynamicBackground;
