'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const HorizontalScrollCarousel = ({ features }: { features: any[] }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black text-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Background glow that follows scroll - Hardware Accelerated */}
        <div className="absolute inset-0 pointer-events-none w-full h-full flex items-center justify-center opacity-30">
           <div className="w-[50vw] h-[50vw] bg-blue-600 rounded-full blur-[100px] sm:blur-[150px] mix-blend-screen transform-gpu will-change-transform" />
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-4 md:px-20 relative z-10 w-max will-change-transform">
          
          {/* Intro Card */}
          <div className="w-[90vw] md:w-[60vw] h-[60vh] md:h-[70vh] flex flex-col justify-center shrink-0">
             <p className="text-blue-500 font-mono tracking-widest text-sm mb-4">БЕЗ КОМПРОМИССОВ</p>
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-white translate-z-0">
               Создан для<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 transform-gpu">Абсолюта.</span>
             </h2>
             <p className="text-xl md:text-2xl text-gray-400 max-w-xl font-light">
               Каждый компонент оптимизирован для достижения максимальной производительности. 
               Архитектура, не знающая пределов.
             </p>
          </div>

          {/* Cards */}
          {features.map((f, i) => (
            <div 
              key={i} 
              className="w-[80vw] md:w-[45vw] h-[60vh] md:h-[70vh] flex flex-col justify-between shrink-0 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group glass-dark transition-transform"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`} />
              <div className="relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono mb-8 bg-white/5 text-gray-300 border border-white/10 uppercase tracking-widest mix-blend-screen">
                  {f.tag}
                </span>
                <h3 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">{f.title}</h3>
                <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">{f.desc}</p>
              </div>
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                 <ArrowRight className="text-white" />
              </div>
            </div>
          ))}

          {/* End spacing */}
          <div className="w-[10vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
};

export const StickyTextReveal = ({ specs }: { specs: any[] }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Calculate opacity for different lines based on scroll
  const opacity1 = useTransform(scrollYProgress, [0.1, 0.2], [0.1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.35], [0.1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.5], [0.1, 1]);
  
  const y1 = useTransform(scrollYProgress, [0.1, 0.2], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.35], [50, 0]);
  const y3 = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);
  
  const specsOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const specsY = useTransform(scrollYProgress, [0.65, 0.8], [50, 0]);

  return (
    <section ref={container} className="relative h-[250vh] bg-black text-white w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
         {/* Background video simulation / blurred orb - Optimized */}
         <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
            <motion.div 
               style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.8, 0]) }}
               className="w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 blur-[80px] sm:blur-[120px] transform-gpu will-change-transform" 
            />
         </div>

         <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-4 md:gap-8 text-center mt-[-10vh]">
            <motion.h2 style={{ opacity: opacity1, y: y1 }} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight transform-gpu will-change-transform">
              Производительность,
            </motion.h2>
            <motion.h2 style={{ opacity: opacity2, y: y2 }} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600 transform-gpu will-change-transform">
              Которая меняет
            </motion.h2>
            <motion.h2 style={{ opacity: opacity3, y: y3 }} className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-blue-500">
              Правила Игры.
            </motion.h2>
         </div>

         {/* Specs Grid at the end of scroll */}
         <motion.div 
           style={{ opacity: specsOpacity, y: specsY }}
           className="absolute bottom-10 md:bottom-24 left-0 right-0 w-full px-4 md:px-20 z-20"
         >
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
             {specs.map((spec, i) => (
               <div key={i} className="rounded-2xl p-6 hover:bg-white/5 transition-colors border" style={{ background: 'rgba(20,20,20,0.8)', borderColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                 <p className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">{spec.label}</p>
                 <p className="text-2xl md:text-3xl font-bold text-white mb-1">{spec.value}</p>
                 <p className="text-sm text-blue-400">{spec.sub}</p>
               </div>
             ))}
           </div>
         </motion.div>
      </div>
    </section>
  );
};
