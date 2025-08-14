import React from 'react';
import { Persona } from '../types';

interface PersonaSwitcherProps {
    personas: Persona[];
    currentPersona: Persona;
    onPersonaChange: (persona: Persona) => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ personas, currentPersona, onPersonaChange }) => {
    return (
        <div className="flex flex-col space-y-2">
            {personas.map(persona => (
                <button
                    key={persona.id}
                    onClick={() => onPersonaChange(persona)}
                    className={`flex items-center gap-3 p-2 rounded-md transition-colors text-left w-full ${
                        currentPersona.id === persona.id 
                        ? 'bg-[var(--custom-accent-color,theme(colors.sky.500))] text-white'
                        : 'hover:bg-gray-500/20'
                    }`}
                    aria-label={`Switch to ${persona.name} persona`}
                >
                    <span className="text-xl">{persona.icon}</span>
                    <span className="text-sm">{persona.name}</span>
                </button>
            ))}
        </div>
    )
}

export default PersonaSwitcher;
