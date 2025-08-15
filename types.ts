
export enum Theme {
  Dark = 'dark',
  White = 'white',
  Custom = 'custom',
}

export type AppMode = 'chat' | 'composer' | 'sandbox';

export type Persona = {
  id: string;
  name: string;
  icon: string;
  systemInstruction: string;
};

export type MessageRole = 'user' | 'assistant';
export type MessageType = 'text' | 'image' | 'loading' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  imageUrl?: string;
}