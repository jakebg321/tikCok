import { animate } from 'framer-motion';
import React, { useEffect, useState, useCallback } from 'react';

const animatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.12), transparent 70%)'
        }}
      />

      {/* Animated gradient lines */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute w-full h-px opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
              top: `${30 + i * 20}%`,
              animation: `float ${15 + i * 2}s ease-in-out infinite`,
              animationDelay: `${-i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle dots matrix */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Your content goes here */}
      </div>

      {/* Global animations */}
      <style jsx global="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(30px) translateX(30px); }
        }
      `}</style>
    </div>
  );
};

export default animatedBackground;