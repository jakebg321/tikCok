import { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [visible, setVisible] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);
  const [currentShape, setCurrentShape] = useState(0);
  const [progress, setProgress] = useState(0);

  const shapes = [
    // Elegant Orbital Pattern
    () => (
      <div className="w-11 h-11 relative">
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              style={{
                animation: `spin 2s linear infinite ${i * -0.67}s`,
                transform: `rotate(${i * 60}deg) scale(${1 - i * 0.15})`,
                opacity: 0.7 - i * 0.2
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[35%] animate-pulse">
          <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-70"></div>
          <div className="absolute inset-[-50%] border-2 border-cyan-400 rounded-full animate-ping opacity-45"></div>
        </div>
      </div>
    ),
    // Geometric kaleidoscope
    () => (
      <div className="w-11 h-11 relative animate-spin-slow opacity-70">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 border-3 border-cyan-400"
            style={{
              transform: `rotate(${i * 60}deg)`,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              animation: `pulse 1.34s infinite ${i * 0.2}s`
            }}
          />
        ))}
        <div className="absolute inset-[30%] bg-cyan-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Matrix of spinning squares
    () => (
      <div className="w-11 h-11 grid grid-cols-3 grid-rows-3 gap-0.5 opacity-70">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-0 border-[1.5px] border-cyan-500"
                 style={{ animation: `spin 2s infinite ${i * 0.134}s` }}></div>
            <div className="absolute inset-[25%] border-[1.5px] border-cyan-400"
                 style={{ animation: `spin 1.34s infinite ${i * 0.134}s` }}></div>
          </div>
        ))}
      </div>
    ),
    // Fractal triangle pattern
    () => (
      <div className="w-11 h-11 relative opacity-70">
        <div className="absolute inset-0 animate-spin-slow">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute inset-0 border-3 border-cyan-500"
              style={{
                transform: `rotate(${i * 120}deg) scale(${1 - i * 0.2})`,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                animation: `pulse 1.34s infinite ${i * 0.33}s`
              }}
            />
          ))}
        </div>
      </div>
    ),
    // Quantum circuitry
    () => (
      <div className="w-11 h-11 relative opacity-70">
        <div className="absolute inset-0 border-3 border-cyan-400 rounded-lg animate-pulse"></div>
        <div className="absolute inset-[15%] animate-spin-slow">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-[2px] h-4 bg-cyan-500"
              style={{ 
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animation: `ping 1.34s infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[40%] border-3 border-cyan-600 rounded-full animate-ping"></div>
      </div>
    ),
    // Atomic orbital
    () => (
      <div className="w-11 h-11 relative opacity-70">
        <div className="absolute inset-0" style={{ animation: 'spin 2s infinite' }}>
          <div className="absolute inset-0 border-3 border-cyan-400 rounded-full" 
               style={{ transform: 'rotate3d(1, 1, 0, 45deg)' }}></div>
        </div>
        <div className="absolute inset-0" style={{ animation: 'spin 2.67s infinite' }}>
          <div className="absolute inset-0 border-3 border-cyan-500 rounded-full" 
               style={{ transform: 'rotate3d(1, 0, 1, 45deg)' }}></div>
        </div>
        <div className="absolute inset-[35%] bg-cyan-600 rounded-full animate-pulse"></div>
      </div>
    ),
    // Final closing animation
    () => (
      <div className="w-8 h-8 relative">
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              style={{
                animation: `ping 1s ease-out infinite ${i * 0.2}s`,
                opacity: 0.7 - (i * 0.2),
                transform: `scale(${0.75})`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-[40%] bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
      </div>
    ),
  ];

  useEffect(() => {
    setTimeout(() => {
      setImageVisible(true);
    }, 67);

    // Precise timing for shape transitions and loading completion
    const shapeInterval = 670; // Time per shape
    const numberOfShapes = shapes.length;
    const duration = (numberOfShapes * shapeInterval); // Exact duration for all shapes
    const progressInterval = 33;
    const progressIncrement = (progressInterval / duration) * 100;

    const shapeTimer = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length);
    }, shapeInterval);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const next = prev + progressIncrement;
        return next > 100 ? 100 : next;
      });
    }, progressInterval);

    const completionTimer = setTimeout(() => {
      setImageVisible(false);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 670);
      }, 670);
    }, duration - 200);

    return () => {
      clearInterval(shapeTimer);
      clearInterval(progressTimer);
      clearTimeout(completionTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-670 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="mt-[10vh]">
        <div className="mb-14">
          <div className="relative inline-block">
            <div className="relative">
              <img 
                src="/load.png" 
                alt="Retro Computer" 
                className={`h-32 w-32 transition-opacity duration-670 drop-shadow-[0_0_15px_rgba(20,184,166,0.7)] animate-pulse ${
                  imageVisible ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div 
                className={`absolute flex items-center justify-center transition-opacity duration-670 ${
                  imageVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  top: '30%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '92px',
                  height: '78px',
                }}
              >
                {shapes[currentShape]()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="font-mono text-sm">
        <div className="flex items-center gap-2 text-cyan-400">
          <span>{'>'}</span>
          <span className="w-36 h-5 bg-black border border-cyan-500 overflow-hidden flex items-center px-1">
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