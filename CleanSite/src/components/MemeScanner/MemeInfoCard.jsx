import React from 'react';

const MemeInfoCard = ({ meme }) => {
  if (!meme?.usage_data?.captions) return null;

  const latestUsage = meme.usage_data.captions[meme.usage_data.captions.length - 1] || 0;
  const previousUsage = meme.usage_data.captions[meme.usage_data.captions.length - 2] || 0;
  const growth = previousUsage > 0 ? ((latestUsage - previousUsage) / previousUsage * 100).toFixed(1) : 0;

  return (
    <div className="bg-[#F5F5F5] p-4 rounded-lg shadow-md mb-4 border border-[#708090]/20">
      <h3 className="font-semibold text-lg mb-2 text-[#4A4A4A]">{meme.title}</h3>
      <div className="text-sm text-[#708090]">
        <p>Latest Usage: {latestUsage.toLocaleString()} Variations</p>
        <p>Monthly Growth: {growth}%</p>
        {meme.url && (
          <p className="text-xs mt-2">
            <a 
              href={meme.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#708090] hover:text-[#B0E0E6]"
            >
              View Source
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default MemeInfoCard;