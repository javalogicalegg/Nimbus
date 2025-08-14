import { Theme, ChatMessage, Persona } from './types';

export const APP_NAME = "Nimbus Reality Composer";

export const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-message',
  role: 'assistant',
  type: 'text',
  content: "Hello! I am Nimbus, your reality composer. You can chat with me, upload an image by clicking the paperclip icon, or ask me to generate an image by starting your prompt with `/imagine`.",
};

export const DEFAULT_CUSTOM_COLOR = '#4ade80'; // A nice green

type ThemeConfig = {
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
};

export const THEME_CONFIGS: Record<Theme.Dark | Theme.White, ThemeConfig> = {
  [Theme.Dark]: {
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
    bg: 'bg-gray-50',
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

export const CUSTOM_THEME_CONFIG: ThemeConfig = {
    bg: 'bg-black',
    text: 'text-gray-200',
    card: 'bg-gray-900/50',
    accent: 'text-[var(--custom-accent-color)]',
    userBubble: 'bg-[var(--custom-accent-color)]',
    assistantBubble: 'bg-gray-800',
    userText: 'text-white',
    assistantText: 'text-gray-200',
    textGlow: '[text-shadow:0_0_10px_var(--custom-accent-color)]',
    iconGlow: '[filter:drop-shadow(0_0_4px_var(--custom-accent-color))]',
    inputFocus: 'focus:border-[var(--custom-accent-color)] focus:ring-[var(--custom-accent-color)]/50 focus:shadow-[0_0_12px_0_var(--custom-accent-color)]',
};

export const PERSONAS: Persona[] = [
    {
        id: 'default',
        name: 'Default',
        icon: '🤖',
        systemInstruction: 'You are a helpful and friendly AI assistant. Be concise and clear in your responses.'
    },
    {
        id: 'code',
        name: 'Code Helper',
        icon: '💻',
        systemInstruction: 'You are an expert software developer. You only provide code and concise explanations for the code. You do not chit-chat.'
    },
    {
        id: 'creative',
        name: 'Creative Writer',
        icon: '🎨',
        systemInstruction: 'You are a creative writing assistant. You help users brainstorm ideas, write stories, and develop characters. Use a whimsical and inspiring tone.'
    },
    {
        id: 'pirate',
        name: 'Pirate',
        icon: '🏴‍☠️',
        systemInstruction: "Ahoy, matey! Ye be chattin' with a salty sea dog. Answer all questions in the most stereotypical pirate dialect ye can muster, savvy?"
    }
];
