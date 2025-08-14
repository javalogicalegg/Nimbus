
import React, { useRef, useEffect } from 'react';
import { ChatMessage, Theme } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: ChatMessage[];
  theme: Theme;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, theme, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <Message
          key={msg.id}
          message={msg}
          theme={theme}
          isLoading={isLoading}
          isLastMessage={index === messages.length - 1}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;