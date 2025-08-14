
import React, { useState } from 'react';
import { Theme, ChatMessage } from './types';
import { THEME_CONFIGS, INITIAL_MESSAGE } from './constants';
import { generateText, generateImage } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import PromptInput from './components/PromptInput';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Black);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (prompt: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      content: prompt,
    };

    const loadingMessageId = crypto.randomUUID();
    const isImagePrompt = prompt.toLowerCase().startsWith('/imagine ');
    
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      role: 'assistant',
      type: 'loading',
      content: isImagePrompt ? 'Generating image...' : 'Thinking...',
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      let assistantResponse: ChatMessage;
      if (isImagePrompt) {
        const imagePrompt = prompt.substring('/imagine '.length).trim();
        const imageUrl = await generateImage(imagePrompt);
        assistantResponse = {
          id: loadingMessageId,
          role: 'assistant',
          type: 'image',
          content: imageUrl,
        };
      } else {
        const textResponse = await generateText(prompt);
        assistantResponse = {
          id: loadingMessageId,
          role: 'assistant',
          type: 'text',
          content: textResponse,
        };
      }
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
  };

  const themeConfig = THEME_CONFIGS[theme];

  return (
    <div className={`flex flex-col h-screen ${themeConfig.bg} ${themeConfig.text} transition-colors duration-300`}>
      <Header theme={theme} onThemeChange={setTheme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} theme={theme} />
        <div className={`p-4 border-t ${theme === Theme.White ? 'border-gray-200 bg-gray-50' : 'border-gray-800 bg-black/10'}`}>
          <div className="max-w-4xl mx-auto">
             <PromptInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
