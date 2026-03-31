'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const HeroLaptop = dynamic(() => import('@/components/3d/HeroLaptop'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>
});

import { Cpu, Zap, Shield, Star, ArrowRight, Battery, Database, Globe, MousePointer2, MapPin, Phone, Mail, Laptop, X, ChevronDown, ChevronUp, Plus, LayoutGrid, Info, ArrowUpRight } from 'lucide-react';
import { SandText } from '@/components/ui/SandText';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { 
    id: 'f1', title: 'Игровой Монстр', desc: 'RTX 4090. Жидкий металл.', color: '#3b82f6', tag: 'ГЕЙМИНГ', icon: Zap,
    details: '175W TGP. Жидкий металл Conductonaut Extreme. 144+ FPS в 4K разрешении.',
    stats: ['GPU: RTX 4090 16GB', 'Cooling: Liquid Metal', 'Level: Extreme']
  },
  { 
    id: 'f2', title: 'Для Профи', desc: 'Adobe RGB. TB4. 128GB RAM.', color: '#a855f7', tag: 'ПРОФИ', icon: Laptop,
    details: 'SD Express 7.0. Цветопередача Delta E < 1.0. Поддержка трех 8K мониторов.',
    stats: ['Display: 100% Adobe RGB', 'IO: Thunderbolt 4', 'RAM: Expandable']
  },
  { 
    id: 'f3', title: 'Автономия', desc: '99.9 Втч. Зарядка 100W.', color: '#f97316', tag: 'ЭНЕРГИЯ', icon: Battery,
    details: 'До 14 часов работы. Умная балансировка ядер. GaN зарядка в комплекте.',
    stats: ['Capacity: 99.9 Wh', 'FastCharge: 100W', 'Type: Li-Polymer']
  },
  { 
    id: 'f4', title: 'Премиум', desc: 'CNC Алюминий. MIL-SPEC.', color: '#ec4899', tag: 'КАЧЕСТВО', icon: Shield,
    details: 'Сталь MIL-STD-810H. ЧПУ обработка. Устойчивое к отпечаткам покрытие.',
    stats: ['Body: CNC Aluminum', 'Standard: MIL-SPEC', 'Finish: Nano-coat']
  }
];

const SPECS_DATA = [
  { 
    id: 'cpu', icon: Cpu, label: 'Процессор', value: 'i9-14900HX', sub: '5.8 GHz',
    details: 'Intel Core i9-14900HX — это квинтэссенция вычислительной мощности. С 24 ядрами и 32 потоками, он справляется с любой задачей мгновенно. Кэш L3 объемом 36 МБ обеспечивает идеальную архитектуру для гейминга.',
    insight: 'Поддержка передовых ИИ-алгоритмов прямо "из коробки".'
  },
  { 
    id: 'gpu', icon: Zap, label: 'Графика', value: 'RTX 4090', sub: '16GB VRAM',
    details: 'NVIDIA RTX 4090 — самая мощная мобильная графика. Архитектура Ada Lovelace дает невероятный прирост производительности с технологией DLSS 3.5. 16 ГБ GDDR6X памяти для любых текстур и 8K контента.',
    insight: 'Второе поколение трассировки лучей в реальном времени.'
  },
  { 
    id: 'ram', icon: Database, label: 'Память', value: '64GB DDR5', sub: '5600 MT/s',
    details: '64 ГБ DDR5 5600 МГц — это полная свобода в многозадачности. Открывайте сотни вкладок, запускайте виртуальные машины и тяжелые IDE одновременно без малейших задержек или падения производительности.',
    insight: 'Двухканальный режим работы для максимальной пропускной способности.'
  },
  { 
    id: 'screen', icon: Shield, label: 'Дисплей', value: '16" 4K LED', sub: '144Hz',
    details: 'Экран Nexa — это окно в идеальную реальность. 4K разрешение и 144 Гц плавности. 1000 нит яркости и 100% охват DCI-P3 для эталонной цветопередачи и профессиональной работы с цветом.',
    insight: 'Сертифицировано Pantone и HDR10+ для идеальной картинки.'
  }
];

const TESTIMONIALS = [
  { name: 'Алекс Р.', role: 'Про-геймер', text: 'Абсолютно уничтожает любые бенчмарки. Стоит каждого рубля.', rating: 5 },
  { name: 'Сара К.', role: '3D Художник', text: 'Время рендеринга сократилось вдвое. Это просто безумие какое-то.', rating: 5 },
  { name: 'Марк Т.', role: 'Программист', text: 'Лучшее время работы от батареи для ноутбука с такой производительностью.', rating: 5 },
];

function SpecRowCard({ spec }: { spec: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="glass-dark border border-[var(--glass-border)] rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 flex flex-col relative z-20 cursor-pointer overflow-hidden group shadow-xl transform-gpu will-change-transform h-auto"
      animate={{ 
        borderColor: isExpanded ? 'var(--text-accent)' : 'var(--glass-border)',
        scale: isExpanded ? 1.01 : 1
      }}
      transition={{ duration: 3.5, ease: [0.1, 1, 0.2, 1] }}
    >
       <div className="flex items-center gap-3 md:gap-8">
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-[0.8rem] md:rounded-[1.5rem] flex items-center justify-center bg-blue-500/10 text-blue-500 shrink-0">
             <spec.icon className="w-5 h-5 md:w-8 md:h-8" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-[8px] md:text-[11px] font-black uppercase tracking-widest mb-1 opacity-40 text-[var(--text-muted)] truncate">NEXA {spec.label}</p>
             <h3 className="text-sm md:text-3xl font-black uppercase tracking-tight leading-none truncate">{spec.value}</h3>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 3.5, ease: [0.1, 1, 0.2, 1] }} className="text-blue-500/30">
             <ChevronDown size={18} />
          </motion.div>
       </div>

       <p className="text-[8px] md:text-xs font-bold mt-2 md:mt-4 text-blue-500 tracking-widest uppercase md:pl-[96px] whitespace-nowrap overflow-hidden text-ellipsis">{spec.sub}</p>

       <AnimatePresence>
          {isExpanded && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 3.0, ease: [0.1, 1, 0.2, 1] }}
               className="overflow-hidden"
            >
               <div className="pt-4 md:pt-8 border-t border-[var(--glass-border)] mt-4">
                 <p className="text-[12px] md:text-[16px] leading-relaxed text-[var(--text-primary)] mb-6 font-medium">
                    {spec.details}
                 </p>
                 <div className="p-3 md:p-6 bg-white/5 rounded-2xl border border-blue-500/10 flex items-center gap-3 md:gap-5">
                    <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[9px] md:text-sm font-bold text-blue-500 tracking-tight">{spec.insight}</p>
                 </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </motion.div>
  );
}

function SquareUnfoldCard({ f }: { f: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="glass-dark border border-[var(--glass-border)] rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 flex flex-col relative z-20 cursor-pointer overflow-hidden group shadow-xl transform-gpu will-change-transform h-fit"
      animate={{ 
        borderColor: isOpen ? 'var(--text-accent)' : 'var(--glass-border)',
        backgroundColor: isOpen ? 'rgba(5,5,5,1)' : 'rgba(15,15,15,0.4)',
        scale: isOpen ? 1.01 : 1
      }}
      transition={{ duration: 3.5, ease: [0.1, 1, 0.2, 1] }}
    >
       <div className="relative z-10 shrink-0">
          <div className="flex items-center gap-3 md:gap-5 mb-4 md:mb-8">
             <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-[1.2rem] flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <f.icon className="w-4 h-4 md:w-7 md:h-7" />
             </div>
             <div className="flex-1 h-px bg-white/10" />
          </div>
          
          <h3 className="text-[11px] md:text-2xl font-black uppercase tracking-tighter leading-tight text-white">{f.title}</h3>
          <p className="text-[7px] md:text-[10px] font-black text-blue-500 mt-1.5 uppercase tracking-widest">{f.tag}</p>
          
          {!isOpen && (
            <p className="text-[9px] md:text-[13px] font-bold text-white/40 leading-tight uppercase line-clamp-2 mt-4">
               {f.desc}
            </p>
          )}
       </div>

       <AnimatePresence>
          {isOpen && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 1.5, ease: [0.1, 1, 0.2, 1] }}
               className="overflow-hidden"
            >
               <div className="pt-6 md:pt-10 border-t border-white/10 mt-6 md:mt-8">
                 <p className="text-[11px] md:text-[15px] leading-relaxed font-bold text-white uppercase mb-6 border-l-2 border-blue-500 pl-4">
                    {f.details}
                 </p>
                 <div className="flex flex-col gap-3">
                    {f.stats.map((s: string, idx: number) => (
                       <div key={idx} className="flex items-center gap-3 opacity-60">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest">{s}</span>
                       </div>
                    ))}
                 </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>

       {!isOpen && (
          <div className="mt-8 md:mt-12 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
             <Plus size={14} className="text-blue-500" />
             <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest">ПОДРОБНЕЕ</span>
          </div>
       )}
    </motion.div>
  );
}

export default function Home() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    aboutText: 'NEXA — это премиальный бренд, специализирующийся на высокопроизводительных ноутбуках для геймеров и профессионалов.',
    contactPhone: '+996 700 123 456',
    contactEmail: 'hi@nexa.kg',
    contactAddress: 'г. Бишкек, пр. Чуй 123',
    mapSrc: 'https://yandex.ru/map-widget/v1/?ll=74.605330%2C42.875220&z=16'
  });

  useEffect(() => {
    const syncSettings = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nexa_settings');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setHeroImage(parsed.heroImage || null);
            setSettings({
              aboutText: parsed.aboutText || 'NEXA — это премиальный бренд, специализирующийся на высокопроизводительных ноутбуках для геймеров и профессионалов.',
              contactPhone: parsed.contactPhone || '+996 700 123 456',
              contactEmail: parsed.contactEmail || 'hi@nexa.kg',
              contactAddress: parsed.contactAddress || 'г. Бишкек, пр. Чуй 123',
              mapSrc: parsed.mapSrc || 'https://yandex.ru/map-widget/v1/?ll=74.605330%2C42.875220&z=16'
            });
          } catch (e) {
            console.error('Error parsing settings', e);
          }
        }
      }
    };
    syncSettings();
    window.addEventListener('nexa_settings_updated', syncSettings);
    return () => window.removeEventListener('nexa_settings_updated', syncSettings);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* ── HERO ── */}
      <section className="flex relative min-h-[85vh] md:min-h-[100vh] items-center px-6 lg:px-20 max-w-[1500px] mx-auto overflow-hidden">
         <div className="absolute inset-0 md:inset-auto md:right-[-10%] lg:right-[-5%] w-full md:w-[65%] h-full z-10 pointer-events-none flex items-center justify-center opacity-30 md:opacity-100">
            <HeroLaptop />
         </div>
         <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className="relative z-20 w-full md:w-[60%] lg:w-[50%] text-left pt-10"
         >
            <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full glass border border-[var(--glass-border)] mb-6 md:mb-8 backdrop-blur-xl">
               <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-blue-500 animate-ping" />
               <p className="text-[6px] md:text-[9px] font-black tracking-[0.4em] text-blue-500 uppercase">NEW GEN 2025</p>
            </div>
            
            <h1 className="text-[2.0rem] md:text-[3.5rem] lg:text-[5.2rem] font-black tracking-tighter mb-10 md:mb-14 leading-[0.9] uppercase text-white">ЗА ГРАНЬЮ<br/><span className="text-gradient">ВОЗМОЖНОСТЕЙ</span></h1>

            <div className="flex origin-left px-1">
              <motion.div
                initial={{ scale: 0, opacity: 0, filter: 'url(#goo)' }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, type: 'spring', damping: 12 }}
              >
                <Link 
                  href="/catalog" 
                  className="group relative inline-flex items-center gap-6 bg-zinc-100 text-black px-12 md:px-24 py-6 md:py-9 rounded-[2.5rem] md:rounded-[4rem] font-black uppercase text-[12px] md:text-sm tracking-[0.3em] border border-black/20 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] overflow-hidden"
                >
                  {/* Gooey Liquid Container */}
                  <div className="absolute inset-0 pointer-events-none" style={{ filter: 'url(#goo)' }}>
                     {/* Multiple "Drops" that merge on hover */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-[150%] group-hover:h-[400%]" />
                     <div className="absolute top-[20%] left-[20%] w-0 h-0 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-20 group-hover:h-20 delay-100" />
                     <div className="absolute bottom-[20%] right-[20%] w-0 h-0 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-24 group-hover:h-24 delay-150" />
                     <div className="absolute top-1/2 left-[80%] w-0 h-0 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-32 group-hover:h-32 delay-75" />
                  </div>

                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">ОТКРЫТЬ КАТАЛОГ</span>
                  <ArrowRight className="relative z-10 w-5 h-5 md:w-7 md:h-7 transition-all duration-300 group-hover:text-white group-hover:translate-x-3 group-hover:rotate-45" />
                </Link>
              </motion.div>
            </div>
         </motion.div>
      </section>

      {/* ── SPECS ── */}
      <section className="pt-0 md:pt-[15vh] pb-16 md:pb-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-20 max-w-4xl mx-auto">
          <p className="text-[8px] md:text-[11px] font-black tracking-[0.4em] text-blue-500 mb-2 md:mb-4 uppercase">ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ</p>
          <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">СОЗДАН ДЛЯ <span className="text-gradient">ЭКСТРЕМАЛОВ</span></h2>
          <p className="text-xs md:text-lg text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed">Нажмите, чтобы разобрать архитектуру.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-8 items-start">
          {SPECS_DATA.map((spec) => (
            <SpecRowCard key={spec.id} spec={spec} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-20 max-w-4xl mx-auto">
          <p className="text-[8px] md:text-[11px] font-black tracking-[0.4em] text-purple-500 mb-2 md:mb-4 uppercase">ФУНКЦИОНАЛЬНОСТЬ</p>
          <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">ГОТОВ К <span className="text-gradient">ЛЮБЫМ ЗАДАЧАМ</span></h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {FEATURES.map((f) => (
            <SquareUnfoldCard key={f.id} f={f} />
          ))}
        </div>
      </section>
      {/* ── CTA ── */}
      <section className="py-24 md:py-48 px-4 md:px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
           <SandText text={"ГОТОВ К\nНОВОМУ\nУРОВНЮ?"} />
           <div className="relative z-50">
              <Link href="/catalog" className="inline-block bg-[var(--text-primary)] text-[var(--bg-primary)] px-10 md:px-20 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[12px] md:text-lg tracking-[0.3em] shadow-2xl hover:scale-110 transition-transform duration-500">КУПИТЬ</Link>
           </div>
        </div>
      </section>

      {/* ── CONTACTS & ABOUT ── */}
      <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto pb-24 md:pb-48">
         <div className="glass-dark border border-[var(--glass-border)] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] text-[20vw] font-black tracking-tighter text-white whitespace-nowrap">
               NEXA
            </div>

            <div className="relative z-10">
               {/* Top Part: Story */}
               <div className="max-w-4xl mb-12 md:mb-20">
                  <p className="text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4 opacity-70">BRAND PHILOSOPHY</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-8">
                     О БРЕНДЕ <span className="text-gradient">NEXA.KG</span>
                  </h2>
                  <p className="text-sm md:text-lg font-medium text-[var(--text-muted)] leading-relaxed">
                     {settings.aboutText} Мы объединяем экстремальную мощь и бескомпромиссную эстетику в каждом продукте, создавая совершенные инструменты для тех, кто не согласен на меньшее.
                  </p>
               </div>

               {/* Bottom Part: Unified Contacts Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 border-t border-white/5 pt-12 md:pt-16">
                  {/* Digital */}
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] opacity-70">WHATSAPP</p>
                     <p className="text-base md:text-xl font-black text-white">{settings.contactPhone}</p>
                     <p className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded w-fit">ONLINE NOW</p>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] opacity-70">EMAIL ADDRESS</p>
                     <p className="text-base md:text-xl font-black text-white break-all">{settings.contactEmail}</p>
                  </div>

                  {/* Physical */}
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] opacity-70">LOCATION</p>
                     <p className="text-base md:text-lg font-black uppercase text-white leading-snug">
                        {settings.contactAddress}
                     </p>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] opacity-70">SCHEDULE</p>
                     <p className="text-base md:text-lg font-black uppercase text-white leading-snug">
                        Пн—Вс: 09:00 — 20:00<br/>Без выходных
                     </p>
                  </div>
               </div>
            </div>

            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
         </div>
      </section>



      {/* SVG Filter for Liquid/Gooey effects. Hidden but active. */}
      <svg className="absolute w-0 h-0 invisible pointer-events-none" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
