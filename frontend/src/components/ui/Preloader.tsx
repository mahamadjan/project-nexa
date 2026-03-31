'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Check if already preloaded in this session
    const hasPreloaded = sessionStorage.getItem('nexa_preloaded');
    if (hasPreloaded) return;

    setIsLoading(true);

    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('nexa_preloaded', 'true');
          setTimeout(() => setIsLoading(false), 800); 
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100vh', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-primary)] overflow-hidden"
        >
          {/* Theme-aware Liquid Background Shadow */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/10 blur-3xl" />
          
          <div className="relative flex flex-col items-center">
             <div className="relative mb-12">
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0, filter: 'blur(30px)' }}
                   animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                   transition={{ duration: 1.2, ease: "easeOut" }}
                   className="text-6xl md:text-9xl font-black tracking-[0.2em] text-[var(--text-primary)] flex items-center gap-1"
                >
                   <span>N</span>
                   <span>E</span>
                   <span className="text-blue-500">X</span>
                   <span>A</span>
                </motion.div>
                
                {/* Floating liquid drops around the logo */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 2 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"
                />
             </div>

             {/* Dynamic Percentage Line */}
             <div className="relative w-48 md:w-64 h-px bg-white/10 overflow-hidden rounded-full">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${percent}%` }}
                   className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                />
             </div>
             
             <div className="mt-6 flex items-center gap-4 overflow-hidden h-6">
                <motion.p 
                   initial={{ y: 20 }}
                   animate={{ y: 0 }}
                   className="text-[10px] md:text-xs font-black tracking-[0.5em] uppercase text-white/40"
                >
                   INITIALIZING SYSTEM
                </motion.p>
                <p className="text-[10px] md:text-xs font-black text-blue-500 tracking-widest leading-none">
                   {Math.min(percent, 100)}%
                </p>
             </div>
          </div>

          {/* Liquid Mask - Slides down when complete */}
          <motion.div 
            initial={{ height: '0%' }}
            animate={percent >= 100 ? { height: '100%' } : { height: '0%' }}
            className="absolute inset-0 bg-blue-600/5 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
