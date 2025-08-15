import React, { useState } from 'react';
import { Theme, ChatMessage } from '../types';
import { CHAT_INITIAL_MESSAGE, PERSONAS } from '../constants';
import { generateTextStream } from '../services/geminiService';
import ChatWindow from './ChatWindow';
import PromptInput from './PromptInput';

interface ChatViewProps {
  theme: Theme;
}

const ChatView: React.FC<ChatViewProps> = ({ theme }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([CHAT_INITIAL_MESSAGE]);
    const [isLoading, setIsLoading] = useState(false);
    const persona = PERSONAS.find(p => p.id === 'default') || PERSONAS[0];

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

        try {
            await generateTextStream(prompt, (chunk) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            }, persona.systemInstruction, image);
        } catch (error) {
            console.error(error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? {
                            ...msg,
                            type: 'error',
                            content: error instanceof Error ? error.message : 'An unknown error occurred.',
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
            <ChatWindow messages={messages} theme={theme} isLoading={isLoading} />
            <div className={`relative p-4 ${theme === Theme.White ? 'bg-white' : 'bg-slate-800/50'}`}>
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

export default ChatView;