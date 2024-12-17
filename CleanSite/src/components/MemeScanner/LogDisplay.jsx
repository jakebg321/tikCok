import React, { useState, useEffect, useRef } from 'react';

const LogDisplay = ({ logs = [], type }) => {  // Add default empty array
  const scrollRef = useRef(null);
  const [visibleLogs, setVisibleLogs] = useState([]);
  
  useEffect(() => {
    // Ensure logs is an array and has items before processing
    if (Array.isArray(logs) && logs.length > 0) {
      setVisibleLogs(prev => [...prev, ...logs].slice(-5));
      
      // Scroll to bottom after state update
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [logs]);

  return (
    <div className="bg-[#F5F5F5] rounded-lg p-4 border border-[#708090]/20">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#4A4A4A]">
        <span className="h-2 w-2 rounded-full bg-[#B0E0E6] animate-pulse"></span>
        {type || 'System Logs'}
      </h3>
      <div 
        ref={scrollRef}
        className="space-y-2 h-[150px] overflow-hidden"
      >
        {visibleLogs.length > 0 ? (
          visibleLogs.map((log, index) => (
            <p 
              key={`${index}-${log}`} 
              className="text-sm text-[#4A4A4A] border-l-2 border-[#B0E0E6] pl-2 animate-fade-in bg-[#F5F5F5]"
              style={{
                animation: 'slideIn 0.5s ease-out'
              }}
            >
              {log}
            </p>
          ))
        ) : (
          <p className="text-sm text-[#708090] italic">No logs available</p>
        )}
      </div>
    </div>
  );
};

export default LogDisplay;