import React from 'react';

const Logo = ({ className = "", width = 180, height = 50 }) => {
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
        {/* Modern circular background with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="25" cy="25" r="22" fill="url(#logoGradient)" />
        
        {/* Financial chart icon */}
        <path
          d="M15 30 L20 25 L25 28 L30 20 L35 23"
          stroke="url(#iconGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Chart dots */}
        <circle cx="15" cy="30" r="2" fill="white" />
        <circle cx="20" cy="25" r="2" fill="white" />
        <circle cx="25" cy="28" r="2" fill="white" />
        <circle cx="30" cy="20" r="2" fill="white" />
        <circle cx="35" cy="23" r="2" fill="white" />
        
        {/* Dollar sign overlay */}
        <path
          d="M25 12 L25 18 M25 32 L25 38 M22 15 C22 13.9 22.9 13 24 13 L26 13 C27.1 13 28 13.9 28 15 C28 16.1 27.1 17 26 17 L24 17 C22.9 17 22 17.9 22 19 C22 20.1 22.9 21 24 21 L26 21 C27.1 21 28 21.9 28 23 C28 24.1 27.1 25 26 25 L24 25 C22.9 25 22 24.1 22 23"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      </svg>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 bg-clip-text text-transparent">
          WealthFlow
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Finance Tracker</span>
      </div>
    </div>
  );
};

export default Logo;
