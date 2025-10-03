import React, { useState, useEffect } from 'react';
import { Theme, ChatMessage, Persona, ModelId } from '../types';
import { getSandboxInitialMessage, PERSONAS, MODELS } from '../constants';
import { generateTextStream } from '../services/geminiService';
import ChatWindow from './ChatWindow';
import PromptInput from './PromptInput';
import PersonaSwitcher from './PersonaSwitcher';
import ModelSwitcher from './ModelSwitcher';
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
    const [model, setModel] = useState<ModelId>(() => {
        const savedModel = localStorage.getItem('sandboxModelId') as ModelId;
        return savedModel || 'gemini-2.5-flash';
    });
    const [messages, setMessages] = useState<ChatMessage[]>([getSandboxInitialMessage(t)]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('sandboxPersonaId', persona.id);
    }, [persona]);
    
    useEffect(() => {
        localStorage.setItem('sandboxModelId', model);
    }, [model]);

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
            }, model, systemInstruction, image);
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
            <div className={`p-4 ${theme === Theme.White ? 'bg-gray-50 border-b border-gray-200' : 'bg-black/50 border-b border-gray-800'}`}>
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center">
                    <PersonaSwitcher 
                        personas={PERSONAS}
                        currentPersona={persona}
                        onPersonaChange={handlePersonaChange}
                    />
                     <ModelSwitcher
                        models={MODELS}
                        currentModelId={model}
                        onModelChange={setModel}
                    />
                </div>
            </div>
            <ChatWindow messages={messages} theme={theme} isLoading={isLoading} />
            <div className={`p-4 ${theme === Theme.White ? 'bg-white border-t border-gray-200' : 'bg-black/50 border-t border-gray-800'}`}>
                <div className="max-w-4xl mx-auto">
                    <PromptInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
                </div>
            </div>
        </>
    );
};

export default SandboxView;
