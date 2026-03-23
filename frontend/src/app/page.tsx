'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
const HeroLaptop = dynamic(() => import('@/components/3d/HeroLaptop'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>
});
import StarField from '@/components/ui/StarField';
import { Cpu, Zap, Shield, Star, ArrowRight, Battery, Database, Globe, MousePointer2 } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const SPECS = [
  { icon: Cpu, label: 'Процессор', value: 'i9-14900HX', sub: '5.8 GHz' },
  { icon: Zap, label: 'Графика', value: 'RTX 4090', sub: '16GB VRAM' },
  { icon: Database, label: 'Память', value: '64GB DDR5', sub: '5600 MT/s' },
  { icon: Shield, label: 'Дисплей', value: '16" 4K LED', sub: '144Hz' },
];

const FEATURES = [
  {
    title: 'Игровой Монстр',
    desc: 'Доминируйте в любой игре с RTX 4090. Никакого троттлинга.',
    color: 'from-blue-600 to-violet-600',
    tag: 'ИГРЫ',
  },
  {
    title: 'Для Профи',
    desc: 'Рендеринг и код без границ. 128ГБ памяти и TB4.',
    color: 'from-violet-600 to-pink-600',
    tag: 'ОФИС',
  },
  {
    title: 'Автономия',
    desc: 'До 12 часов работы. Быстрая зарядка 100W.',
    color: 'from-pink-600 to-orange-500',
    tag: 'БАТАРЕЯ',
  },
  {
    title: 'Премиум',
    desc: 'Алюминий ЧПУ. Стандарт MIL-SPEC. 3 года гарантии.',
    color: 'from-orange-500 to-red-500',
    tag: 'КАЧЕСТВО',
  },
];

const TESTIMONIALS = [
  { name: 'Алекс Р.', role: 'Про-геймер', text: 'Абсолютно уничтожает любые бенчмарки. Стоит каждого рубля.', rating: 5 },
  { name: 'Сара К.', role: '3D Художник', text: 'Время рендеринга сократилось вдвое. Это просто безумие какое-то.', rating: 5 },
  { name: 'Марк Т.', role: 'Программист', text: 'Лучшее время работы от батареи для ноутбука с такой производительностью.', rating: 5 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const syncSettings = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nexa_settings');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setHeroImage(parsed.heroImage || null);
          } catch (e) {
            console.error('Error parsing settings', e);
          }
        }
      }
    };

    syncSettings();
    window.addEventListener('nexa_settings_updated', syncSettings);
    window.addEventListener('storage', (e) => {
      if (e.key === 'nexa_settings') syncSettings();
    });

    return () => {
      window.removeEventListener('nexa_settings_updated', syncSettings);
    };
  }, []);

  return (
    <div className="relative">
      <StarField />

      {/* ══════════ HERO SECTION ══════════ */}

      {/* ── MOBILE HERO (block layout: 3D top → text bottom) ── */}
      <section className="md:hidden relative w-full flex flex-col pt-14 overflow-hidden">
        {/* 3D Laptop or Uploaded Image — full viewport width on mobile */}
        {/* Laptop display area */}
        <div className="relative w-full h-[min(90vw,450px)] pointer-events-none mb-0">
          <div className="w-full h-full relative">
            {heroImage ? (
              <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={heroImage} 
                className="w-full h-full object-contain" 
                alt="Hero" 
              />
            ) : (
              <HeroLaptop isMobile={true} />
            )}
          </div>
        </div>

        {/* Text content — ultra-tight negative margin */}
        <div className="w-full px-4 pb-10 pt-0 -mt-14 flex flex-col items-center text-center relative z-20" style={{ boxSizing: 'border-box' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono mb-3 glass border"
            style={{ fontSize: '10px', letterSpacing: '0.15em', borderColor: 'var(--glass-border)', color: 'var(--text-accent)', maxWidth: '100%' }}
          >
            ✦ НОВОЕ ПОКОЛЕНИЕ 2025
          </motion.div>

          {/* Title — clamped font size so it never overflows */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="font-black tracking-tight mb-3 w-full"
            style={{ fontSize: 'clamp(1.8rem, 9vw, 2.8rem)', lineHeight: 1.1 }}
          >
            За Гранью<br />
            <span className="text-gradient">Возможностей</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm mb-6 w-full leading-relaxed"
            style={{ color: 'var(--text-muted)', maxWidth: '100%' }}
          >
            Элитные игровые и профессиональные ноутбуки.<br />
            Инновации в каждом миллиметре.
          </motion.p>

          {/* Buttons — always fit, never overflow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col w-full gap-3"
          >
            <Link
              href="/catalog"
              className="w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-sm transition-all active:scale-95"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', boxSizing: 'border-box' }}
            >
              Изучить Коллекцию <ArrowRight size={15} />
            </Link>
            <Link
              href="/catalog?type=gaming"
              className="w-full flex items-center justify-center py-4 font-semibold rounded-2xl text-sm glass transition-all active:scale-95"
              style={{ color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxSizing: 'border-box' }}
            >
              🎮 Игровые Модели
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── DESKTOP HERO (original side-by-side layout) ── */}
      <section className="hidden md:flex relative w-full min-h-screen overflow-hidden items-center justify-start pt-[10vh] pb-10 px-8 lg:px-16 max-w-[1400px] mx-auto">
        {/* Background 3D Laptop or Uploaded Image */}
        <div className="absolute top-0 right-0 w-[70vw] h-full pointer-events-none z-0 translate-x-[15%] flex items-center justify-center">
          <div className="w-full h-full relative">
            {heroImage ? (
              <motion.img 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                src={heroImage} 
                className="w-full h-full object-contain" 
                alt="Hero" 
              />
            ) : (
              <HeroLaptop />
            )}
          </div>
        </div>

        {/* Hero text side */}
        <motion.div className="relative z-20 text-left w-[55%] pointer-events-none flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest mb-8 glass border"
            style={{ borderColor: 'var(--glass-border)', color: 'var(--text-accent)' }}
          >
            ✦ НОВОЕ ПОКОЛЕНИЕ 2025
          </motion.div>

          <motion.h1 className="text-8xl font-bold tracking-tighter mb-6 leading-none">
            За Гранью<br />
            <span className="text-gradient">Возможностей</span>
          </motion.h1>

          <p className="text-xl mb-10 max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Откройте для себя элитные игровые и профессиональные рабочие станции,
            созданные для тех, кто не признает компромиссов. Инновации в каждом миллиметре.
          </p>

          <div className="flex flex-row items-center gap-4 pointer-events-auto">
            <Link
              href="/catalog"
              className="group px-8 py-4 font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              Изучить Коллекцию
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/catalog?type=gaming"
              className="px-8 py-4 font-semibold rounded-full transition-all duration-300 glass"
              style={{ color: 'var(--text-primary)' }}
            >
              Игровые Модели
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════ SPECS SECTION ══════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-widest mb-3" style={{ color: 'var(--text-accent)' }}>ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Создан для <span className="text-gradient">Экстремалов</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {SPECS.map((spec, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-dark rounded-2xl p-4 md:p-8 flex flex-col gap-3 cursor-default group"
            >
              <div 
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--text-accent)' }}
              >
                <spec.icon size={20} className="md:size-[22px]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                <p className="text-sm md:text-xl font-bold mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>{spec.value}</p>
                <p className="text-[10px] md:text-sm" style={{ color: 'var(--text-muted)' }}>{spec.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES SECTION ══════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-widest mb-3" style={{ color: 'var(--text-accent)' }}>ПОЧЕМУ NEXA</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Готов к <span className="text-gradient">Любым Задачам</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative glass-dark rounded-2xl p-5 md:p-8 overflow-hidden group cursor-default h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500`} />
              <span 
                className="inline-block px-3 py-1 rounded-full text-[9px] md:text-xs font-mono mb-4 md:mb-6"
                style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--text-accent)' }}
              >
                {f.tag}
              </span>
              <h3 className="text-base md:text-2xl font-bold mb-2 md:mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-[11px] md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-widest mb-3" style={{ color: 'var(--text-accent)' }}>ОТЗЫВЫ</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Выбор <span className="text-gradient">Профессионалов</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="glass-dark rounded-2xl p-8 flex flex-col gap-5"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-base leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>"{t.text}"</p>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-accent)' }}>{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="relative z-10 py-32 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Готовы <span className="text-gradient">К Новому Уровню?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>
            Бесплатная доставка. 30 дней на возврат. 3 года глобальной гарантии.
          </p>
          <Link 
            href="/catalog" 
            className="group inline-flex items-center gap-3 px-10 py-5 font-bold rounded-full text-lg transition-all duration-300"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
          >
            Купить Сейчас
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bottom fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </section>
    </div>
  );
}
