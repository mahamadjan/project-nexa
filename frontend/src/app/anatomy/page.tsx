'use client';
import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Cpu, Zap, Battery, Database, Shield, Target, Layers, Radio, Globe, Activity, Terminal, Share2, Infinity as InfinityIcon } from 'lucide-react';
import { SandText } from '@/components/ui/SandText';
import { useTheme } from '@/context/ThemeContext';

const FEATURES = [
  { 
    id: 'cpu', icon: Cpu, name: 'NEURO-CORE I9', label: 'ARCHITECTURE GEN 14', 
    desc: 'Бионический процессор. 24 ядра чистой воли. Умное распределение энергии между P-ядрами и E-ядрами.', 
    color: '#3b82f6', 
    stats: ['24 CORES', '5.8 GHz', '36MB L3', '10nm ++']
  },
  { 
    id: 'gpu', icon: Zap, name: 'LIGHTNING GPU', label: 'RTX 4090 MOBILE', 
    desc: 'Визуальный шторм. 16ГБ видеопамяти. Каждое зерно трассировки лучей просчитывается с точностью до нанометра.', 
    color: '#10b981', 
    stats: ['16GB VRAM', 'DLSS 3.5', '175W TGP', 'AI ACCEL']
  },
  { 
    id: 'cooling', icon: Shield, name: 'CRYOGENIC SYS', label: 'LIQUID METAL 4.0', 
    desc: 'Абсолютный ноль. Жидкий металл Thermal Grizzly в венах охлаждения для мгновенного отвода жара.', 
    color: '#ef4444', 
    stats: ['-15°C DROP', 'VAPOR CHAMBER', 'DB QUIET', '4 FANS']
  },
  { 
    id: 'ram', icon: Database, name: 'OVERSPEED RAM', label: '64GB DDR5 X-SPEED', 
    desc: 'Память без границ. Мгновенная реакция. Частота 5600 МГц позволяет работать с файлами любого размера.', 
    color: '#a855f7', 
    stats: ['5600 MHz', 'CL40 LAT', 'DUAL CHN', 'ECC SUPP']
  },
  { 
    id: 'matrix', icon: Layers, name: 'X-REAL OLED', label: '4K CALIBRATED', 
    desc: 'Матрица правды. Миллионы живых пикселей. Охват Adobe RGB 100% для профессиональной цветокоррекции.', 
    color: '#f59e0b', 
    stats: ['1000 NITS', '0.1ms RT', '10-BIT', 'HDR10+']
  },
];

const TechNode = React.memo(({ f, index }: { f: typeof FEATURES[0], index: number }) => {
  const { theme } = useTheme();
  const Icon = f.icon;
  const isEven = index % 2 === 0;

  return (
    <section className={`group relative py-16 md:py-32 flex flex-col md:flex-row items-center gap-12 md:gap-32 
        ${isEven ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}>
       
       {/* Hover Sub-Glow (Desktop Only since mobile has no hover) */}
       <div 
          className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] blur-[150px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none transform-gpu"
          style={{ background: f.color }}
       />

       <div className="relative w-56 h-56 md:w-[450px] md:h-[450px] shrink-0 preserve-3d">
          <motion.div
            animate={{ 
              rotateY: [0, 20, 0, -20, 0],
              rotateX: [0, -15, 0, 15, 0],
              y: [0, -25, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: 'transform' }}
            className={`w-full h-full rounded-full border-2 border-current/20 flex items-center justify-center relative z-20 overflow-hidden transform-gpu
              ${isEven ? 'rounded-tr-[6rem] md:rounded-tr-[12rem]' : 'rounded-tl-[6rem] md:rounded-tl-[12rem]'}`}
          >
             <div className="absolute inset-0 bg-current/[0.03] md:backdrop-blur-sm" />
             <Icon style={{ color: f.color }} className="md:drop-shadow-[0_0_30px_rgba(var(--tw-shadow-color),0.5)] z-10 w-20 h-20 md:w-32 md:h-32 transform-gpu" />
             
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[90%] h-[90%] border border-current rounded-full animate-[spin_12s_linear_infinite]" />
                <div className="w-[85%] h-[85%] border-t-2 border-current rounded-full animate-[spin_6s_linear_infinite_reverse]" />
                <div className="w-[80%] h-[80%] border-2 border-dashed border-current/10 rounded-full animate-[spin_20s_linear_infinite]" />
             </div>
          </motion.div>
          {/* Static minimal glow on mobile. Pulse animation only on desktop to save battery */}
          <div className="absolute inset-10 blur-[40px] md:blur-[80px] opacity-[0.05] md:animate-pulse rounded-full transform-gpu" style={{ background: f.color }} />
       </div>

       <div className="relative z-10 max-w-xl w-full">
          <div className="space-y-0">
             <div className={`flex items-center gap-3 mb-6 ${!isEven ? 'md:justify-end' : ''}`}>
                <Activity size={12} className="text-blue-500 md:w-3.5 md:h-3.5" />
                <span className="text-blue-500 font-bold text-[9px] md:text-[10px] tracking-[0.5em] uppercase">INTERNAL_SYS_LOG_{index + 1}</span>
             </div>

             <div className="mb-4 md:mb-8 w-full scale-[0.55] md:scale-90 origin-left h-[100px] md:h-auto flex items-center transform-gpu">
                <SandText text={f.name.replace(/[ -]/g, '\n')} />
             </div>

             <div className="relative p-6 md:p-10 border-t border-b border-current/10 md:backdrop-blur-md overflow-hidden bg-current/[0.03] md:bg-current/[0.01]">
                {/* CPU-Light Scanner Line */}
                <motion.div 
                   animate={{ y: ['-100%', '1000%'] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                   className="absolute left-0 top-0 w-full h-px bg-current/20 pointer-events-none transform-gpu will-change-transform" 
                />
                
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-30">{f.label}</p>
                <p className="text-sm md:text-2xl font-light leading-relaxed tracking-tight mb-8 md:mb-12 opacity-80">
                  {f.desc}
                </p>

                <div className={`grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-12 ${!isEven ? 'md:text-right md:justify-items-end' : ''}`}>
                   {f.stats.map((s, si) => (
                      <div key={si} className="space-y-0.5 md:space-y-1">
                         <div className="flex items-center gap-1.5 md:gap-2 opacity-40">
                            <Terminal size={10} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">METRICA_{si + 1}</span>
                         </div>
                         <p className="text-base md:text-2xl font-black tracking-tighter" style={{ color: f.color }}>{s}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </section>
  );
});

TechNode.displayName = 'TechNode';

export default function AnatomyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative selection:bg-blue-500 overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentColor 0.5px, transparent 0)', backgroundSize: '60px 60px' }} />
         <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-blue-500/[0.02] via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
         
         <div className={`hidden xl:flex fixed left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-12 z-50 py-16 px-1 border-l border-current/5`}>
            <p className="text-[8px] font-black vertical-text tracking-[1em] opacity-30 uppercase">DEEP EXPLORER v1.2</p>
            <div className="w-0.5 flex-1 bg-current/5 relative">
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: '33%' }}
                 className="absolute top-0 w-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
               />
            </div>
            <Globe size={16} className="opacity-20 animate-[spin_8s_linear_infinite]" />
         </div>

         <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
            <Link href="/" className="absolute top-12 left-10 group flex items-center gap-4 py-3 px-8 rounded-2xl border border-current/10 hover:bg-current/5 hover:border-current/30 transition-all duration-500 backdrop-blur-xl">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-widest">EXIT_STATION</span>
            </Link>

            <div className="relative">
               <SandText text={"NEXA\nCORE"} />
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="mt-16 flex flex-col items-center gap-10"
               >
                  <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.8em] opacity-30 mt-4">INITIATING DEEP SCAN PROTOCOL... SUCCESSFUL</p>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                     <span className="text-[8px] font-mono opacity-40">SYSTEM: OPERATIONAL_v4.2.0</span>
                  </div>
                  <motion.div 
                    animate={{ y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-[1.5px] h-32 bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent" 
                  />
               </motion.div>
            </div>
         </section>

         <div className="max-w-7xl mx-auto px-6 pb-64">
            {FEATURES.map((f, i) => (
               <TechNode key={f.id} f={f} index={i} />
            ))}
         </div>

         <section className="py-64 px-6 text-center bg-gradient-to-t from-current/[0.03] to-transparent">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto"
            >
               <h2 className="text-7xl md:text-[14rem] font-black tracking-tighter leading-none uppercase mb-16 italic opacity-90 drop-shadow-2xl">NEXA</h2>
               <div className="inline-flex items-center gap-6 mb-24 px-8 py-3 rounded-full border border-current/10 font-black uppercase tracking-[0.4em] text-[10px] opacity-40 hover:opacity-80 transition-all cursor-default">
                  <InfinityIcon size={14} className="text-blue-500" /> SYSTEM STATUS: INFINITE PERFORMANCE
               </div>
               
               <div className="flex flex-col items-center">
                  <Link href="/catalog" className={`group relative w-full max-w-sm md:max-w-2xl aspect-[3/1] md:aspect-[5/1] rounded-3xl overflow-hidden shadow-2xl transition-all active:scale-95 duration-500 border-2 ${isDark ? 'border-white bg-zinc-900/90' : 'border-black bg-zinc-100/90'}`}>
                     <div className="absolute inset-0 bg-blue-600 sm:translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-10" />
                     <div className="relative z-20 h-full flex items-center justify-center gap-6">
                        <span className={`text-xl md:text-4xl font-black uppercase tracking-[0.6em] transition-colors duration-500 ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-white'}`}>
                           В КАТАЛОГ
                        </span>
                        <Share2 size={24} className={`transition-colors duration-500 ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-white'}`} />
                     </div>
                  </Link>
               </div>
            </motion.div>
         </section>

      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
}
