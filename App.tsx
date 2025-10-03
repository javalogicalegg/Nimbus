import React, { useState, useEffect } from 'react';
import { Theme, AppMode } from './types';
import { THEME_CONFIGS, CUSTOM_THEME_CONFIG, DEFAULT_CUSTOM_COLOR } from './constants';
import Header from './components/Header';
import ChatView from './components/ChatView';
import ComposerView from './components/ComposerView';
import SandboxView from './components/SandboxView';
import DynamicBackground from './components/DynamicBackground';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import { LanguageProvider } from './contexts/LanguageContext';

type AppState = 'loading' | 'login' | 'main';

const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | 'black' | 'grey';
    if (savedTheme === 'black' || savedTheme === 'grey') return Theme.Dark;
    return savedTheme || Theme.Dark;
  });
  const [customColor, setCustomColor] = useState<string>(() => localStorage.getItem('customColor') || DEFAULT_CUSTOM_COLOR);
  const [mode, setMode] = useState<AppMode>('chat');
  const [appState, setAppState] = useState<AppState>('loading');
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('customColor', customColor);
    if (theme === Theme.Custom) {
      document.documentElement.style.setProperty('--custom-accent-color', customColor);
    } else {
        document.documentElement.style.removeProperty('--custom-accent-color');
    }
  }, [customColor, theme]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
            setAppState('main');
        } else {
            setAppState('login');
        }
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setAppState('main');
  };

  if (appState === 'loading') {
    return <SplashScreen />;
  }

  if (appState === 'login') {
    return <LoginScreen onLogin={handleLogin} theme={theme} />;
  }

  const renderView = () => {
    switch (mode) {
      case 'composer':
        return <ComposerView theme={theme} />;
      case 'sandbox':
        return <SandboxView theme={theme} userName={userName!} />;
      case 'chat':
      default:
        return <ChatView theme={theme} userName={userName!} />;
    }
  };

  const themeConfig = theme === Theme.Custom 
    ? CUSTOM_THEME_CONFIG 
    : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  const appStyle = theme === Theme.Custom ? { '--custom-accent-color': customColor } as React.CSSProperties : {};

  return (
    <div 
        className={`flex flex-col h-screen ${themeConfig.text} transition-colors duration-300`}
        style={appStyle}
    >
      <DynamicBackground theme={theme} />
      <Header 
        theme={theme} 
        onThemeChange={setTheme} 
        customColor={customColor}
        onCustomColorChange={setCustomColor}
        mode={mode}
        onModeChange={setMode}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}


export default App;
