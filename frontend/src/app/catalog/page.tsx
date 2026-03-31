'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

import { INITIAL_PRODUCTS } from '@/data/products';

const RAM_OPTIONS  = ['Все', '8GB', '16GB', '18GB', '32GB', '64GB', '96GB', '128GB'];
const GPU_OPTIONS  = ['Все', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RTX 5000', 'Apple M', 'Intel Arc', 'Radeon', 'UHD'];
const TYPE_OPTIONS = [
  { id: 'ALL',    label: 'Все',        emoji: '✦' },
  { id: 'GAMING', label: 'Игровые',   emoji: '🎮' },
  { id: 'OFFICE', label: 'Для работы', emoji: '💼' },
];

import { supabase } from '@/lib/supabase';

export default function Catalog() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [search,      setSearch]     = useState('');
  const [type,       setType]       = useState('ALL');
  const [maxPrice,   setMaxPrice]   = useState(6000);
  const [ram,        setRam]        = useState('Все');
  const [gpu,        setGpu]        = useState('Все');
  const [sortBy,     setSortBy]     = useState('default');
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => { 
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          setAllProducts(data);
        } else {
          setAllProducts(INITIAL_PRODUCTS);
        }
      } catch (err) {
        console.error('Products fetch error:', err);
        setAllProducts(INITIAL_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('nexa_products_updated', loadProducts);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('nexa_products_updated', loadProducts);
      }
    };
  }, []);

  const filtered = useMemo(() => {
    let res = allProducts.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (type !== 'ALL' && p.type !== type) return false;
      if (p.price > maxPrice) return false;
      if (ram  !== 'Все' && !p.ram.startsWith(ram))  return false;
      if (gpu  !== 'Все' && !p.gpu.includes(gpu))     return false;
      return true;
    });
    if (sortBy === 'price-asc')  res = [...res].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') res = [...res].sort((a, b) => b.price - a.price);
    if (sortBy === 'gaming')     res = [...res].sort((a, b) => (a.type === 'GAMING' ? -1 : 1));
    if (sortBy === 'office')     res = [...res].sort((a, b) => (a.type === 'OFFICE' ? -1 : 1));
    return res;
  }, [allProducts, search, type, maxPrice, ram, gpu, sortBy]);

  const activeFilterCount = [
    search !== '',
    type !== 'ALL',
    maxPrice < 6000,
    ram !== 'Все',
    gpu !== 'Все',
  ].filter(Boolean).length;

  const resetFilters = () => { setSearch(''); setType('ALL'); setMaxPrice(6000); setRam('Все'); setGpu('Все'); setSortBy('default'); };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── Header Area ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="fade-in-up">
           <p className="text-[10px] font-black tracking-[0.2em] text-blue-500 mb-2 uppercase">NEXA INTELLIGENCE · {filtered.length} МОДЕЛЕЙ</p>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
             НАШ <span className="text-gradient">КАТАЛОГ</span>
           </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Main Search Bar */}
          <div className="relative flex-1 min-w-[280px] sm:min-w-[320px]">
            <input
              type="text"
              placeholder="Поиск по названию или бренду..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-sm text-white pl-12 pr-10 py-4 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-500 font-bold"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
             {/* Sort Dropdown */}
             <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest text-gray-400 pl-4 pr-10 py-4 rounded-2xl outline-none cursor-pointer hover:bg-white/[0.05] transition-all"
                >
                  <option value="default">СОРТИРОВКА</option>
                  <option value="price-asc">ЦЕНА: ↓</option>
                  <option value="price-desc">ЦЕНА: ↑</option>
                  <option value="gaming">ИГРОВЫЕ</option>
                  <option value="office">ОФИСНЫЕ</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
             </div>

             {/* Filter Toggle */}
             <button
               onClick={() => setPanelOpen(!panelOpen)}
               className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                 panelOpen 
                   ? 'btn-premium text-white border-transparent' 
                   : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/10'
               }`}
             >
               <SlidersHorizontal size={14} /> 
               <span className="hidden sm:inline">Фильтры</span>
               {activeFilterCount > 0 && <span className="bg-white text-blue-600 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{activeFilterCount}</span>}
             </button>
          </div>
        </div>
      </div>

      {/* ── Type Pills ── */}
      <div className="flex gap-2 mb-6">
        {TYPE_OPTIONS.map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
              type === t.id
                ? 'btn-premium'
                : 'bg-white/[0.03] border-white/8 text-gray-400 hover:bg-white/8 hover:text-white'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── Filter Panel ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="filter-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass border border-white/10 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Расширенные фильтры</h2>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition-colors">
                    <X size={12} /> Сбросить всё
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Budget slider */}
                <div>
                  <div className="flex justify-between text-xs mb-3">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Бюджет</span>
                    <span className="text-blue-400 font-black">до ${maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={200} max={6000} step={50}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                    <span>$200</span><span>$6,000</span>
                  </div>
                </div>

                {/* RAM */}
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Оперативная память</p>
                  <div className="flex flex-wrap gap-2">
                    {RAM_OPTIONS.map(r => (
                      <button
                        key={r}
                        onClick={() => setRam(r)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all ${
                          ram === r
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPU */}
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Видеокарта</p>
                  <div className="flex flex-wrap gap-2">
                    {GPU_OPTIONS.map(g => (
                      <button
                        key={g}
                        onClick={() => setGpu(g)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all ${
                          gpu === g
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                            : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="flex flex-col items-center justify-center glass-dark rounded-2xl p-4 border border-white/5 text-center">
                  <p className="text-4xl font-black text-white">{filtered.length}</p>
                  <p className="text-xs text-gray-400 mt-1">моделей найдено</p>
                  <div className="mt-3 w-full h-1 rounded-full bg-white/5">
                    <div
                      className="h-1 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(filtered.length / Math.max(1, allProducts.length)) * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Products Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 glass-dark rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-white mb-2">Ничего не найдено</p>
          <p className="text-gray-400 mb-6">Попробуйте изменить фильтры</p>
          <button onClick={resetFilters} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
