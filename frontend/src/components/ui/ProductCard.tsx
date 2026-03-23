'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Monitor, Database, Zap } from 'lucide-react';

const typeColors: Record<string, string> = {
  GAMING: 'from-red-500/20 to-orange-500/20',
  OFFICE: 'from-blue-500/20 to-cyan-500/20',
};
const typeAccent: Record<string, string> = {
  GAMING: '#f97316',
  OFFICE: '#3b82f6',
};
const typeLabel: Record<string, string> = {
  GAMING: 'ИГРОВОЙ',
  OFFICE: 'РАБОТА',
};

export default function ProductCard({ product, index }: { product: any; index: number }) {
  const accent = typeAccent[product.type] || '#6366f1';
  const gradient = typeColors[product.type] || 'from-purple-500/20 to-blue-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative glass-dark rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 cursor-pointer shadow-xl"
    >
      <Link href={`/catalog/${product.id}`}>
        {/* Top gradient glow on hover */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />

        {/* Image area */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
          {/* Ambient glow behind image */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-2xl"
            style={{ background: `radial-gradient(circle, ${accent}44, transparent 70%)` }}
          />

          {/* Product placeholder with animated icon */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
              className="w-28 h-28 rounded-2xl flex items-center justify-center"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
            >
              <Monitor size={56} style={{ color: accent }} strokeWidth={1.2} />
            </motion.div>
            <span className="text-xs font-mono tracking-[0.2em] text-gray-600 uppercase">NEXA · 3D MODEL</span>
          </div>

          {/* Type badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}
          >
            {typeLabel[product.type] || product.type}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">{product.brand}</p>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Cpu, label: 'CPU', value: product.cpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Zap, label: 'GPU', value: product.gpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Database, label: 'RAM', value: product.ram?.split(' ')[0] || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Icon size={14} className="mx-auto mb-1 text-gray-500" />
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{label}</p>
                <p className="text-xs text-white font-bold mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-5 border-t border-white/5">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Цена</p>
              <p className="text-2xl font-black tracking-tight text-white">${product.price.toLocaleString()}</p>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
            >
              Открыть
              <span className="text-base">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
