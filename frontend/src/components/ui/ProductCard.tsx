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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative glass-dark rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer shadow-lg"
    >
      <Link href={`/catalog/${product.id}`}>
        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />

        {/* Image / icon area */}
        <div className="relative h-32 sm:h-56 overflow-hidden bg-gradient-to-br from-white/3 to-white/[0.01] flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-2 w-full h-full justify-center">
            {product.image ? (
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.image} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                alt={product.name}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
                  style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
                >
                  <Monitor size={32} style={{ color: accent }} strokeWidth={1} className="sm:w-12 sm:h-12" />
                </motion.div>
                <span className="text-[8px] font-mono tracking-widest text-gray-700 uppercase">NEXA</span>
              </div>
            )}
          </div>

          {/* Type badge - Small and neat */}
          <div
            className="absolute z-20 top-2 right-2 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold tracking-widest backdrop-blur-md"
            style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
          >
            {product.type === 'GAMING' ? 'GAMING' : 'OFFICE'}
          </div>
        </div>

        {/* Card body */}
        <div className="p-3 sm:p-4">
          <div className="mb-2">
            <p className="text-[8px] text-gray-500 font-mono tracking-widest uppercase mb-0.5">{product.brand || 'NEXA'}</p>
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* Specs - Hidden on mobile to save space */}
          <div className="hidden sm:grid grid-cols-3 gap-1.5 mb-3 min-h-[48px]">
            {[
              { icon: Cpu, label: 'CPU', value: product.cpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Zap, label: 'GPU', value: product.gpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Database, label: 'RAM', value: product.ram?.split(' ')[0] || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-lg p-1.5 text-center bg-white/[0.03] border border-white/[0.05] h-full flex flex-col justify-center"
              >
                <Icon size={10} className="mx-auto mb-0.5 text-gray-500" />
                <p className="text-[10px] text-white font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex flex-col">
              <p className="text-sm sm:text-lg font-black tracking-tighter text-white">${discountedPrice.toLocaleString()}</p>
              {(product.discount || 0) > 0 && (
                <p className="text-[8px] sm:text-[9px] text-red-400 font-bold">-{product.discount}%</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Favorites - Small circle */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/[0.03] border border-white/10 hover:bg-white/10"
                style={{ 
                  color: isFavorite(product.id) ? '#fb7185' : '#6b7280'
                }}
              >
                <Heart size={16} fill={isFavorite(product.id) ? '#fb7185' : 'transparent'} />
              </button>
              
              {/* Add to cart - Premium button style */}
              <button
                onClick={handleAddToCart}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-premium text-white shadow-lg shadow-blue-600/10"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
