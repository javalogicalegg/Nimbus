import React, { useState } from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, CUSTOM_THEME_CONFIG, COMPOSER_LOADING_MESSAGES, PROMPT_ENHANCERS, REMIX_SUGGESTIONS } from '../constants';
import PromptBuilder from './PromptBuilder';
import { generateImage } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import MagicWandIcon from './icons/MagicWandIcon';
import GenerationHistory from './GenerationHistory';

interface ComposerViewProps {
  theme: Theme;
}
interface HistoryItem {
    id: string;
    url: string;
    prompt: string;
}

const ComposerView: React.FC<ComposerViewProps> = ({ theme }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ imageUrl?: string; error?: string } | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(COMPOSER_LOADING_MESSAGES[0]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState('');

    const themeConfig = theme === Theme.Custom 
        ? CUSTOM_THEME_CONFIG 
        : THEME_CONFIGS[theme as Exclude<Theme, Theme.Custom>];

    const handleModifierClick = (modifier: string) => {
        setPrompt(prev => prev.trim() ? `${prev.trim()}, ${modifier}` : modifier);
    }

    const handleGenerate = async (promptToUse = prompt) => {
        if (!promptToUse.trim() || isLoading) return;
        setIsLoading(true);
        setResult(null);
        setCurrentPrompt(promptToUse);
        setLoadingMessage(COMPOSER_LOADING_MESSAGES[Math.floor(Math.random() * COMPOSER_LOADING_MESSAGES.length)]);
        try {
            const imageUrl = await generateImage(promptToUse, aspectRatio);
            setResult({ imageUrl });
            setHistory(prev => [{ id: crypto.randomUUID(), url: imageUrl, prompt: promptToUse }, ...prev].slice(0, 10));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setResult({ error: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        const rect = button.getBoundingClientRect();
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        
        const existingRipple = button.getElementsByClassName("ripple")[0];
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(circle);
        handleGenerate();
    };

    const handleEnhancePrompt = () => {
        const enhancer = PROMPT_ENHANCERS[Math.floor(Math.random() * PROMPT_ENHANCERS.length)];
        handleModifierClick(enhancer);
    };

    const handleRemix = (remixSuggestion: string) => {
        const newPrompt = `${currentPrompt}, ${remixSuggestion}`;
        setPrompt(newPrompt);
        handleGenerate(newPrompt);
    };

    const handleHistorySelect = (item: HistoryItem) => {
        setPrompt(item.prompt);
        setCurrentPrompt(item.prompt);
        setResult({ imageUrl: item.url });
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-6">
                <div className="text-center">
                    <h2 className={`text-3xl font-bold ${themeConfig.accent} ${themeConfig.textGlow}`}>Image Composer</h2>
                    <p className="text-base mt-2 glint-container">
                        What do you want to create?
                        <span className="glint-effect"></span>
                    </p>
                </div>
                
                <div className="space-y-3">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                            placeholder="Describe the image you want to create..."
                            disabled={isLoading}
                            className={`w-full p-4 pr-14 text-base rounded-2xl resize-none border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            theme === Theme.White
                                ? 'bg-white border-gray-300 text-gray-900'
                                : 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
                            } ${themeConfig.inputFocus}`}
                            rows={3}
                        />
                         <button
                            type="button"
                            onClick={handleEnhancePrompt}
                            disabled={isLoading}
                            className={`absolute right-3 top-3 p-2 rounded-full transition-colors duration-200 ${
                                isLoading ? 'text-gray-500 cursor-not-allowed' : `text-gray-400 hover:${themeConfig.accent}`
                            }`}
                            aria-label="Enhance Prompt"
                            title="Enhance Prompt"
                        >
                            <MagicWandIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <PromptBuilder 
                        onModifierClick={handleModifierClick}
                        onAspectRatioChange={setAspectRatio}
                        selectedAspectRatio={aspectRatio}
                        theme={theme}
                    />
                </div>

                <button 
                    onClick={handleGenerateClick} 
                    disabled={isLoading || !prompt.trim()}
                    className={`ripple-button w-full flex justify-center items-center gap-2 py-3 px-4 text-base font-semibold rounded-xl transition-all duration-300 text-white ${
                        isLoading || !prompt.trim() 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : `bg-[var(--custom-accent-color,theme(colors.sky.500))] hover:opacity-90 active:scale-95 shadow-lg shadow-[var(--custom-accent-color,theme(colors.sky.500))]/30`
                    }`}
                >
                    {isLoading ? <><SpinnerIcon className="w-6 h-6" /> {loadingMessage}</> : 'Generate'}
                </button>
                
                <div className={`mt-2 w-full min-h-[300px] flex justify-center items-center rounded-xl p-2 ${
                    theme === Theme.White ? 'bg-gray-100' : 'bg-gray-900/50'
                }`}>
                    {isLoading && (
                        <div className="flex flex-col items-center gap-2 text-lg animate-pulse">
                            <SpinnerIcon className="w-8 h-8"/>
                            <span>{loadingMessage}</span>
                        </div>
                    )}
                    {result?.error && (
                        <div className="text-red-400 p-4 text-center">
                            <p className="font-bold">Generation Failed</p>
                            <p>{result.error}</p>
                        </div>
                    )}
                    {result?.imageUrl && (
                        <img 
                            src={result.imageUrl} 
                            alt={prompt}
                            className="rounded-lg max-w-full max-h-[60vh] object-contain animate-fade-in-chunk" 
                        />
                    )}
                    {!isLoading && !result && (
                        <p className="text-gray-400">Your generated image will appear here</p>
                    )}
                </div>

                {result?.imageUrl && !isLoading && (
                    <div className="w-full animate-fade-in-chunk">
                        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider">Evolve Image</h3>
                        <div className="flex flex-wrap gap-2">
                            {REMIX_SUGGESTIONS.map(suggestion => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => handleRemix(suggestion)}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 border ${
                                        theme === Theme.White
                                          ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400 text-gray-800'
                                          : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500 text-gray-200'
                                      }`}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <GenerationHistory history={history} onSelect={handleHistorySelect} />
            </div>
        </div>
    );
};

export default ComposerView;