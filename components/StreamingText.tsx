import React, { useState, useEffect, useRef } from 'react';

interface StreamingTextProps {
  content: string;
}

let chunkId = 0;

const StreamingText: React.FC<StreamingTextProps> = ({ content }) => {
  const [renderedChunks, setRenderedChunks] = useState<{ id: number; text: string }[]>([]);
  const prevContentRef = useRef<string>('');

  useEffect(() => {
    if (content.length > prevContentRef.current.length) {
      const newText = content.slice(prevContentRef.current.length);
      setRenderedChunks(prev => [...prev, { id: chunkId++, text: newText }]);
    } else if (content.length < prevContentRef.current.length) {
       // Handle cases where content is replaced (e.g., error)
      setRenderedChunks([{ id: chunkId++, text: content }]);
    } else if (content === '') {
      setRenderedChunks([]);
    }
    prevContentRef.current = content;
  }, [content]);

  return (
    <div className="whitespace-pre-wrap">
      {renderedChunks.map(chunk => (
        <span key={chunk.id} className="animate-fade-in-chunk">
          {chunk.text}
        </span>
      ))}
    </div>
  );
};

export default StreamingText;
