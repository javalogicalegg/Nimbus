
import React, { useState, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import XCircleIcon from './icons/XCircleIcon';
import { Theme } from '../types';
import { THEME_CONFIGS, CUSTOM_THEME_CONFIG } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageFile {
  dataUrl: string; // This is the base64 encoded string with mime type prefix
  data: string; // This is the raw base64 data
  mimeType: string;
}
interface PromptInputProps {
  onSendMessage: (prompt: string, image?: {data: string, mimeType: string}) => void;
  isLoading: boolean;
  theme: Theme;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSendMessage, isLoading, theme }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const themeConfig = theme === Theme.Custom 
    ? CUSTOM_THEME_CONFIG 
    : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((prompt.trim() || image) && !isLoading) {
      onSendMessage(prompt.trim(), image ? { data: image.data, mimeType: image.mimeType } : undefined);
      setPrompt('');
      setImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
              const dataUrl = loadEvent.target?.result as string;
              const [header, data] = dataUrl.split(',');
              const mimeType = header.match(/:(.*?);/)?.[1];
              if (data && mimeType) {
                setImage({ dataUrl, data, mimeType });
              }
          };
          reader.readAsDataURL(file);
      }
      // Reset file input value to allow re-uploading the same file
      e.target.value = '';
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {image && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-700/80 rounded-lg">
            <div className="relative">
                <img src={image.dataUrl} alt="upload preview" className="h-20 w-20 object-cover rounded-md" />
                <button 
                    type="button" 
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-gray-300 hover:text-white"
                    aria-label={t('removeImage')}
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
      )}

      <div className="relative">
        <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
            }
            }}
            placeholder={t('askMeAnything')}
            disabled={isLoading}
            className={`w-full p-4 pl-14 pr-14 text-base rounded-2xl resize-none border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
            theme === Theme.White
                ? 'bg-white border-gray-300 text-gray-900'
                : 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
            } ${themeConfig.inputFocus} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            rows={1}
            style={{ minHeight: '56px', maxHeight: '200px' }}
        />
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
            accept="image/*"
        />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${
                isLoading ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:text-white'
            }`}
            aria-label={t('attachImage')}
        >
            <PaperclipIcon className="w-6 h-6" />
        </button>
        <button
            type="submit"
            disabled={isLoading || (!prompt.trim() && !image)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
            isLoading || (!prompt.trim() && !image)
                ? 'text-gray-400 cursor-not-allowed'
                : `${themeConfig.accent} hover:bg-gray-500/20 active:scale-95 [filter:drop-shadow(0_0_4px_currentColor)]`
            }`}
        >
            <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
