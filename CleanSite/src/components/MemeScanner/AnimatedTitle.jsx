import React, { useEffect, useState } from 'react';

const AnimatedTitle = () => {
    const [isVisible, setIsVisible] = useState(false);
    const words = ['Meme', 'Scanner'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
  
    useEffect(() => {
      setIsVisible(true);
      const typeText = async () => {
        const word = words[currentWordIndex];
        
        if (isTyping) {
          for (let i = 0; i <= word.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setDisplayText(word.slice(0, i));
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
          setIsTyping(false);
        } else {
          for (let i = word.length; i >= 0; i--) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setDisplayText(word.slice(0, i));
          }
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
        }
      };
  
      typeText();
    }, [currentWordIndex, isTyping]);
  
    return (
      <header className="w-full bg-[#2A2A2A] border-b border-[#708090]/10">
        <div className="relative w-full overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#B0E0E6]/10 rounded-full blur-xl animate-float"/>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-[#708090]/10 rounded-full blur-xl animate-float-delayed"/>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B0E0E6]/10 to-transparent animate-scan"/>
          </div>
  
          {/* Content container */}
          <div className="relative z-10 max-w-[1600px] mx-auto p-6">
            <div className="flex items-center space-x-3">
              <div className="relative overflow-hidden h-12">
                <span className={`text-3xl font-bold text-[#F5F5F5] inline-block transform
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                  transition-all duration-500 ease-out`}>
                  {displayText}
                </span>
                <span className="inline-block w-0.5 h-8 bg-[#B0E0E6] ml-1 animate-blink"/>
              </div>
            </div>
            <p className="text-[#B0E0E6] mt-2">
              Real-time meme trend analysis
            </p>
          </div>
  
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r 
            from-transparent via-[#708090]/20 to-transparent"/>
        </div>
      </header>
    );
  };
  
  // Add these animations to your tailwind.config.js
  const tailwindConfig = `
    module.exports = {
      theme: {
        extend: {
          animation: {
            float: 'float 6s ease-in-out infinite',
            'float-delayed': 'float 6s ease-in-out 3s infinite',
            scan: 'scan 4s ease-in-out infinite',
            blink: 'blink 1s step-end infinite',
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(-20px) scale(1.1)' },
            },
            scan: {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
            blink: {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0 },
            },
          },
        },
      },
    }
  `;
export default AnimatedTitle;
