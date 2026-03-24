'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { useFavorites } from '@/context/FavoritesContext';

export default function Favorites() {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from local storage to include admin-added photos/discounts
    const stored = localStorage.getItem('nexa_products');
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {}
    }
    setLoading(false);
  }, [favorites]);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6 font-medium">
              <ArrowLeft size={16} /> Назад в каталог
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Ваше <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Избранное</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Сохраненные товары для будущего</p>
          </div>
          
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 inline-flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
              <Heart size={24} className="text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Всего сохранено</p>
              <p className="text-2xl font-black">{favorites.length} {favorites.length === 1 ? 'товар' : 'товаров'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(n => (
               <div key={n} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
             ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center glass rounded-3xl border border-white/5 backdrop-blur-xl"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/10 shadow-lg">
              <Heart className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-black mb-3">Здесь пока пусто</h2>
            <p className="text-gray-400 max-w-sm mb-8">Вы еще ничего не добавили в избранное. Перейдите в каталог, чтобы найти ноутбук мечты.</p>
            <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-3">
              <ShoppingBag size={20} />
              Смотреть каталог
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
