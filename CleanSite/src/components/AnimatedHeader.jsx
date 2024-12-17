import React from 'react';

const AnimatedHeader = () => {
  return (
    <div className="w-full py-6 px-6 flex justify-center items-center">
      <svg viewBox="0 0 400 200" className="w-[600px]">
        {/* T */}
        <path
          d="M50 50 L150 50 M100 50 L100 150"
          stroke="currentColor"
          strokeWidth="4"
          className="text-teal-400"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="200"
          style={{
            animation: 'draw-path 2s ease forwards',
            animationDelay: '0s'
          }}
        />
        
        {/* E */}
        <path
          d="M160 50 L260 50 M160 100 L240 100 M160 150 L260 150 M160 50 L160 150"
          stroke="currentColor"
          strokeWidth="4"
          className="text-teal-400"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="200"
          style={{
            animation: 'draw-path 2s ease forwards',
            animationDelay: '0.5s'
          }}
        />
        
        {/* S */}
        <path
          d="M280 60 C330 60 330 100 280 100 C230 100 230 140 280 140"
          stroke="currentColor"
          strokeWidth="4"
          className="text-teal-400"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="200"
          style={{
            animation: 'draw-path 2s ease forwards',
            animationDelay: '1s'
          }}
        />
        
        {/* T */}
        <path
          d="M300 50 L400 50 M350 50 L350 150"
          stroke="currentColor"
          strokeWidth="4"
          className="text-teal-400"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="200"
          style={{
            animation: 'draw-path 2s ease forwards',
            animationDelay: '1.5s'
          }}
        />

        {/* Glowing effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </svg>
    </div>
  );
};

export default AnimatedHeader;