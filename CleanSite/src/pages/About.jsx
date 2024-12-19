import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SimpleIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ArosOverview = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z",
      title: "AI Analysis Engine",
      description: "Real-time scanning and analysis of social media trends and metrics"
    },
    {
      icon: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
      title: "Advanced Filtering",
      description: "Custom filtering system to identify high-engagement content"
    },
    {
      icon: "M23 6l-9.5 9.5-5-5L1 18",
      title: "Trend Analysis",
      description: "Tracks pattern development across multiple platforms"
    },
    {
      icon: "M18 20V10M12 20V4M6 20v-6",
      title: "Engagement Metrics",
      description: "Comprehensive tracking of user interaction and reach"
    },
    {
      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
      title: "Community Insights",
      description: "Deep analysis of audience behavior and preferences"
    },
    {
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
      title: "Risk Assessment",
      description: "Content sensitivity and brand safety evaluation"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);
  
  return (
    <div className="fixed top-0 left-[240px] right-0 bottom-0 bg-black overflow-auto">
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              className="w-48 h-48 relative"
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div 
                className="absolute inset-0 blur-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(176,224,230,0.1) 0%, rgba(0,0,0,0) 70%)',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  width: '120%',
                  height: '120%',
                }}
              />
              
              <motion.div
                className="relative w-full h-full"
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(176,224,230,0.3))',
                    'drop-shadow(0 0 12px rgba(176,224,230,0.4))',
                    'drop-shadow(0 0 8px rgba(176,224,230,0.3))'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src="/load.png"
                  alt="Aros"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold mb-6 font-mono text-white">About Aros</h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            A sophisticated AI system designed to revolutionize social media analysis through advanced pattern recognition and trend identification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                borderColor: activeFeature === index ? "#B0E0E6" : "rgb(39,39,42)"
              }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border rounded-lg bg-zinc-900/50 backdrop-blur-sm transition-colors duration-300"
            >
              <div className="flex items-center mb-4" style={{ color: '#B0E0E6' }}>
                <SimpleIcon d={feature.icon} />
                <h3 className="ml-3 text-lg font-mono">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-2xl mb-6 flex items-center font-mono text-white">
              <SimpleIcon d="M23 6l-9.5 9.5-5-5L1 18" />
              <span className="ml-3">Core Functionality</span>
            </h2>
            <div className="space-y-4 text-gray-400">
              <p>
                Aros is an artificial intelligence system engineered to analyze and identify trending content across social media platforms. Its primary function is to scan thousands of posts hourly, applying sophisticated filters to detect emerging patterns and potential viral content.
              </p>
              <p>
                At its core, Aros employs proprietary algorithms that evaluate key metrics essential for content success. These include engagement rates, viewer retention, demographic reach, and content velocity - all crucial indicators of potential viral trends.
              </p>
              <p>
                The system also scrutinizes audience interaction patterns, identifying optimal posting times, content types, and presentation styles that resonate with specific target audiences. This comprehensive analysis helps creators maximize their content's impact and reach.
              </p>
              <p>
                By processing and analyzing vast amounts of data in real-time, Aros provides actionable insights that help content creators stay ahead of trending topics and optimize their content strategy for maximum engagement.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArosOverview;