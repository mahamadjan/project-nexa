'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const ALL_PRODUCTS = [
  { id: '1', name: 'NexaBlade 16',  brand: 'NEXA', type: 'GAMING', cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4090 16GB', ram: '64GB DDR5',       price: 3499, storage: '2TB NVMe', display: '16" 4K 144Hz' },
  { id: '2', name: 'ProBook Ultra', brand: 'NEXA', type: 'OFFICE', cpu: 'Apple M3 Max',          gpu: '40-core GPU',    ram: '128GB Unified',    price: 3999, storage: '4TB SSD',  display: '16" Retina XDR' },
  { id: '3', name: 'Stealth 14',    brand: 'NEXA', type: 'GAMING', cpu: 'AMD Ryzen 9 8945HS',    gpu: 'RTX 4070 8GB',   ram: '32GB DDR5',        price: 1899, storage: '1TB NVMe', display: '14" QHD 240Hz' },
  { id: '4', name: 'ZenWork 15',    brand: 'NEXA', type: 'OFFICE', cpu: 'Intel Core Ultra 7',    gpu: 'Intel Arc',      ram: '32GB LPDDR5X',     price: 1499, storage: '1TB SSD',  display: '15" FHD OLED' },
  { id: '5', name: 'NexaBlade 14',  brand: 'NEXA', type: 'GAMING', cpu: 'Intel Core i7-14700HX', gpu: 'RTX 4060 8GB',   ram: '16GB DDR5',        price: 1299, storage: '512GB NVMe', display: '14" FHD 165Hz' },
  { id: '6', name: 'WorkStation X', brand: 'NEXA', type: 'OFFICE', cpu: 'Intel Core Ultra 9',    gpu: 'RTX 4080 12GB',  ram: '64GB DDR5',        price: 2799, storage: '2TB SSD',  display: '17" 4K OLED' },
];

const RAM_OPTIONS  = ['Все', '16GB', '32GB', '64GB', '128GB'];
const GPU_OPTIONS  = ['Все', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'Apple M3', 'Intel Arc'];
const TYPE_OPTIONS = [
  { id: 'ALL',    label: 'Все',        emoji: '✦' },
  { id: 'GAMING', label: 'Игровые',   emoji: '🎮' },
  { id: 'OFFICE', label: 'Для работы', emoji: '💼' },
];

export default function Catalog() {
  const [allProducts, setAllProducts] = useState(ALL_PRODUCTS);
  const [type,       setType]       = useState('ALL');
  const [maxPrice,   setMaxPrice]   = useState(4500);
  const [ram,        setRam]        = useState('Все');
  const [gpu,        setGpu]        = useState('Все');
  const [sortBy,     setSortBy]     = useState('default');
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => { 
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexa_products');
      if (stored) {
        try { setAllProducts(JSON.parse(stored)); } catch(e){}
      }
    }
    setTimeout(() => setLoading(false), 600); 
  }, []);

  const filtered = useMemo(() => {
    let res = allProducts.filter(p => {
      if (type !== 'ALL' && p.type !== type) return false;
      if (p.price > maxPrice) return false;
      if (ram  !== 'Все' && !p.ram.startsWith(ram))  return false;
      if (gpu  !== 'Все' && !p.gpu.includes(gpu))     return false;
      return true;
    });
    if (sortBy === 'price-asc')  res = [...res].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') res = [...res].sort((a, b) => b.price - a.price);
    return res;
  }, [type, maxPrice, ram, gpu, sortBy]);

  const activeFilterCount = [
    type !== 'ALL',
    maxPrice < 4500,
    ram !== 'Все',
    gpu !== 'Все',
  ].filter(Boolean).length;

  const resetFilters = () => { setType('ALL'); setMaxPrice(4500); setRam('Все'); setGpu('Все'); setSortBy('default'); };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono tracking-widest text-blue-400 mb-2 uppercase">NEXA · {filtered.length} моделей</motion.p>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-bold tracking-tight">
            Наш <span className="text-gradient">Каталог</span>
          </motion.h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none glass border border-white/10 text-sm text-gray-300 px-4 py-2.5 pr-8 rounded-xl outline-none cursor-pointer bg-transparent"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: дешевле</option>
              <option value="price-desc">Цена: дороже</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setPanelOpen(!panelOpen)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={panelOpen
              ? { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.5)', color: '#60a5fa' }
              : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }
            }
          >
            <SlidersHorizontal size={16} /> Фильтры
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-[9px] font-black flex items-center justify-center text-white">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
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
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
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
                    min={1000} max={4500} step={100}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                    <span>$1,000</span><span>$4,500</span>
                  </div>
                </div>

                {/* RAM */}
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Оперативная память</p>
                  <div className="flex flex-wrap gap-2">
                    {RAM_OPTIONS.map(r => (
                      <button
                        key={r}
                        onClick={() => setRam(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          ram === r
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                            : 'bg-white/4 border-white/8 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPU */}
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Видеокарта</p>
                  <div className="flex flex-wrap gap-2">
                    {GPU_OPTIONS.map(g => (
                      <button
                        key={g}
                        onClick={() => setGpu(g)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                          gpu === g
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                            : 'bg-white/4 border-white/8 text-gray-400 hover:border-white/20'
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
