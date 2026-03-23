'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HeroLaptop from '@/components/3d/HeroLaptop';
import StarField from '@/components/ui/StarField';
import { Cpu, Zap, Shield, Star, ArrowRight } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const SPECS = [
  { icon: Cpu, label: 'Процессор', value: 'Intel Core i9-14900HX', sub: 'Разгон до 5.8 GHz' },
  { icon: Zap, label: 'Графика', value: 'NVIDIA RTX 4090', sub: '16GB GDDR6 | DLSS 3' },
  { icon: Shield, label: 'Дисплей', value: '16" Mini-LED 4K', sub: '144Hz | 100% DCI-P3' },
];

const FEATURES = [
  {
    title: 'Игровой Монстр',
    desc: 'Доминируйте в любой игре с RTX 4090 и PCIe Gen 5 NVMe. Никакого троттлинга под нагрузкой.',
    color: 'from-blue-600 to-violet-600',
    tag: 'ИГРЫ',
  },
  {
    title: 'Для Профи',
    desc: 'Рендеринг, код и творчество без границ. 128ГБ объединенной памяти и Thunderbolt 4.',
    color: 'from-violet-600 to-pink-600',
    tag: 'ОФИС',
  },
  {
    title: 'Создан на века',
    desc: 'Алюминиевый корпус с ЧПУ-обработкой. Протестирован по стандартам MIL-SPEC. 3 года гарантии.',
    color: 'from-pink-600 to-orange-500',
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
  return (
    <div className="relative">
      <StarField />

      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-start pt-[10vh] pb-10 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        
        {/* Absolute Background 3D Laptop */}
        <div className="absolute top-0 right-0 w-full md:w-[70vw] h-full pointer-events-none z-0 md:translate-x-[15%]">
          <HeroLaptop /> 
        </div>

        {/* Foreground hero text */}
        <motion.div
          className="relative z-20 text-center md:text-left md:w-[55%] pointer-events-none flex flex-col items-center md:items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest mb-8 glass border"
            style={{ borderColor: 'var(--glass-border)', color: 'var(--text-accent)' }}
          >
            ✦ НОВОЕ ПОКОЛЕНИЕ 2025
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-none"
          >
            За Гранью
            <br />
            <span className="text-gradient">Возможностей</span>
          </motion.h1>

          <p className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Откройте для себя элитные игровые и профессиональные рабочие станции, 
            созданные для тех, кто не признает компромиссов. Инновации в каждом миллиметре.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:justify-start gap-4 pointer-events-auto">
            <Link 
              href="/catalog" 
              className="group px-8 py-4 font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              Изучить Коллекцию
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/catalog?type=gaming" className="px-8 py-4 font-semibold rounded-full transition-all duration-300 glass" style={{ color: 'var(--text-primary)' }}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPECS.map((spec, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-dark rounded-2xl p-8 flex flex-col gap-4 cursor-default group"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--text-accent)' }}
              >
                <spec.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{spec.label}</p>
                <p className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{spec.value}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{spec.sub}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative glass-dark rounded-2xl p-8 overflow-hidden group cursor-default"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500`} />
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6"
                style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--text-accent)' }}
              >
                {f.tag}
              </span>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
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
