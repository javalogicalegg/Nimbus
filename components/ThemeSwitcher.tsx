
import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { id: Theme.Black, color: 'bg-black', name: 'Black' },
    { id: Theme.Grey, color: 'bg-slate-800', name: 'Grey' },
    { id: Theme.White, color: 'bg-white', name: 'White' },
  ];

  return (
    <div className="flex flex-col space-y-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          className="flex items-center gap-3 group w-full text-left"
          aria-label={`Switch to ${theme.name} theme`}
        >
          <div
            className={`w-6 h-6 rounded-full ${theme.color} border-2 transition-all duration-200 ${
              currentTheme === theme.id
                ? 'border-blue-400 scale-110'
                : 'border-gray-500 group-hover:border-gray-400'
            }`}
          />
          <span
            className={`group-hover:text-blue-400 transition-colors ${
              currentTheme === theme.id ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
