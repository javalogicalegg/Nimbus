import React from 'react';

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    width="20"
    height="20"
  >
    <path d="M10 3.5a1.5 1.5 0 01.992 2.749l-1.333 1a1.5 1.5 0 01-2.112-2.112l1-1.333A1.5 1.5 0 0110 3.5z" />
    <path d="M3.134 9.333a1.5 1.5 0 012.122 0l4.666 4.667a1.5 1.5 0 010 2.121l-1.334 1.334a1.5 1.5 0 01-2.12 0L2 13.121a1.5 1.5 0 010-2.121l1.134-1.667z" />
    <path d="M6.529 6.529a1.5 1.5 0 012.121 0l1.334 1.333a1.5 1.5 0 01-2.121 2.121L6.53 8.65a1.5 1.5 0 010-2.121z" />
    <path d="M12.47 12.47a1.5 1.5 0 012.121 0l1.333 1.334a1.5 1.5 0 01-2.121 2.12l-1.333-1.333a1.5 1.5 0 010-2.121z" />
    <path d="M16.5 2a1 1 0 011 1v1.5a1 1 0 11-2 0V3a1 1 0 011-1z" />
    <path d="M16 8a1 1 0 011 1v1.5a1 1 0 11-2 0V9a1 1 0 011-1z" />
    <path d="M11.5 2a1 1 0 011 1v1.5a1 1 0 11-2 0V3a1 1 0 011-1z" />
  </svg>
);

export default MagicWandIcon;
