'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Monitor, Database, Zap, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const typeColors: Record<string, string> = {
  GAMING: 'from-red-500/20 to-orange-500/20',
  OFFICE: 'from-blue-500/20 to-cyan-500/20',
};
const typeAccent: Record<string, string> = {
  GAMING: '#f97316',
  OFFICE: '#3b82f6',
};
const typeLabel: Record<string, string> = {
  GAMING: '🎮 ИГРОВОЙ',
  OFFICE: '💼 РАБОТА',
};

export default function ProductCard({ product, index }: { product: any; index: number }) {
  const accent = typeAccent[product.type] || '#6366f1';
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      brand: product.brand || 'NEXA',
      type: product.type || 'GAMING',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative glass-dark rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 cursor-pointer shadow-xl"
    >
      <Link href={`/catalog/${product.id}`}>
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />

        {/* Image / icon area */}
        <div className="relative h-44 sm:h-52 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-2xl"
            style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
            >
              <Monitor size={48} style={{ color: accent }} strokeWidth={1.2} />
            </motion.div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-gray-600 uppercase">NEXA</span>
          </div>

          {/* Type badge */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}
          >
            {typeLabel[product.type] || product.type}
          </div>

          {/* Discount badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-red-500/20 text-red-400 border border-red-500/40">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-0.5">{product.brand || 'NEXA'}</p>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Specs row — compact on mobile */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Cpu, label: 'CPU', value: product.cpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Zap, label: 'GPU', value: product.gpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Database, label: 'RAM', value: product.ram?.split(' ')[0] || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-2 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Icon size={12} className="mx-auto mb-1 text-gray-500" />
                <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">{label}</p>
                <p className="text-[10px] sm:text-xs text-white font-bold mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div>
              {product.discount > 0 && (
                <p className="text-[10px] text-gray-500 line-through">${product.price.toLocaleString()}</p>
              )}
              <p className="text-xl sm:text-2xl font-black tracking-tight text-white">${discountedPrice.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              {/* Quick add to cart */}
              <motion.button
                whileTap={{ scale: 0.90 }}
                onClick={handleAddToCart}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
                title="Добавить в корзину"
              >
                <ShoppingCart size={16} />
              </motion.button>
              {/* View */}
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl transition-all"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
              >
                Открыть <span>→</span>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
