import { Theme, ChatMessage } from './types';

export const APP_NAME = "Nimbus Reality Composer";

export const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-message',
  role: 'assistant',
  type: 'text',
  content: "Hello! I am Nimbus, your reality composer. You can chat with me, or ask me to generate an image by starting your prompt with `/imagine`.",
};

export const THEME_CONFIGS: Record<Theme, {
  bg: string;
  text: string;
  card: string;
  accent: string;
  userBubble: string;
  assistantBubble: string;
  userText: string;
  assistantText: string;
  textGlow: string;
  iconGlow: string;
  inputFocus: string;
}> = {
  [Theme.Black]: {
    bg: 'bg-black',
    text: 'text-gray-200',
    card: 'bg-gray-900/50',
    accent: 'text-blue-400',
    userBubble: 'bg-blue-600',
    assistantBubble: 'bg-gray-800',
    userText: 'text-white',
    assistantText: 'text-gray-200',
    textGlow: '[text-shadow:0_0_10px_theme(colors.blue.400)]',
    iconGlow: '[filter:drop-shadow(0_0_4px_theme(colors.blue.400))]',
    inputFocus: 'focus:border-blue-500 focus:ring-blue-500/50 focus:shadow-[0_0_12px_0_theme(colors.blue.500)]',
  },
  [Theme.Grey]: {
    bg: 'bg-slate-800',
    text: 'text-slate-200',
    card: 'bg-slate-900/50',
    accent: 'text-sky-400',
    userBubble: 'bg-sky-500',
    assistantBubble: 'bg-slate-700',
    userText: 'text-white',
    assistantText: 'text-slate-200',
    textGlow: '[text-shadow:0_0_10px_theme(colors.sky.400)]',
    iconGlow: '[filter:drop-shadow(0_0_4px_theme(colors.sky.400))]',
    inputFocus: 'focus:border-sky-500 focus:ring-sky-500/50 focus:shadow-[0_0_12px_0_theme(colors.sky.500)]',
  },
  [Theme.White]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    card: 'bg-white',
    accent: 'text-indigo-600',
    userBubble: 'bg-indigo-500',
    assistantBubble: 'bg-gray-200',
    userText: 'text-white',
    assistantText: 'text-gray-800',
    textGlow: '[text-shadow:0_0_10px_theme(colors.indigo.500)]',
    iconGlow: '[filter:drop-shadow(0_0_4px_theme(colors.indigo.500))]',
    inputFocus: 'focus:border-indigo-500 focus:ring-indigo-500/50 focus:shadow-[0_0_12px_0_theme(colors.indigo.500)]',
  },
};