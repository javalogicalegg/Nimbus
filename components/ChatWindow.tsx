
import React, { useRef, useEffect } from 'react';
import { ChatMessage, Theme } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: ChatMessage[];
  theme: Theme;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} theme={theme} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
