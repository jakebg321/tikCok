import { useState, useEffect, useRef } from 'react';
import { processMemeData, getRotatingLogs } from '../utils/memeParser';

export const useMemeScanner = (initialData) => {
  const [data, setData] = useState(() => processMemeData(initialData));
  const [error, setError] = useState(null);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const memeRotationRef = useRef(null);
  const ROTATION_INTERVAL = 8000; // 10 seconds

  useEffect(() => {
    if (!data?.memes) return;

    // Clear any existing interval
    if (memeRotationRef.current) {
      clearInterval(memeRotationRef.current);
    }

    // Setup meme rotation
    memeRotationRef.current = setInterval(() => {
      setCurrentMemeIndex(prev => (prev + 1) % data.memes.length);
      
      // Update logs with current meme context
      setData(currentData => {
        const nextIndex = (currentMemeIndex + 1) % data.memes.length;
        const currentMeme = currentData.memes[nextIndex];
        
        return {
          ...currentData,
          currentMeme,
          logs: getRotatingLogs(currentMeme.title) // Pass current meme title to log generator
        };
      });
    }, ROTATION_INTERVAL);

    return () => {
      if (memeRotationRef.current) {
        clearInterval(memeRotationRef.current);
      }
    };
  }, [data?.memes]);

  const getCurrentMeme = () => {
    if (!data?.memes?.length) return null;
    return data.memes[currentMemeIndex];
  };

  return {
    data,
    error,
    currentMeme: getCurrentMeme(),
    currentMemeIndex,
    ROTATION_INTERVAL
  };
};