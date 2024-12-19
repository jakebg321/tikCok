import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, trend, subtitle }) => (
  <div className="relative overflow-hidden bg-[#F5F5F5] p-6 rounded-lg 
    border border-[#708090]/20 transition-all duration-300 hover:shadow-lg group">
    
    {/* Background decorative elements using existing colors */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0E0E6]/10 rounded-full -mr-16 -mt-16" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#708090]/10 rounded-full -ml-12 -mb-12" />
    
    <div className="relative flex items-center gap-4">
      {/* Icon container using existing color scheme */}
      <div className="p-4 rounded-lg bg-[#B0E0E6]/20 
        group-hover:bg-[#B0E0E6]/30 transition-all duration-300">
        <Icon className="w-8 h-8 text-[#708090] group-hover:text-[#4A4A4A] 
          transition-all duration-300" />
      </div>

      <div className="flex-1">
        {/* Title using existing text color */}
        <h3 className="text-sm font-medium text-[#708090]">
          {title}
        </h3>
        
        {/* Value with enhanced styling but using existing colors */}
        <p className="text-2xl font-bold text-[#4A4A4A] mt-1">
          {value.toLocaleString()}
        </p>
        
        {/* Trend indicator using existing color scheme */}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full 
              bg-[#B0E0E6]/20 text-xs text-[#708090]">
              <TrendingUp className="w-3 h-3" />
              <span>{trend}% increase</span>
            </div>
          </div>
        )}
        
        {/* Subtitle using existing text color */}
        {subtitle && (
          <p className="text-xs text-[#708090] mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);


export default StatsCard;