import React from 'react';
import { Model, ModelId } from '../types';
import LightningIcon from './icons/LightningIcon';
import BrainIcon from './icons/BrainIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface ModelSwitcherProps {
    models: Model[];
    currentModelId: ModelId;
    onModelChange: (modelId: ModelId) => void;
}

const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ models, currentModelId, onModelChange }) => {
    const { t } = useLanguage();
    
    const getIcon = (id: ModelId) => {
        if (id.includes('pro')) return <BrainIcon className="w-5 h-5 mr-1" />;
        return <LightningIcon className="w-5 h-5 mr-1" />;
    }

    return (
        <div className="flex items-center gap-2" role="radiogroup" aria-label={t('model')}>
             <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('model')}:</span>
            <div className="flex p-1 rounded-full bg-gray-500/10">
                {models.map(model => (
                    <button 
                        key={model.id}
                        onClick={() => onModelChange(model.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                            currentModelId === model.id
                            ? 'bg-[var(--custom-accent-color,theme(colors.sky.500))] text-white shadow-md shadow-[var(--custom-accent-color,theme(colors.sky.500))]/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        role="radio"
                        aria-checked={currentModelId === model.id}
                    >
                        {getIcon(model.id)}
                        <span>{model.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ModelSwitcher;
