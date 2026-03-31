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

export default function ProductCard({ product }: { product: Product }) {
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
      image: product.image || '',
    });
  };

  return (
    <div
      className="group relative glass-dark rounded-2xl overflow-hidden border border-[var(--glass-border)] hover:border-blue-500/30 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer shadow-lg transform-gpu will-change-transform"
    >
      <Link href={`/catalog/${product.id}`} prefetch={false}>
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />

        <div className="relative h-28 sm:h-40 overflow-hidden bg-[var(--bg-subtle)] flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-2 w-full h-full justify-center">
            {product.image ? (
              <img 
                loading="lazy"
                decoding="async"
                src={product.image} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                alt={product.name}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-transform group-hover:-translate-y-1"
                  style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
                >
                  <Monitor size={32} style={{ color: accent }} strokeWidth={1} className="sm:w-12 sm:h-12" />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-gray-700 uppercase">NEXA</span>
              </div>
            )}
          </div>

          <div
            className="absolute z-20 top-2 right-2 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold tracking-widest backdrop-blur-md"
            style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
          >
            {product.type === 'GAMING' ? 'GAMING' : 'OFFICE'}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2">
            <p className="text-[8px] text-[var(--text-muted)] font-mono tracking-widest uppercase mb-0.5">{product.brand || 'NEXA'}</p>
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-[var(--text-primary)] leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-1 mb-2.5 min-h-[40px]">
            {[
              { icon: Cpu, label: 'CPU', value: product.cpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Zap, label: 'GPU', value: product.gpu?.split(' ').slice(-1)[0] || '—' },
              { icon: Database, label: 'RAM', value: product.ram?.split(' ')[0] || '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-lg p-1 text-center bg-[var(--bg-subtle)] border border-[var(--glass-border)] h-full flex flex-col justify-center"
              >
                <Icon size={10} className="mx-auto mb-0.5 text-[var(--text-muted)]" />
                <p className="text-[10px] text-[var(--text-primary)] font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
            <div className="flex flex-col">
              <p className="text-sm sm:text-lg font-black tracking-tighter text-[var(--text-primary)]">${discountedPrice.toLocaleString()}</p>
              {(product.discount || 0) > 0 && (
                <p className="text-[8px] sm:text-[9px] text-red-400 font-bold">-{product.discount}%</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/[0.03] border border-white/10 hover:bg-white/10"
                style={{ 
                  color: isFavorite(product.id) ? '#fb7185' : '#6b7280'
                }}
              >
                <Heart size={16} fill={isFavorite(product.id) ? '#fb7185' : 'transparent'} />
              </button>
              
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
    </div>
  );
}
