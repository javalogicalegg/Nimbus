import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5a5.5 5.5 0 0 0-5.46 4.93 4 4 0 0 0-3.3 3.63A4.5 4.5 0 0 0 8.5 19.5h7a4.5 4.5 0 0 0 4.26-6.44 4 4 0 0 0-3.3-3.63A5.5 5.5 0 0 0 12 2.5Z" />
        <path d="M12 13.5V22" />
        <path d="M16.5 13.5a4.5 4.5 0 0 1-9 0" />
        <path d="M12 2.5C10.34 2.5 9 3.84 9 5.5" />
        <path d="M15 5.5c0-1.66-1.34-3-3-3" />
        <path d="M12 13.5c-1.66 0-3 1.34-3 3" />
        <path d="M15 16.5c0-1.66-1.34-3-3-3" />
    </svg>
);

export default BrainIcon;
