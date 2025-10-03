import React, { useState, useEffect } from 'react';
import { Theme, ChatMessage, ModelId } from '../types';
import { getChatInitialMessage, PERSONAS, MODELS } from '../constants';
import { generateTextStream } from '../services/geminiService';
import ChatWindow from './ChatWindow';
import PromptInput from './PromptInput';
import { useLanguage } from '../contexts/LanguageContext';
import ModelSwitcher from './ModelSwitcher';

interface ChatViewProps {
  theme: Theme;
  userName: string;
}

const ChatView: React.FC<ChatViewProps> = ({ theme, userName }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([getChatInitialMessage(t)]);
    const [isLoading, setIsLoading] = useState(false);
    const [model, setModel] = useState<ModelId>(() => {
        const savedModel = localStorage.getItem('chatModelId') as ModelId;
        return savedModel || 'gemini-2.5-flash';
    });
    const persona = PERSONAS.find(p => p.id === 'default') || PERSONAS[0];

    useEffect(() => {
        localStorage.setItem('chatModelId', model);
    }, [model]);

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
            <div className={`p-3 ${theme === Theme.White ? 'bg-gray-50 border-b border-gray-200' : 'bg-black/50 border-b border-gray-800'}`}>
                <div className="max-w-4xl mx-auto flex justify-center">
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

export default ChatView;
