import React, { useState, useRef, useEffect } from 'react';
import { APP_NAME, THEME_CONFIGS, CUSTOM_THEME_CONFIG } from '../constants';
import { Theme, AppMode } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import CloudIcon from './icons/CloudIcon';
import DotsMenuIcon from './icons/DotsMenuIcon';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  theme: Theme;
}> = ({ onClick, isActive, children, theme }) => {
  const themeConfig =
    theme === Theme.Custom
      ? CUSTOM_THEME_CONFIG
      : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
        isActive ? themeConfig.accent : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 rounded-full ${
            theme === Theme.Custom
              ? 'bg-[var(--custom-accent-color)]'
              : theme === Theme.White
              ? 'bg-indigo-500'
              : 'bg-white'
          } ${themeConfig.iconGlow}`}
        ></span>
      )}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, customColor, onCustomColorChange, mode, onModeChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
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
      className={`sticky top-0 z-20 p-4 flex justify-between items-center ${
        theme === Theme.White ? 'bg-white/80' : 'bg-black/50'
      } backdrop-blur-sm`}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
        theme === Theme.White ? 'from-transparent via-gray-200 to-transparent' : 'from-transparent via-gray-700 to-transparent'
      }`} />
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
      
      <div className="flex items-center gap-2">
          <NavButton onClick={() => onModeChange('chat')} isActive={mode === 'chat'} theme={theme}>{t('chat')}</NavButton>
          <NavButton onClick={() => onModeChange('composer')} isActive={mode === 'composer'} theme={theme}>{t('composer')}</NavButton>
          <NavButton onClick={() => onModeChange('sandbox')} isActive={mode === 'sandbox'} theme={theme}>{t('sandbox')}</NavButton>
      </div>


      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-full hover:bg-gray-500/20 transition-colors ${themeConfig.text}`}
          aria-label={t('settingsMenu')}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <DotsMenuIcon className="w-6 h-6" />
        </button>

        {isMenuOpen && (
          <div
            className={`absolute top-full right-0 mt-2 p-4 rounded-xl shadow-lg z-10 w-56 ${
              themeConfig.card
            }`}
            role="menu"
          >
             <div className="space-y-6">
                <div>
                  <p className={`text-sm font-semibold mb-4 ${themeConfig.text}`}>
                  {t('appearance')}
                  </p>
                  <ThemeSwitcher
                  currentTheme={theme}
                  onThemeChange={onThemeChange}
                  customColor={customColor}
                  onCustomColorChange={onCustomColorChange}
                  />
                </div>
                <div>
                   <p className={`text-sm font-semibold mb-4 ${themeConfig.text}`}>
                    {t('language')}
                   </p>
                   <LanguageSwitcher />
                </div>
             </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
