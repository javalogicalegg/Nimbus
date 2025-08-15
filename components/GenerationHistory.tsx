import React from 'react';

interface HistoryItem {
    id: string;
    url: string;
    prompt: string;
}

interface GenerationHistoryProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ history, onSelect }) => {
    if (history.length === 0) return null;

    return (
        <div className="w-full animate-fade-in-chunk">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider">History</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                {history.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onSelect(item)} 
                        className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-[var(--custom-accent-color,theme(colors.sky.500))] focus:outline-none focus:border-[var(--custom-accent-color,theme(colors.sky.500))] transition-all duration-200"
                        title={item.prompt}
                    >
                        <img src={item.url} alt={item.prompt} className="w-24 h-24 object-cover" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default GenerationHistory;
