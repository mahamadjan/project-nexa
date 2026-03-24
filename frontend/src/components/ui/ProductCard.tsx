'use client';
import { motion } from 'framer-motion';
import { ShoppingCart, Monitor, Cpu, Database, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string;
  type: string;
  discount?: number;
  image?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
}

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

export default function ProductCard({ product, index }: { product: Product, index: number }) {
  const accent = typeAccent[product.type] || '#6366f1';
  const discountedPrice = (product.discount || 0) > 0
    ? Math.round(product.price * (1 - (product.discount || 0) / 100))
    : product.price;

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

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
        <div className="relative h-48 sm:h-60 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-2 w-full h-full justify-center">
            {product.image ? (
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.image} 
                className="w-full h-full object-cover"
                alt={product.name}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
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
            )}
          </div>

          {/* Type badge */}
          <div
            className="absolute z-20 top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest backdrop-blur-md shadow-md"
            style={{ background: `${accent}30`, color: accent, border: `1px solid ${accent}60` }}
          >
            {typeLabel[product.type] || product.type}
          </div>

          {/* Discount badge */}
          {(product.discount || 0) > 0 && (
            <div className="absolute z-20 top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-red-500/80 text-white border border-red-500/50 backdrop-blur-md shadow-md">
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

          {/* Specs row — hidden on mobile, shown on desktop */}
          <div className="hidden sm:grid grid-cols-3 gap-2 mb-4">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-white/5 gap-3">
            <div className="flex flex-col">
              {(product.discount || 0) > 0 && (
                <p className="text-[9px] sm:text-[10px] text-gray-500 line-through">${product.price.toLocaleString()}</p>
              )}
              <p className="text-base sm:text-2xl font-black tracking-tight text-white">${discountedPrice.toLocaleString()}</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex items-center gap-2">
                {/* Add to favorites */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  className="flex-1 md:flex-none h-9 w-full md:w-9 rounded-xl flex items-center justify-center transition-all bg-white/5 border border-white/10 shrink-0"
                  style={{ 
                    background: isFavorite(product.id) ? 'rgba(244, 63, 94, 0.2)' : undefined, 
                    borderColor: isFavorite(product.id) ? 'rgba(244, 63, 94, 0.5)' : undefined,
                    color: isFavorite(product.id) ? '#fb7185' : '#9ca3af'
                  }}
                >
                  <Heart size={16} fill={isFavorite(product.id) ? '#fb7185' : 'transparent'} className="w-4 h-4" />
                </motion.button>
                
                {/* Quick add to cart */}
                <motion.button
                  whileTap={{ scale: 0.90 }}
                  onClick={handleAddToCart}
                  className="flex-1 md:flex-none h-9 w-full md:w-9 rounded-xl flex items-center justify-center transition-all shrink-0"
                  style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
                  title="В корзину"
                >
                  <ShoppingCart size={15} className="w-4 h-4" />
                </motion.button>
              </div>

              {/* View Button - Bottom row on mobile, alongside on desktop */}
              <motion.div
                whileHover={{ x: 2 }}
                className="flex-1 flex items-center justify-center h-9 md:h-9 px-4 rounded-xl transition-all border shrink-0 text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
              >
                <span className="mr-1">Подробнее</span>
                <span>→</span>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
