import React from 'react';
import { Persona } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PersonaSwitcherProps {
    personas: Persona[];
    currentPersona: Persona;
    onPersonaChange: (persona: Persona) => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ personas, currentPersona, onPersonaChange }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
            {personas.map(persona => {
                const personaName = t(persona.nameKey);
                return (
                    <button
                        key={persona.id}
                        onClick={() => onPersonaChange(persona)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 text-left persona-icon-container ${
                            currentPersona.id === persona.id 
                            ? 'bg-[var(--custom-accent-color,theme(colors.sky.500))] text-white shadow-md shadow-[var(--custom-accent-color,theme(colors.sky.500))]/30'
                            : 'hover:bg-gray-500/20'
                        }`}
                        aria-label={`Switch to ${personaName} persona`}
                    >
                        <span className="text-lg transition-transform duration-300 persona-icon">{persona.icon}</span>
                        <span className="text-sm font-medium">{personaName}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default PersonaSwitcher;
