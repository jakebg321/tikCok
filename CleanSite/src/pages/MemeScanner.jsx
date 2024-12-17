import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useMemeScanner } from '../hooks/useMemeScanner';
import memeData from '../data/meme_data.json';

// Import components
import StatsOverview from '../components/MemeScanner/StatsOverview';
import SystemLogs from '../components/MemeScanner/SystemLogs';
import MemeAnalytics from '../components/MemeScanner/MemeAnalytics';
import AnimatedTitle from '../components/MemeScanner/AnimatedTitle';
const MemeScannerPage = () => {
  const { data, error, currentMeme, ROTATION_INTERVAL } = useMemeScanner(memeData);

  // Loading state
  if (!data) {
    return (
      <div className="min-h-screen lg:ml-[15%] flex items-center justify-center">
        <div className="p-6 bg-[#B0E0E6]/20 text-[#708090] rounded-lg flex items-center gap-2">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Initializing meme scanner...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen lg:ml-[15%] flex items-center justify-center">
        <div className="p-6 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-[15%]">
      {/* Page Header */}
      <header className="border-b border-[#708090]/10 p-6">
  <div className="max-w-[1600px] mx-auto">
    <AnimatedTitle />
    <p className="text-[#708090] mt-1">Real-time meme trend analysis</p>
  </div>
</header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Stats Cards */}
          <section>
            <StatsOverview data={data} />
          </section>

          {/* Main Dashboard */}
          <section className="flex flex-col lg:flex-row gap-6">
            {/* System Logs */}
            <SystemLogs data={data} />
            
            {/* Meme Analytics */}
            <MemeAnalytics 
              currentMeme={currentMeme} 
              rotationInterval={ROTATION_INTERVAL} 
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#708090]/10 p-4">
        <div className="max-w-[1600px] mx-auto text-center text-sm text-[#708090]">
          <p>Monitoring {data.metadata.total_memes} memes across multiple platforms</p>
        </div>
      </footer>
    </div>
  );
};

export default MemeScannerPage;