import React, { useEffect, useState } from 'react';

const AnimatedHeader = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="w-full h-48 relative overflow-hidden bg-transparent z-10">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 400 100"
          className="w-96 h-24"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* T */}
          <path
            d="M 50,20 L 90,20 M 70,20 L 70,80"
            className={`stroke-teal-400 stroke-[1.5] fill-none ${
              animate ? 'animate-draw-path' : ''
            }`}
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{ 
              animationDelay: '0s',
              filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.5))'
            }}
          />
          {/* E */}
          <path
            d="M 110,20 L 110,80 M 110,20 L 150,20 M 110,50 L 140,50 M 110,80 L 150,80"
            className={`stroke-teal-400 stroke-[1.5] fill-none ${
              animate ? 'animate-draw-path' : ''
            }`}
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{ 
              animationDelay: '0.5s',
              filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.5))'
            }}
          />
          {/* S */}
          <path
            d="M 170,20 C 200,20 200,50 170,50 C 140,50 140,80 170,80"
            className={`stroke-teal-400 stroke-[1.5] fill-none ${
              animate ? 'animate-draw-path' : ''
            }`}
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{ 
              animationDelay: '1s',
              filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.5))'
            }}
          />
          {/* T */}
          <path
            d="M 210,20 L 250,20 M 230,20 L 230,80"
            className={`stroke-teal-400 stroke-[1.5] fill-none ${
              animate ? 'animate-draw-path' : ''
            }`}
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{ 
              animationDelay: '1.5s',
              filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.5))'
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedHeader;