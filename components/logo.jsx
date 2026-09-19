import React from 'react';

const Logo = ({ className = "", height = 36 }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg
        width={height}
        height={height}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <circle cx="25" cy="25" r="22" fill="currentColor" className="text-primary" />
        <path
          d="M14 30 L20 24 L25 27 L31 18 L37 22"
          stroke="white"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground">
          WealthFlow
        </span>
        <span className="-mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Finance tracker</span>
      </div>
    </div>
  );
};

export default Logo;
