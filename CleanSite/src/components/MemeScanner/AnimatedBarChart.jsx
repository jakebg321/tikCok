import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gradient-to-br from-[#F5F5F5] to-[#F5F5F5]/95 
      px-4 py-3 rounded-lg shadow-lg border border-[#B0E0E6]/20">
      <p className="text-sm font-medium text-[#4A4A4A]">{label}</p>
      <p className="text-lg font-semibold text-[#708090]">
        {payload[0].value.toLocaleString()} captions
      </p>
    </div>
  );
};

const AnimatedBarChart = ({ data, title, rotationInterval }) => {
  const [visibleBars, setVisibleBars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (!data?.usage_data) return;
    
    // Reset state for new meme data
    setIsLoading(true);
    setVisibleBars([]);
    
    const totalBars = data.usage_data.dates.length;
    // Use 80% of rotation time for animation to ensure all bars are visible before next meme
    const delayPerBar = (rotationInterval * 0.8) / totalBars; 
    let currentBar = 0;
    
    // Clear any existing animation interval
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    // Start new animation sequence
    animationRef.current = setInterval(() => {
      if (currentBar < totalBars) {
        setVisibleBars(prev => [...prev, currentBar]);
        currentBar++;
      } else {
        clearInterval(animationRef.current);
        setIsLoading(false);
      }
    }, delayPerBar);
    
    // Cleanup on unmount or when data changes
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [data, rotationInterval]);

  if (!data?.usage_data) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-[#F5F5F5] rounded-lg border border-[#708090]/20">
        <div className="text-center text-[#708090]">
          <div className="mb-2">Loading next meme...</div>
          <div className="animate-spin h-8 w-8 border-4 border-[#B0E0E6] border-t-transparent rounded-full mx-auto"/>
        </div>
      </div>
    );
  }

  // Transform data to show only visible bars
  const chartData = data.usage_data.dates.map((date, i) => ({
    date: visibleBars.includes(i) ? date : '',
    captions: visibleBars.includes(i) ? data.usage_data.captions[i] : 0
  }));

  return (
    <div className="h-[400px] w-full">
      <h3 className="text-lg font-semibold mb-4 text-[#4A4A4A] flex items-center justify-between">
        <span className="flex items-center gap-2">
          {title}
          <span className="text-xs text-[#708090] font-normal">
            Last 30 days
          </span>
        </span>
        <span className="text-sm font-normal flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B0E0E6] animate-pulse"/>
          {isLoading ? 'Loading data...' : 'Live'}
        </span>
      </h3>
      <div className="relative h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B0E0E6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#B0E0E6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#708090" 
              opacity={0.2}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              fontSize={12}
              stroke="#4A4A4A"
              interval={2}
              tick={{ fill: '#708090' }}
            />
            <YAxis 
              fontSize={12}
              stroke="#4A4A4A"
              tick={{ fill: '#708090' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="captions" 
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300 hover:opacity-90"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnimatedBarChart;