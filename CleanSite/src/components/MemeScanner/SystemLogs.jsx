import React from 'react';
import LogDisplay from './LogDisplay';

const SystemLogs = ({ data }) => {
  // Ensure we have valid data objects with fallbacks
  const processingLogs = data?.processingLogs || [];
  const tiktokLogs = data?.logs?.tiktok || [];
  const youtubeLogs = data?.logs?.youtube || [];

  return (
    <div className="lg:w-1/3 space-y-4">
      <div className="bg-[#F5F5F5] rounded-lg shadow-md p-6 border border-[#708090]/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#4A4A4A]">
          System Logs
          <span className="h-2 w-2 rounded-full bg-[#B0E0E6] animate-pulse"/>
          <span className="text-xs font-normal text-[#708090] ml-2 flex items-center gap-1">
            Live
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#B0E0E6] animate-ping"/>
          </span>
        </h2>
        <div className="space-y-4">
          <LogDisplay logs={processingLogs} type="Processing Logs" />
          <LogDisplay logs={tiktokLogs} type="TikTok Scanner" />
          <LogDisplay logs={youtubeLogs} type="YouTube Scanner" />
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;