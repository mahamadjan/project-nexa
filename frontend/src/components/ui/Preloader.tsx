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

    // Controlled 6 second majestic loading sequence (6000ms)
    // 6000 / 100 = 60ms per step
    const totalTime = 6000;
    const intervalTime = 60; 
    const increment = 1;

    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('nexa_preloaded', 'true');
          // Slow majestic exit delay
          setTimeout(() => setIsLoading(false), 1200);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  const letterVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(30px)', scale: 1.1 },
    visible: (i: number) => ({
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)', 
      scale: 1,
      transition: { 
        delay: i * 0.6, // Slow 0.6s gap between letters
        duration: 2.5, // Slow 2.5s reveal duration
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100vh', 
            transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.5 } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Deep Cinematic Atmosphere */}
          <div className="absolute inset-0 bg-[#020202]" />
          <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-blue-600/5 blur-[150px] rounded-full translate-y-1/2" />
          
          <div className="relative flex flex-col items-center">
             
             {/* THE MAJESTIC LOGO REVEAL */}
             <div className="relative mb-24 flex items-center justify-center">
                <div className="flex gap-4 md:gap-10 overflow-hidden py-8">
                   {['N', 'E', 'X', 'A'].map((l, i) => (
                      <motion.span
                        key={i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className={`text-7xl md:text-[14rem] font-black tracking-tighter transition-all duration-1000
                          ${l === 'X' ? 'text-blue-500 drop-shadow-[0_0_80px_rgba(59,130,246,0.4)]' : 'text-white'}`}
                      >
                        {l}
                      </motion.span>
                   ))}
                </div>

                {/* Slow Scanning Nebula */}
                <motion.div 
                   animate={{ left: ['-20%', '120%'], opacity: [0, 0.3, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                   className="absolute top-0 bottom-0 w-8 md:w-32 bg-blue-500/20 blur-[100px] pointer-events-none"
                />
             </div>

             {/* Minimalist Tech Progress Bar */}
             <div className="relative flex flex-col items-center gap-12 w-full max-w-xl">
                <div className="relative w-full h-[1px] bg-white/5">
                   <motion.div 
                      className="absolute inset-y-0 left-0 bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ ease: "linear" }}
                      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}
                   />
                </div>

                <div className="flex flex-col items-center gap-4">
                   <div className="flex items-center gap-4">
                      <motion.div 
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" 
                      />
                      <p className="text-[10px] md:text-sm font-black tracking-[1.2em] text-white/20 uppercase">
                         NEXA ENGINE INITIALIZING
                      </p>
                   </div>
                   <div className="overflow-hidden h-16 flex items-center justify-center">
                      <motion.p 
                        key={percent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-4xl md:text-7xl font-black text-blue-500 tracking-tighter"
                      >
                        {percent}%
                      </motion.p>
                   </div>
                </div>
             </div>

          </div>

          {/* Majestic Transition Mask */}
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={percent >= 100 ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-white z-20 pointer-events-none mix-blend-difference origin-top"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
