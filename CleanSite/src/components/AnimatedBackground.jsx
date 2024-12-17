import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 bg-[#0B1121] overflow-hidden">
      {/* City Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(45, 212, 191, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(45, 212, 191, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full animate-float"
            style={{
              width: `${4 + (i % 4) * 3}px`,
              height: `${4 + (i % 4) * 3}px`,
              background: 'rgba(45, 212, 191, 0.3)',
              boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)',
              left: `${(i * 7) % 100}%`,
              top: `${10 + ((i * 13) % 80)}%`,
              animationDuration: `${4 + (i % 3)}s`,
              animationDelay: `${-i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Large glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle at center, rgba(45, 212, 191, 0.03) 0%, transparent 70%)`,
              left: `${(i * 30) % 100}%`,
              top: `${-50 + (i * 30)}%`,
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${-i * 2}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Your content goes here */}
      </div>
    </div>
  );
};

export default AnimatedBackground;