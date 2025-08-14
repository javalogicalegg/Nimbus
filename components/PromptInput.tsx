import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  theme: Theme;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSendMessage, isLoading, theme }) => {
  const [prompt, setPrompt] = useState('');
  const themeConfig = THEME_CONFIGS[theme];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendMessage(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
          }
        }}
        placeholder="Ask me anything or try '/imagine a robot surfing'..."
        disabled={isLoading}
        className={`w-full p-4 pr-14 text-base rounded-2xl resize-none border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
          theme === Theme.White
            ? 'bg-white border-gray-300 text-gray-900'
            : 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
        } ${themeConfig.inputFocus} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        rows={1}
        style={{ minHeight: '56px', maxHeight: '200px' }}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
          isLoading || !prompt.trim()
            ? 'text-gray-400 cursor-not-allowed'
            : `${themeConfig.accent} hover:bg-gray-500/20 active:scale-95 [filter:drop-shadow(0_0_4px_currentColor)]`
        }`}
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default PromptInput;