
import React, { useState, useEffect } from 'react';
import { Theme, ChatMessage, Persona } from './types';
import { THEME_CONFIGS, INITIAL_MESSAGE, CUSTOM_THEME_CONFIG, DEFAULT_CUSTOM_COLOR, PERSONAS } from './constants';
import { generateTextStream, generateImage } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import PromptInput from './components/PromptInput';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | 'black' | 'grey';
    if (savedTheme === 'black' || savedTheme === 'grey') return Theme.Dark;
    return savedTheme || Theme.Dark;
  });
  const [customColor, setCustomColor] = useState<string>(() => localStorage.getItem('customColor') || DEFAULT_CUSTOM_COLOR);
  const [persona, setPersona] = useState<Persona>(() => {
      const savedPersonaId = localStorage.getItem('personaId');
      return PERSONAS.find(p => p.id === savedPersonaId) || PERSONAS[0];
  });
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    localStorage.setItem('personaId', persona.id);
  }, [persona]);

  const handleSendMessage = async (prompt: string, image?: { data: string; mimeType: string }) => {
    setIsLoading(true);

    // Create a data URL from the raw base64 data for local display
    const imageUrlForMessage = image ? `data:${image.mimeType};base64,${image.data}` : undefined;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      content: prompt,
      imageUrl: imageUrlForMessage,
    };
    
    const isImagePrompt = prompt.toLowerCase().startsWith('/imagine ');

    if (isImagePrompt) {
      const loadingMessageId = crypto.randomUUID();
      const loadingMessage: ChatMessage = {
        id: loadingMessageId,
        role: 'assistant',
        type: 'loading',
        content: 'Generating image...',
      };
      setMessages((prev) => [...prev, userMessage, loadingMessage]);

      try {
        const imagePrompt = prompt.substring('/imagine '.length).trim();
        const imageUrl = await generateImage(imagePrompt);
        const assistantResponse: ChatMessage = {
          id: loadingMessageId,
          role: 'assistant',
          type: 'image',
          content: imageUrl,
        };
        setMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMessageId ? assistantResponse : msg))
        );
      } catch (error) {
        console.error(error);
        const errorMessage: ChatMessage = {
          id: loadingMessageId,
          role: 'assistant',
          type: 'error',
          content: error instanceof Error ? error.message : 'An unknown error occurred.',
        };
        setMessages((prev) =>
          prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          type: 'text',
          content: '',
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      try {
        await generateTextStream(prompt, (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }, persona.systemInstruction, image);
      } catch (error) {
        console.error(error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  type: 'error',
                  content: error instanceof Error ? error.message : 'An unknown error occurred.',
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const themeConfig = theme === Theme.Custom 
    ? CUSTOM_THEME_CONFIG 
    : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  const appStyle = theme === Theme.Custom ? { '--custom-accent-color': customColor } as React.CSSProperties : {};

  return (
    <div 
        className={`flex flex-col h-screen ${themeConfig.bg} ${themeConfig.text} transition-colors duration-300`}
        style={appStyle}
    >
      <Header 
        theme={theme} 
        onThemeChange={setTheme} 
        customColor={customColor}
        onCustomColorChange={setCustomColor}
        persona={persona}
        onPersonaChange={setPersona}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} theme={theme} isLoading={isLoading} />
        <div className={`p-4 border-t ${theme === Theme.White ? 'border-gray-200 bg-white' : 'border-gray-700 bg-slate-800/50'}`}>
          <div className="max-w-4xl mx-auto">
             <PromptInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
