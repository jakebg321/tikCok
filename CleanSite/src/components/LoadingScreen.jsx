import { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [visible, setVisible] = useState(true);
  const [currentShape, setCurrentShape] = useState(0);
  const [progress, setProgress] = useState(0);

  const shapes = [
    // Orbiting circles with pulsing core
    () => (
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
        <div className="absolute inset-[25%] border-4 border-blue-400 rounded-full animate-pulse"></div>
      </div>
    ),
    // Geometric kaleidoscope
    () => (
      <div className="w-20 h-20 relative animate-spin-slow">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 border-4 border-purple-500"
            style={{
              transform: `rotate(${i * 60}deg)`,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              animation: 'pulse 2s infinite',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
        <div className="absolute inset-[30%] bg-purple-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Matrix of spinning squares
    () => (
      <div className="w-20 h-20 grid grid-cols-3 grid-rows-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-0 border-2 border-green-500 animate-spin" 
                 style={{ animationDuration: '3s', animationDelay: `${i * 0.2}s` }}></div>
            <div className="absolute inset-[25%] border-2 border-green-300 animate-spin"
                 style={{ animationDuration: '2s', animationDelay: `${i * 0.2}s` }}></div>
          </div>
        ))}
      </div>
    ),
    // Fractal triangle pattern
    () => (
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 animate-spin-slow">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute inset-0 border-4 border-rose-500"
              style={{
                transform: `rotate(${i * 120}deg) scale(${1 - i * 0.2})`,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                animation: 'pulse 2s infinite',
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    ),
    // Quantum circuitry
    () => (
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 border-4 border-cyan-400 rounded-lg animate-pulse"></div>
        <div className="absolute inset-[15%] animate-spin-slow">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-1 h-8 bg-cyan-500"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animation: 'ping 2s infinite',
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[40%] border-4 border-cyan-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Atomic orbital
    () => (
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-0 border-4 border-yellow-400 rounded-full" style={{ transform: 'rotate3d(1, 1, 0, 45deg)' }}></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute inset-0 border-4 border-yellow-500 rounded-full" style={{ transform: 'rotate3d(1, 0, 1, 45deg)' }}></div>
        </div>
        <div className="absolute inset-[35%] bg-yellow-600 rounded-full animate-pulse"></div>
      </div>
    ),
  ];

  useEffect(() => {
    const duration = 5000; // 5 seconds total
    const shapeInterval = 1000; // 1 second per shape
    const progressInterval = 50; // Update progress every 50ms
    const progressIncrement = (progressInterval / duration) * 100;

    // Shape change interval
    const shapeTimer = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length);
    }, shapeInterval);

    // Progress bar update interval
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + progressIncrement;
        return next > 100 ? 100 : next;
      });
    }, progressInterval);

    // Cleanup and completion
    const completionTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 1000);
    }, duration);

    return () => {
      clearInterval(shapeTimer);
      clearInterval(progressTimer);
      clearTimeout(completionTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="relative mb-8">
        <img 
          src="/load.png" 
          alt="Retro Computer" 
          className="w-auto h-auto"
        />
        <div 
          className="absolute flex items-center justify-center"
          style={{
            top: '30%', // Moved higher up
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '300px',
          }}
        >
          {shapes[currentShape]()}
        </div>
      </div>

      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-gray-400 font-mono mt-2">
        Loading... {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingScreen;