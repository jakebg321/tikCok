import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, trend, subtitle }) => (
  <div className="bg-[#F5F5F5] p-4 rounded-lg shadow-md border border-[#708090]/20 
    transition-all duration-300 hover:shadow-lg hover:scale-[1.02] 
    hover:border-[#B0E0E6]/40 group">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-[#B0E0E6]/30 to-[#708090]/10
        group-hover:from-[#B0E0E6]/40 group-hover:to-[#708090]/20 
        transition-all duration-300">
        <Icon className="w-7 h-7 text-[#708090] group-hover:text-[#4A4A4A] 
          transition-all duration-300 group-hover:rotate-[360deg]" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#708090] font-medium">{title}</p>
        <p className="text-2xl font-semibold text-[#4A4A4A] tracking-tight">
          {value.toLocaleString()}
        </p>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-[#708090]">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}% increase</span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-[#708090]/80 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export default StatsCard;