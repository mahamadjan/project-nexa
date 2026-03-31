'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { useFavorites } from '@/context/FavoritesContext';

export default function Favorites() {
  const { favorites, clearFavorites, syncValidFavorites } = useFavorites();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial baseline from STATIC products
    import('@/data/products').then(({ INITIAL_PRODUCTS }) => {
      setProducts(INITIAL_PRODUCTS);
      
      // 2. Try to enrich from localStorage (admin-added items)
      const stored = localStorage.getItem('nexa_products');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) setProducts(parsed);
        } catch (e) {}
      }

      // 3. Last resort: Real-time fetch from Supabase to be 100% sure
      const fetchLive = async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data } = await supabase.from('products').select('*');
          if (data && data.length > 0) {
            setProducts(prev => {
              const merged = [...prev];
              data.forEach(dbItem => {
                const idx = merged.findIndex(p => p.id === dbItem.id);
                if (idx !== -1) merged[idx] = { ...merged[idx], ...dbItem };
                else merged.push(dbItem);
              });
              return merged;
            });
          }
        } catch(e){}
        setLoading(false);
      };
      
      fetchLive();
    });
  }, [favorites]);

  useEffect(() => {
    // Auto-cleanup hook: if loading is done, make sure favorites only contain valid IDs
    if (!loading && products.length > 0) {
      const validProductIds = products.map(p => p.id);
      syncValidFavorites(validProductIds);
    }
  }, [loading, products]);

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
              <p className="text-2xl font-black">
                {favorites.length} {(() => {
                  const n = Math.abs(favorites.length) % 100;
                  const n1 = n % 10;
                  if (n > 10 && n < 20) return 'товаров';
                  if (n1 > 1 && n1 < 5) return 'товара';
                  if (n1 === 1) return 'товар';
                  return 'товаров';
                })()}
              </p>
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
            
            <div className="flex flex-col gap-4">
               <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-3">
                 <ShoppingBag size={20} />
                 Смотреть каталог
               </Link>
               {favorites.length > 0 && (
                 <button onClick={clearFavorites} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                   Сбросить счетчик (Очистить старые сохранения)
                 </button>
               )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end mb-4 -mt-6">
               <button onClick={clearFavorites} className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-2 transition-colors px-4 py-2 rounded-xl bg-white/5">
                 <X size={14} /> Очистить список
               </button>
            </div>
            {favoriteProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
