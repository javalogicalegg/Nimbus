import React, { useState, useRef, useEffect } from 'react';
import { APP_NAME, THEME_CONFIGS, CUSTOM_THEME_CONFIG, PERSONAS } from '../constants';
import { Theme, Persona } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import PersonaSwitcher from './PersonaSwitcher';
import CloudIcon from './icons/CloudIcon';
import DotsMenuIcon from './icons/DotsMenuIcon';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, customColor, onCustomColorChange, persona, onPersonaChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const themeConfig = theme === Theme.Custom 
    ? CUSTOM_THEME_CONFIG 
    : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`p-4 flex justify-between items-center border-b ${
        theme === Theme.White ? 'border-gray-200' : 'border-gray-700'
      }`}
    >
      <div className="flex items-center gap-3 animate-pulse-glow">
        <CloudIcon
          className={`w-8 h-8 ${themeConfig.accent} ${themeConfig.iconGlow} transition-all duration-300`}
        />
        <h1
          className={`text-xl font-bold ${themeConfig.accent} ${themeConfig.textGlow} transition-all duration-300`}
        >
          {APP_NAME}
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-full hover:bg-gray-500/20 transition-colors ${themeConfig.text}`}
          aria-label="Open settings menu"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <DotsMenuIcon className="w-6 h-6" />
        </button>

        {isMenuOpen && (
          <div
            className={`absolute top-full right-0 mt-2 p-4 rounded-xl shadow-lg z-10 w-56 divide-y ${
              themeConfig.card
            } ${theme === Theme.White ? 'divide-gray-200' : 'divide-gray-700'}`}
            role="menu"
          >
             <div className="pb-3">
                 <p className={`text-sm font-semibold mb-3 ${themeConfig.text}`}>
                    Persona
                </p>
                <PersonaSwitcher 
                    personas={PERSONAS}
                    currentPersona={persona}
                    onPersonaChange={(newPersona) => {
                        onPersonaChange(newPersona);
                        setIsMenuOpen(false);
                    }}
                />
             </div>
             <div className="pt-4">
                <p className={`text-sm font-semibold mb-4 ${themeConfig.text}`}>
                Appearance
                </p>
                <ThemeSwitcher
                currentTheme={theme}
                onThemeChange={(newTheme) => {
                    onThemeChange(newTheme);
                    if(newTheme !== Theme.Custom) {
                        // Keep menu open for custom color picking
                        // setIsMenuOpen(false);
                    }
                }}
                customColor={customColor}
                onCustomColorChange={onCustomColorChange}
                />
             </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
