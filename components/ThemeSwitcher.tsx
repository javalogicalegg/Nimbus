import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  customColor,
  onCustomColorChange,
}) => {
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
            className={`w-6 h-6 rounded-full ${theme.color} border-2 transition-all duration-300 ${
              currentTheme === theme.id
                ? 'border-[var(--custom-accent-color,theme(colors.blue.400))] scale-110 shadow-lg shadow-[var(--custom-accent-color,theme(colors.blue.400))]/50'
                : 'border-gray-500 group-hover:border-gray-400'
            }`}
          />
          <span
            className={`group-hover:text-[var(--custom-accent-color,theme(colors.blue.400))] transition-colors ${
              currentTheme === theme.id ? 'text-[var(--custom-accent-color,theme(colors.blue.400))] font-semibold' : ''
            }`}
          >
            {theme.name}
          </span>
        </button>
      ))}

      {/* Custom Theme Option */}
      <div>
        <button
          onClick={() => onThemeChange(Theme.Custom)}
          className="flex items-center gap-3 group w-full text-left mt-2"
          aria-label="Switch to Custom theme"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              currentTheme === Theme.Custom
                ? 'border-[var(--custom-accent-color)] scale-110 shadow-lg shadow-[var(--custom-accent-color)]/50'
                : 'border-gray-500 group-hover:border-gray-400'
            }`}
             style={{ backgroundColor: currentTheme === Theme.Custom ? 'var(--custom-accent-color)' : customColor }}
          />
          <span
            className={`group-hover:text-[var(--custom-accent-color)] transition-colors ${
              currentTheme === Theme.Custom ? 'text-[var(--custom-accent-color)] font-semibold' : ''
            }`}
          >
            Custom
          </span>
        </button>

        {currentTheme === Theme.Custom && (
          <div className="mt-3 pl-9">
            <label className="relative flex items-center cursor-pointer">
              <span className="text-sm mr-2">Color:</span>
              <input
                type="color"
                value={customColor}
                onChange={(e) => onCustomColorChange(e.target.value)}
                className="w-24 h-8 p-0 border-none cursor-pointer bg-transparent"
                aria-label="Choose custom accent color"
                style={{'--webkit-appearance': 'none', appearance: 'none'} as React.CSSProperties}
              />
               <div className="w-12 h-6 rounded-md border border-gray-500 absolute right-0" style={{ backgroundColor: customColor }}></div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
