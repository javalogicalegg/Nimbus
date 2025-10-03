import React, { useState } from 'react';
import { Theme } from '../types';
import { APP_NAME, THEME_CONFIGS, CUSTOM_THEME_CONFIG } from '../constants';
import CloudIcon from './icons/CloudIcon';
import DynamicBackground from './DynamicBackground';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  theme: Theme;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, theme }) => {
  const [name, setName] = useState('');
  const { t } = useLanguage();
  
  const themeConfig = theme === Theme.Custom 
    ? CUSTOM_THEME_CONFIG 
    : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  let buttonBgClass = 'bg-gray-800';
  if (theme === Theme.White) buttonBgClass = 'bg-indigo-500';
  if (theme === Theme.Custom) buttonBgClass = 'bg-[var(--custom-accent-color)]';


  return (
    <div className={`fixed inset-0 flex justify-center items-center p-4 animate-fade-in ${themeConfig.text}`}>
      <DynamicBackground theme={theme} />
      <div className="w-full max-w-sm text-center">
        <div className={`flex justify-center items-center gap-3 mb-8 animate-pulse-glow`}>
            <CloudIcon
                className={`w-12 h-12 ${themeConfig.accent} ${themeConfig.iconGlow}`}
            />
            <h1
                className={`text-4xl font-bold ${themeConfig.accent} ${themeConfig.textGlow}`}
            >
                {APP_NAME}
            </h1>
        </div>

        <h2 className="text-2xl font-semibold mb-2">{t('welcome')}</h2>
        <p className="opacity-80 mb-8">{t('enterNamePrompt')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name-input" className="sr-only">{t('yourNamePlaceholder')}</label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('yourNamePlaceholder')}
              className={`w-full px-4 py-3 text-lg rounded-xl border-2 focus:outline-none focus:ring-1 transition-all duration-300 ${
                theme === Theme.White
                    ? 'bg-white border-gray-300 text-gray-900'
                    : 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
              } ${themeConfig.inputFocus}`}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-3 px-4 text-lg font-semibold rounded-xl transition-all duration-300 text-white disabled:shadow-none disabled:bg-gray-600 disabled:cursor-not-allowed ${
                !name.trim() ? '' : `${buttonBgClass} hover:opacity-90 active:scale-95 shadow-lg shadow-[var(--custom-accent-color,theme(colors.gray.800))]/30`
            }`}
          >
            {t('continue')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
