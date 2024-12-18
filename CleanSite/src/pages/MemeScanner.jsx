import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useMemeScanner } from '../hooks/useMemeScanner';
import memeData from '../data/meme_data.json';
import AnimatedBackground from '../components/AnimatedBackground';

// Import components
import StatsOverview from '../components/MemeScanner/StatsOverview';
import SystemLogs from '../components/MemeScanner/SystemLogs';
import MemeAnalytics from '../components/MemeScanner/MemeAnalytics';

const MemeScannerPage = () => {
  const { data, error, currentMeme, ROTATION_INTERVAL } = useMemeScanner(memeData);

  // Loading state
  if (!data) {
    return (
      <div className="min-h-screen relative lg:ml-[240px]">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="p-6 bg-black/50 backdrop-blur-sm text-emerald-400 rounded-lg flex items-center gap-2">
            <Clock className="w-5 h-5 animate-spin" />
            <span>Initializing meme scanner...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative lg:ml-[240px]">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="p-6 bg-black/50 backdrop-blur-sm text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative lg:ml-[240px]">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Page Header */}
        <header className="backdrop-blur-sm border-b border-emerald-900/30 p-6 mt-[76px] lg:mt-0">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-bold text-emerald-100">Meme Scanner</h1>
            <p className="text-emerald-300/70 mt-1">Real-time meme trend analysis</p>
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
        <footer className="bg-black/50 backdrop-blur-sm border-t border-emerald-900/30 p-4">
          <div className="max-w-[1600px] mx-auto text-center text-sm text-emerald-300/70">
            <p>Monitoring {data.metadata.total_memes} memes across multiple platforms</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MemeScannerPage;