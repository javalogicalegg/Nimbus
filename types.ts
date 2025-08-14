
export enum Theme {
  Black = 'black',
  Grey = 'grey',
  White = 'white',
}

export type MessageRole = 'user' | 'assistant';
export type MessageType = 'text' | 'image' | 'loading' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
}
