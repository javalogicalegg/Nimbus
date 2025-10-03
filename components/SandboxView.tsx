import React, { useState, useEffect } from 'react';
import { Theme, ChatMessage, Persona } from '../types';
import { getSandboxInitialMessage, PERSONAS } from '../constants';
import { generateTextStream } from '../services/geminiService';
import ChatWindow from './ChatWindow';
import PromptInput from './PromptInput';
import PersonaSwitcher from './PersonaSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

interface SandboxViewProps {
    theme: Theme;
    userName: string;
}

const SandboxView: React.FC<SandboxViewProps> = ({ theme, userName }) => {
    const { t } = useLanguage();
    const [persona, setPersona] = useState<Persona>(() => {
        const savedPersonaId = localStorage.getItem('sandboxPersonaId');
        return PERSONAS.find(p => p.id === savedPersonaId) || PERSONAS[1]; // default to code helper
    });
    const [messages, setMessages] = useState<ChatMessage[]>([getSandboxInitialMessage(t)]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('sandboxPersonaId', persona.id);
    }, [persona]);
    
    const handlePersonaChange = (newPersona: Persona) => {
        if (newPersona.id === persona.id) return;
        setPersona(newPersona);
        setMessages([
            getSandboxInitialMessage(t),
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                type: 'text',
                content: t('nowChattingWith', { personaName: t(newPersona.nameKey), personaIcon: newPersona.icon })
            }
        ]);
    };

    const handleSendMessage = async (prompt: string, image?: { data: string; mimeType: string }) => {
        setIsLoading(true);

        const imageUrlForMessage = image ? `data:${image.mimeType};base64,${image.data}` : undefined;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            type: 'text',
            content: prompt,
            imageUrl: imageUrlForMessage,
        };

        const assistantMessageId = crypto.randomUUID();
        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: 'assistant',
            type: 'text',
            content: '',
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        
        const systemInstruction = `${persona.systemInstruction} The user's name is ${userName}. Address them by their name when appropriate.`;

        try {
            await generateTextStream(prompt, (chunk) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            }, systemInstruction, image);
        } catch (error) {
            console.error(error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? {
                            ...msg,
                            type: 'error',
                            content: t('errorFailedToGenerateText'),
                        }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`relative p-4 ${theme === Theme.White ? 'bg-gray-50' : 'bg-black/50'}`}>
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${
                    theme === Theme.White ? 'from-transparent via-gray-200 to-transparent' : 'from-transparent via-gray-700 to-transparent'
                }`} />
                <div className="max-w-4xl mx-auto">
                    <PersonaSwitcher 
                        personas={PERSONAS}
                        currentPersona={persona}
                        onPersonaChange={handlePersonaChange}
                    />
                </div>
            </div>
            <ChatWindow messages={messages} theme={theme} isLoading={isLoading} />
            <div className={`relative p-4 ${theme === Theme.White ? 'bg-white' : 'bg-black/50'}`}>
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
                    theme === Theme.White ? 'from-transparent via-gray-200 to-transparent' : 'from-transparent via-gray-700 to-transparent'
                }`} />
                <div className="max-w-4xl mx-auto">
                    <PromptInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
                </div>
            </div>
        </>
    );
};

export default SandboxView;
