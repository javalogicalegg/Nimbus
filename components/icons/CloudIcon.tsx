
import React from 'react';

const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width="24"
    height="24"
    aria-hidden="true"
  >
    <path d="M19.5 16.5a4.5 4.5 0 00-3.13-4.14 6 6 0 00-11.74 1.13 5.25 5.25 0 00-1.13 10.26h16a4.5 4.5 0 000-9z" />
  </svg>
);

export default CloudIcon;
