// src/components/MemeScanner/MemeAnalytics.jsx
import React from 'react';
import AnimatedBarChart from './AnimatedBarChart';
import MemeInfoCard from './MemeInfoCard';

const MemeAnalytics = ({ currentMeme, rotationInterval }) => (
  <div className="lg:w-3/3">
    <div className="bg-[#F5F5F5] rounded-lg shadow-md p-6 border border-[#708090]/20">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between text-[#4A4A4A]">
        Meme Analysis
        <span className="text-sm font-normal flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B0E0E6] animate-pulse"/>
          Live
        </span>
      </h2>
      {currentMeme && (
        <>
          <MemeInfoCard meme={currentMeme} />
          <AnimatedBarChart
            data={currentMeme}
            title={`Variations Found Over Time: ${currentMeme.title}`}
            rotationInterval={rotationInterval}
          />
        </>
      )}
    </div>
  </div>
);

export default MemeAnalytics;