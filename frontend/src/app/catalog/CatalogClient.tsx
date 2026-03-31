'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const RAM_OPTIONS  = ['Все', '8GB', '16GB', '18GB', '32GB', '64GB', '96GB', '128GB'];
const GPU_OPTIONS  = ['Все', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RTX 5000', 'Apple M', 'Intel Arc', 'Radeon', 'UHD'];
const TYPE_OPTIONS = [
  { id: 'ALL',    label: 'Все',        emoji: '✦' },
  { id: 'GAMING', label: 'Игровые',   emoji: '🎮' },
  { id: 'OFFICE', label: 'Для работы', emoji: '💼' },
];

export default function CatalogClient({ initialProducts = [] }: { initialProducts: any[] }) {
  // SSR Hydration: State matches server exactly. NO FLICKER!
  const [allProducts, setAllProducts] = useState<any[]>(initialProducts);
  const [search,      setSearch]     = useState('');
  const [type,       setType]       = useState('ALL');
  const [maxPrice,   setMaxPrice]   = useState(6000);
  const [ram,        setRam]        = useState('Все');
  const [gpu,        setGpu]        = useState('Все');
  const [sortBy,     setSortBy]     = useState('default');
  const [panelOpen,  setPanelOpen]  = useState(false);
  
  const initialFetchRef = useRef(false);

  useEffect(() => { 
    if (initialFetchRef.current) return;
    initialFetchRef.current = true;

    const syncProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data) {
           const currentReduced = allProducts.map(p => `${p.id}-${p.price}`).sort().join('|');
           const newReduced     = data.map(p => `${p.id}-${p.price}`).sort().join('|');
           if (currentReduced !== newReduced) {
              setAllProducts(data);
           }
        }
      } catch (err) {
        console.error('Products sync error:', err);
      }
    };
    
    // Silent sync after mount
    const timer = setTimeout(syncProducts, 2000);

    const handleProductsUpdate = () => {
      initialFetchRef.current = false;
      syncProducts();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('nexa_products_updated', handleProductsUpdate);
    }
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('nexa_products_updated', handleProductsUpdate);
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
    search !== '', type !== 'ALL', maxPrice < 6000, ram !== 'Все', gpu !== 'Все',
  ].filter(Boolean).length;

  const resetFilters = () => { setSearch(''); setType('ALL'); setMaxPrice(6000); setRam('Все'); setGpu('Все'); setSortBy('default'); };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
           <p className="text-[10px] font-black tracking-[0.2em] text-blue-500 mb-2 uppercase">NEXA INTELLIGENCE · {filtered.length} МОДЕЛЕЙ</p>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
             НАШ <span className="text-gradient">КАТАЛОГ</span>
           </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-sm text-white pl-12 pr-10 py-4 rounded-2xl outline-none focus:border-blue-500/50" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
          <button onClick={() => setPanelOpen(!panelOpen)} className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase border tracking-widest ${panelOpen ? 'btn-premium text-white' : 'bg-white/[0.03] text-gray-400 border-white/10'}`}>
            ФИЛЬТРЫ {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {TYPE_OPTIONS.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${type === t.id ? 'btn-premium' : 'bg-white/[0.03] border-white/8 text-gray-400 hover:text-white'}`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="glass border border-white/10 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-3">Бюджет до ${maxPrice.toLocaleString()}</p>
                  <input type="range" min={200} max={6000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-1.5 accent-blue-500" />
               </div>
               <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-3">RAM</p>
                  <div className="flex flex-wrap gap-1">
                    {RAM_OPTIONS.slice(0,6).map(r => <button key={r} onClick={() => setRam(r)} className={`px-2 py-1 text-[10px] rounded-lg border ${ram === r ? 'bg-blue-600/20 border-blue-500' : 'border-white/5'}`}>{r}</button>)}
                  </div>
               </div>
               <div className="flex items-center justify-end">
                  <button onClick={resetFilters} className="text-xs text-red-400 font-bold hover:underline">Сбросить всё</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 transition-none">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
