
import React from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, CUSTOM_THEME_CONFIG } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface PromptBuilderProps {
  onModifierClick: (modifier: string) => void;
  onAspectRatioChange: (aspectRatio: string) => void;
  selectedAspectRatio: string;
  theme: Theme;
}

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={className}>
    <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const ModifierButton: React.FC<{ onClick: () => void; children: React.ReactNode, theme: Theme }> = ({ onClick, children, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 border ${
      theme === Theme.White
        ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400 text-gray-800'
        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500 text-gray-200'
    }`}
  >
    {children}
  </button>
);

const AspectRatioButton: React.FC<{ onClick: () => void; isSelected: boolean; children: React.ReactNode, theme: Theme }> = ({ onClick, isSelected, children, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 border font-medium ${
      isSelected
        ? `bg-[var(--custom-accent-color,theme(colors.sky.500))] text-white border-transparent shadow-md shadow-[var(--custom-accent-color,theme(colors.sky.500))]/30`
        : theme === Theme.White
        ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400 text-gray-800'
        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500 text-gray-200'
    }`}
  >
    {children}
  </button>
);


const STYLES = ['Photorealistic', 'Anime', 'Watercolor', 'Pixel Art', 'Cyberpunk', 'Fantasy'];
const DETAILS = ['Highly detailed', 'Cinematic lighting', '4K', 'Vibrant colors', 'Minimalist'];
const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];


const PromptBuilder: React.FC<PromptBuilderProps> = ({
  onModifierClick,
  onAspectRatioChange,
  selectedAspectRatio,
  theme,
}) => {
  const { t } = useLanguage();
  return (
    <div className={`p-4 rounded-xl border-2 transition-colors duration-300 space-y-4 ${
        theme === Theme.White ? 'bg-white border-gray-200' : 'bg-gray-900/30 border-gray-700'
    }`}>
      <Section title={t('style')}>
        {STYLES.map(style => <ModifierButton key={style} onClick={() => onModifierClick(style)} theme={theme}>{style}</ModifierButton>)}
      </Section>
      <Section title={t('details')}>
        {DETAILS.map(detail => <ModifierButton key={detail} onClick={() => onModifierClick(detail)} theme={theme}>{detail}</ModifierButton>)}
      </Section>
      <Section title={t('aspectRatio')}>
        {ASPECT_RATIOS.map(ratio => (
            <AspectRatioButton 
                key={ratio} 
                onClick={() => onAspectRatioChange(ratio)}
                isSelected={selectedAspectRatio === ratio}
                theme={theme}
            >
                {ratio}
            </AspectRatioButton>
        ))}
      </Section>
    </div>
  );
};

export default PromptBuilder;
