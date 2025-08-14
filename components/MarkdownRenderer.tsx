import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';

interface MarkdownRendererProps {
  content: string;
  theme: Theme;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme }) => {
  const themeConfig = THEME_CONFIGS[theme];
  const isWhite = theme === Theme.White;

  return (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
            strong: ({node, ...props}) => <strong {...props} />,
            em: ({node, ...props}) => <em {...props} />,
            s: ({node, ...props}) => <s {...props} />,
            a: ({node, ...props}) => <a className={`${themeConfig.accent} hover:underline`} target="_blank" rel="noopener noreferrer" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-outside my-3 pl-6 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-outside my-3 pl-6 space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="pl-2" {...props} />,
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline ? (
                <div className={`my-3 rounded-lg overflow-hidden ${isWhite ? 'bg-gray-800' : 'bg-black/50'}`}>
                    {match && (
                        <div className={`px-4 py-1.5 text-xs font-sans text-gray-300 ${isWhite ? 'bg-gray-700' : 'bg-black/75'}`}>
                            {match[1]}
                        </div>
                    )}
                    <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                        <code className={`!bg-transparent !p-0 font-mono ${isWhite ? 'text-gray-200' : themeConfig.assistantText}`} {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
              ) : (
                <code className={`px-1.5 py-1 mx-0.5 rounded font-mono text-sm ${isWhite ? 'bg-gray-200 text-indigo-700' : 'bg-gray-900/80 text-blue-300'}`} {...props}>
                  {children}
                </code>
              )
            },
        }}
    >
        {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;