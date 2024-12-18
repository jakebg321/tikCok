import { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [visible, setVisible] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);  // Start with false
  const [currentShape, setCurrentShape] = useState(0);
  const [progress, setProgress] = useState(0);

  const shapes = [
    // Elegant Orbital Pattern
    () => (
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              style={{
                animation: 'spin 3s linear infinite',
                animationDelay: `${i * -1}s`,
                transform: `rotate(${i * 60}deg) scale(${1 - i * 0.15})`,
                opacity: 1 - i * 0.2
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[35%] animate-pulse">
          <div className="absolute inset-0 bg-cyan-500 rounded-full"></div>
          <div className="absolute inset-[-50%] border-2 border-cyan-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
    ),
    // Geometric kaleidoscope
    () => (
      <div className="w-16 h-16 relative animate-spin-slow">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 border-3 border-cyan-400"
            style={{
              transform: `rotate(${i * 60}deg)`,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              animation: 'pulse 2s infinite',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
        <div className="absolute inset-[30%] bg-cyan-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Matrix of spinning squares
    () => (
      <div className="w-16 h-16 grid grid-cols-3 grid-rows-3 gap-0.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-0 border-[1.5px] border-cyan-500 animate-spin" 
                 style={{ animationDuration: '3s', animationDelay: `${i * 0.2}s` }}></div>
            <div className="absolute inset-[25%] border-[1.5px] border-cyan-400 animate-spin"
                 style={{ animationDuration: '2s', animationDelay: `${i * 0.2}s` }}></div>
          </div>
        ))}
      </div>
    ),
    // Fractal triangle pattern
    () => (
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 animate-spin-slow">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute inset-0 border-3 border-cyan-500"
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
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-3 border-cyan-400 rounded-lg animate-pulse"></div>
        <div className="absolute inset-[15%] animate-spin-slow">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-[3px] h-6 bg-cyan-500"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animation: 'ping 2s infinite',
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[40%] border-3 border-cyan-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Atomic orbital
    () => (
      <div className="w-16 h-16 relative"> {/* Changed from w-20 h-20 */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-0 border-3 border-cyan-400 rounded-full" style={{ transform: 'rotate3d(1, 1, 0, 45deg)' }}></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute inset-0 border-3 border-cyan-500 rounded-full" style={{ transform: 'rotate3d(1, 0, 1, 45deg)' }}></div>
        </div>
        <div className="absolute inset-[35%] bg-cyan-600 rounded-full animate-pulse"></div>
      </div>
    ),
  ];

  useEffect(() => {
    // Add initial fade-in
    setTimeout(() => {
      setImageVisible(true);
    }, 100);

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

    // Modified completion sequence
    const completionTimer = setTimeout(() => {
      setImageVisible(false); // Fade out the image and shapes
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 1000);
      }, 1000);
    }, duration - 1000); // Start fading 1 second earlier

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
      {/* Main container with no relative positioning */}
      <div className="mb-6"> {/* Reduced margin */}
        {/* Container for computer */}
        <div className="relative inline-block">
          {/* Computer image container */}
          <div className="relative">
            <img 
              src="/load.png" 
              alt="Retro Computer" 
              className={`w-auto h-auto scale-[0.375] transition-opacity duration-1000 ${
                imageVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div 
              className={`absolute flex items-center justify-center transition-opacity duration-1000 ${
                imageVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '131px', // Reduced from 175px
                height: '112px', // Reduced from 150px
              }}
            >
              {shapes[currentShape]()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar section */}
      <div className="font-mono text-sm">
        <div className="flex items-center gap-2 text-cyan-400">
          <span>{'>'}</span>
          <span className="w-48 h-5 bg-black border border-cyan-500 overflow-hidden flex items-center px-1">
            <div 
              className="h-3 bg-cyan-500 transition-all duration-200 ease-linear flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && (
                <div className="animate-pulse text-[10px] text-black whitespace-nowrap px-1">
                  {Array(Math.floor(progress / 10)).fill('=').join('')}
                </div>
              )}
            </div>
          </span>
          <span className="text-cyan-500 min-w-[4ch]">{`${Math.round(progress)}%`}</span>
        </div>
        <div className="text-cyan-400/60 text-xs mt-1">
          Loading system components...
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;