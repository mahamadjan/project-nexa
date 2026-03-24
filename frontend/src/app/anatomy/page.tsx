'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Cpu, Zap, Battery, Database, MousePointer2 } from 'lucide-react';

// ── CUSTOM SVG ILLUSTRATIONS ────────────────────────────────────────────────
const PartsSVG: Record<string, () => React.ReactNode> = {
  screen: () => (
    <svg viewBox="0 0 400 250" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      <rect x="5" y="5" width="390" height="240" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <rect x="15" y="15" width="370" height="210" rx="4" fill="#020617" />
      <defs>
        <linearGradient id="matrix" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#1e40af" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="15" y="15" width="370" height="210" rx="4" fill="url(#matrix)" />
      {[...Array(12)].map((_, i) => (
        <line key={i} x1="15" y1={25 + i * 18} x2="385" y2={25 + i * 18} stroke="#3b82f6" strokeOpacity="0.1" strokeWidth="0.5" />
      ))}
      <text x="200" y="125" textAnchor="middle" fill="#3b82f6" fillOpacity="0.6" fontSize="12" className="font-mono">OLED X-REAL MATRIX</text>
    </svg>
  ),
  cpu: () => (
    <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
      <rect x="25" y="25" width="150" height="150" rx="4" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
      <rect x="50" y="50" width="100" height="100" rx="2" fill="#171717" stroke="#404040" strokeWidth="1" />
      <circle cx="100" cy="100" r="30" fill="#2563eb" fillOpacity="0.2" />
      <text x="100" y="105" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="black" className="font-mono">CORE i9</text>
      {[...Array(20)].map((_, i) => (
        <rect key={i} x={30 + (i % 5) * 30} y={30 + Math.floor(i / 5) * 30} width="10" height="10" rx="1" fill="#fbbf24" fillOpacity="0.1" />
      ))}
      <rect x="160" y="40" width="15" height="120" rx="2" fill="#312e81" fillOpacity="0.5" />
    </svg>
  ),
  gpu: () => (
    <svg viewBox="0 0 350 200" className="w-full h-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">
      <rect x="10" y="10" width="330" height="180" rx="8" fill="#064e3b" stroke="#14532d" strokeWidth="2" />
      <rect x="50" y="40" width="120" height="120" rx="4" fill="#020617" stroke="#16a34a" strokeWidth="1.5" />
      <text x="110" y="105" textAnchor="middle" fill="#22c55e" fontSize="16" fontWeight="black">RTX 4090</text>
      {[200, 240, 280].map((x, i) => (
        <rect key={i} x={x} y="40" width="30" height="120" rx="3" fill="#022c22" stroke="#059669" strokeWidth="1" />
      ))}
      <path d="M 10 170 H 340" stroke="#22c55e" strokeOpacity="0.2" strokeWidth="3" strokeDasharray="5,5" />
    </svg>
  ),
  ram: () => (
    <svg viewBox="0 0 300 100" className="w-full h-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
      <rect x="5" y="20" width="290" height="60" rx="4" fill="#2e1065" stroke="#4c1d95" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <rect key={i} x={20 + i * 34} y="30" width="24" height="40" rx="2" fill="#0c0a09" stroke="#7c3aed" strokeWidth="1" />
      ))}
      <rect x="10" y="10" width="100" height="5" rx="2" fill="#a855f7" />
    </svg>
  ),
  ssd: () => (
    <svg viewBox="0 0 300 80" className="w-full h-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
      <rect x="5" y="10" width="290" height="60" rx="4" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
      <rect x="20" y="20" width="60" height="40" rx="2" fill="#0c0a09" stroke="#d97706" strokeWidth="1" />
      <rect x="90" y="20" width="30" height="40" rx="1" fill="#0c0a09" stroke="#d97706" strokeWidth="1" />
      <rect x="130" y="20" width="150" height="40" rx="2" fill="#0c0a09" stroke="#d97706" strokeWidth="1" />
      <text x="205" y="45" textAnchor="middle" fill="#d97706" fontSize="10">NAND FLASH 2TB</text>
    </svg>
  ),
  cooling: () => (
    <svg viewBox="0 0 400 150" className="w-full h-auto">
      <circle cx="80" cy="75" r="55" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
      <circle cx="320" cy="75" r="55" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
      <circle cx="80" cy="75" r="15" fill="#ef4444" />
      <circle cx="320" cy="75" r="15" fill="#ef4444" />
      {[...Array(12)].map((_, i) => (
        <line key={i} x1="80" y1="75" x2={80 + Math.cos(i * Math.PI / 6) * 50} y2={75 + Math.sin(i * Math.PI / 6) * 50} stroke="#ef4444" strokeWidth="4" />
      ))}
      {[...Array(12)].map((_, i) => (
        <line key={i} x1="320" y1="75" x2={320 + Math.cos(i * Math.PI / 6) * 50} y2={75 + Math.sin(i * Math.PI / 6) * 50} stroke="#ef4444" strokeWidth="4" />
      ))}
      <rect x="140" y="60" width="120" height="30" rx="15" fill="#b91c1c" />
    </svg>
  ),
  battery: () => (
    <svg viewBox="0 0 400 120" className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <rect x="10" y="10" width="380" height="100" rx="8" fill="#083344" stroke="#0e7490" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x={25 + i * 60} y="20" width="50" height="80" rx="4" fill="#155e75" fillOpacity="0.5" />
      ))}
      <rect x="15" y="15" width="40" height="5" fill="#22d3ee" rx="2" />
      <text x="350" y="100" textAnchor="end" fill="#06b6d4" fontSize="12" fontWeight="bold">99.9Wh</text>
    </svg>
  ),
  keyboard: () => (
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <rect x="5" y="5" width="390" height="170" rx="12" fill="#111827" stroke="#374151" strokeWidth="2" />
      {[...Array(24)].map((_, i) => (
        <rect key={i} x={20 + (i % 8) * 46} y={20 + Math.floor(i / 8) * 40} width="36" height="32" rx="4" fill="#1f2937" stroke="#4b5563" />
      ))}
      <rect x="20" y="145" width="360" height="20" rx="4" fill="#1f2937" stroke="#4b5563" />
      <rect x="5" y="170" width="390" height="4" fill="#3b82f6" fillOpacity="0.5" rx="2" />
    </svg>
  ),
};

const ITEMS = [
  { id: 'screen', type: 'screen', title: 'OLED Матрица X-Real', specs: ['4K Ultra HD 120Hz', '1000 нит яркость', 'HDR10+ / Dolby Vision', '0.1мс время отклика'], desc: 'Топовая OLED панель с идеальным черным цветом. Каждый пиксель управляется отдельно, обеспечивая невероятный контраст.' },
  { id: 'cpu', type: 'cpu', title: 'Intel Core i9-14900HX', specs: ['24 ядра (8P + 16E)', '5.8 ГГц в режиме Boost', '36 МБ Кэш L3', 'Поддержка Thunderbolt 4'], desc: 'Самый мощный мобильный процессор на сегодня. Справляется с любой нагрузкой — от компиляции кода до 3D рендеринга.' },
  { id: 'gpu', type: 'gpu', title: 'NVIDIA RTX 4090 Laptop', specs: ['16 ГБ GDDR6X памяти', 'DLSS 3.5 (ИИ-генерация)', 'Трассировка лучей 3-го пок.', 'TGP до 175 Вт'], desc: 'Ультимативная видеокарта для игр в 4K. Обеспечивает кинематографичную графику благодаря выделенным RT-ядрам.' },
  { id: 'cooling', type: 'cooling', title: 'IceStorm 4.0 Cooling', specs: ['Двойные турбо-вентиляторы', 'Vapor Chamber технология', 'Жидкий металл Thermal Grizzly', '4 медные теплотрубки'], desc: 'Интеллектуальная система охлаждения. Отводит до 250 Вт тепла, не допуская троттлинга даже в самых жарких баталиях.' },
  { id: 'ram', type: 'ram', title: 'DDR5-5600 64GB', specs: ['Двухканальный режим', 'SO-DIMM формат (апгрейд)', 'Латентность CL40', '1.1V низкое питание'], desc: 'Сверхбыстрая память для многозадачности. Позволяет держать сотни вкладок и тяжелые проекты в Adobe Suite без задержек.' },
  { id: 'ssd', type: 'ssd', title: 'NVMe Gen5 2TB SSD', specs: ['Скорость до 12,000 МБ/с', 'M.2 2280 компактность', 'Шифрование AES-256', 'Ресурс 1200 TBW'], desc: 'Накопитель нового поколения. Игры загружаются мгновенно, а операционная система стартует менее чем за 5 секунд.' },
  { id: 'battery', type: 'battery', title: 'High-Density 99.9Wh', specs: ['Максимальная емкость для самолета', 'Быстрая зарядка 140W GaN', '1000 циклов до 80% емкости', '8-10 часов автономности'], desc: 'Батарея, которой хватит на трансатлантический перелет. Поддержка Type-C зарядки позволяет заряжать ноут от повербанка.' },
  { id: 'keyboard', type: 'keyboard', title: 'Per-Key RGB Keyboard', specs: ['Индивидуальная подсветка', 'Ход клавиш 1.7мм', 'Технология N-Key Rollover', 'Защита от пролива жидкости'], desc: 'Премиальная клавиатура с тактильным откликом. Каждая клавиша настраивается отдельно через софт NEXA Hub.' },
];

function PartItem({ item, index }: { item: typeof ITEMS[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isLeft = index % 2 === 0;

  const SvgIcon = PartsSVG[item.type];

  return (
    <div 
      ref={ref}
      className={`relative w-full overflow-hidden 
        flex flex-col border border-white/5 bg-white/[0.02] p-4 rounded-2xl
        md:bg-transparent md:border-none md:p-20 md:min-h-[50vh] md:flex-row md:items-center md:justify-between md:gap-12 md:rounded-none
        ${!isLeft ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Visual Side */}
      <motion.div 
        className="w-full md:w-1/2 flex justify-center z-10 mb-4 md:mb-0"
        initial={{ opacity: 0, x: isLeft ? -50 : 50, scale: 0.8 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-[140px] md:max-w-md relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-[40px] md:blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
          <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
            {SvgIcon && <SvgIcon />}
          </div>
        </div>
      </motion.div>

      {/* Info Side */}
      <motion.div 
        className="w-full md:w-1/2 space-y-2 md:space-y-6 z-10 text-center md:text-left"
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="hidden md:flex items-center gap-3">
          <div className="h-px w-8 bg-blue-500" />
          <span className="text-blue-500 font-mono text-[10px] md:text-sm uppercase tracking-widest">Компонент {index + 1}</span>
        </div>
        
        <h2 className="text-xs md:text-5xl font-black text-white hover:text-blue-400 transition-colors cursor-default leading-tight">
          {item.title}
        </h2>
        
        <p className="hidden md:block text-gray-400 text-lg leading-relaxed max-w-md">
          {item.desc}
        </p>

        <ul className="flex flex-wrap justify-center md:grid md:grid-cols-2 gap-1.5 md:gap-4 pt-1 md:pt-4">
          {item.specs.slice(0, 2).map((spec, i) => ( // Show only 2 specs on mobile
            <motion.li 
              key={i}
              className="flex items-center gap-1 md:gap-2 text-[8px] md:text-sm text-gray-400 md:text-gray-300 font-mono bg-white/5 px-2 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg border border-white/10"
            >
              <Zap className="text-blue-500 w-2 h-2 md:w-3 md:h-3" />
              {spec}
            </motion.li>
          ))}
          {/* Detailed specs hidden on mobile by default or truncated */}
          <li className="md:hidden text-[7px] text-blue-500/50 uppercase font-black tracking-tighter self-center">
            {item.specs.length} SPECS
          </li>
        </ul>
      </motion.div>

      {/* Background Decor - Desktop only */}
      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${isLeft ? '-left-20' : '-right-20'} opacity-[0.03] pointer-events-none select-none`}>
        <span className="text-[20rem] font-black">{index + 1}</span>
      </div>
    </div>
  );
}

export default function AnatomyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Intro Header */}
      <section className="relative h-[60vh] md:h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full" />
        </motion.div>

        <Link href="/catalog" className="absolute top-8 md:top-12 left-6 md:left-20 flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Вернуться</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-4"
        >
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[8px] md:text-xs font-black uppercase tracking-widest">
            X-Ray Breakdown
          </span>
          <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            АНАТОМИЯ<br />
            <span className="text-transparent border-t-2 border-white/20 pt-2 md:pt-4" style={{ WebkitTextStroke: '1px white' }}>БУДУЩЕГО</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-lg max-w-2xl mx-auto mt-4 md:mt-8 font-medium">
            Смотрите из чего состоит ультимативная мощь.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-4"
        >
          <div className="w-px h-10 md:h-16 bg-gradient-to-b from-blue-500 to-transparent" />
        </motion.div>
      </section>

      {/* Main Content Grid/Stack */}
      <section className="relative z-10 px-4 md:px-0">
        <div className="grid grid-cols-2 md:block gap-3 md:gap-0 max-w-7xl mx-auto">
          {ITEMS.map((item, i) => (
            <PartItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 md:py-40 px-6 text-center bg-gradient-to-t from-blue-600/10 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
            Готовы ощутить<br />эту мощь?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/catalog" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105">
              В каталог
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
