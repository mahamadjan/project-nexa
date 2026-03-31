'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Cpu, Zap, Truck, ShieldCheck, Laptop, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
           className="text-center p-12 glass rounded-[2.5rem] border border-[var(--glass-border)] max-w-sm"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
             <ShoppingBag size={34} className="text-gray-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase">ВАША КОРЗИНА ПУСТА</h1>
          <p className="text-[var(--text-muted)] mb-10 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">ВЫ ЕЩЕ НЕ ВЫБРАЛИ СВОЙ NEXA</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] shadow-2xl"
          >
            В КАТАЛОГ <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
          
          {/* ── LEFT: PREMIUM BLOCKY LIST ── */}
          <div className="flex-1">
             <div className="flex items-center justify-between mb-10 border-b border-[var(--glass-border)] pb-8">
                <div>
                   <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">КОРЗИНА [{items.length}]</h1>
                   <p className="text-[9px] font-black tracking-widest text-blue-500 uppercase mt-1">ПРЕМИАЛЬНЫЙ ВЫБОР · NEXA QUANTUM</p>
                </div>
                <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10">
                   <Trash2 size={14} /> ОЧИСТИТЬ
                </button>
             </div>

             <div className="space-y-6">
                <AnimatePresence>
                   {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        className="glass-dark rounded-[2.5rem] border border-[var(--glass-border)] flex flex-col sm:flex-row p-6 gap-8 hover:border-blue-500/20 group transition-all relative overflow-hidden"
                      >
                         {/* Large Square Image - Dignified & Normal */}
                         <div className="w-full sm:w-44 h-44 rounded-3xl bg-[var(--bg-subtle)] relative overflow-hidden shrink-0 border border-[var(--glass-border)] group-hover:scale-[1.02] transition-transform duration-500">
                            {item.image ? (
                               <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                                  <Laptop size={48} />
                                  <span className="text-[10px] font-black tracking-widest mt-2 uppercase">NEXA</span>
                               </div>
                            )}
                         </div>

                         {/* Content - Memorable High-End Balance */}
                         <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                  <p className="text-[10px] text-blue-500 font-extrabold tracking-[0.2em] mb-1 uppercase">{item.brand}</p>
                                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase leading-none tracking-tighter mb-2 line-clamp-1">{item.name}</h3>
                               </div>
                               <button 
                                 onClick={() => removeFromCart(item.id)}
                                 className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 size={18} />
                               </button>
                            </div>

                            {/* Micro-Specs Block */}
                            <div className="flex gap-4 mb-auto">
                               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-[var(--text-muted)]">
                                  <Cpu size={12} className="text-blue-500" /> i9-SERIES
                               </div>
                               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-[var(--text-muted)]">
                                  <Zap size={12} className="text-purple-500" /> RTX 40+
                               </div>
                            </div>

                            {/* Controls and Price - Perfectly Balanced */}
                            <div className="mt-8 flex items-end justify-between">
                               <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-1 rounded-2xl">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20" disabled={item.quantity <= 1}><Minus size={14} /></button>
                                  <span className="w-4 text-center font-black text-xs text-[var(--text-primary)]">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"><Plus size={14} /></button>
                               </div>
                               
                               <div className="text-right">
                                  {item.quantity > 1 && <p className="text-[10px] font-black text-[var(--text-muted)] mb-1 uppercase tracking-widest">${item.price.toLocaleString()} x {item.quantity}</p>}
                                  <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter leading-none">${(item.price * item.quantity).toLocaleString()}</p>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>

          {/* ── RIGHT: SUMMARY NORMAL & SOLID ── */}
          <div className="lg:w-[350px]">
             <div className="sticky top-28 glass rounded-[3rem] p-8 border border-[var(--glass-border)] shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                <h2 className="text-lg font-black text-[var(--text-primary)] mb-8 tracking-widest uppercase">ИТОГО К ОПЛАТЕ</h2>
                
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-center text-[10px] font-black text-[var(--text-muted)] tracking-[0.2em] uppercase">
                      <span>СУММА ТОВАРОВ</span>
                      <span className="text-[var(--text-primary)] tracking-normal text-sm">${totalPrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black text-[var(--text-muted)] tracking-[0.2em] uppercase">
                      <span>ЭКСПРЕСС-ДОСТАВКА</span>
                      <span className="text-green-500">FREE</span>
                   </div>
                   <div className="border-t border-[var(--glass-border)] pt-8 flex justify-between items-baseline mb-2">
                      <span className="text-[10px] font-black text-[var(--text-muted)] tracking-[0.2em] uppercase">К ОПЛАТЕ</span>
                      <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none">${totalPrice.toLocaleString()}</span>
                   </div>
                   <p className="text-[9px] text-green-500/70 font-black uppercase tracking-widest text-center">Бесплатная доставка по всему Казахстану включена</p>
                </div>

                <div className="space-y-4">
                   <Link
                     href="/checkout"
                     className="block w-full btn-premium py-6 rounded-2xl text-center text-xs font-black tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-white"
                   >
                     ОФОРМИТЬ ПОКУПКУ
                   </Link>
                   <Link
                     href="/catalog"
                     className="block w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-center text-[10px] font-black text-[var(--text-muted)] hover:text-white transition-all uppercase tracking-widest"
                   >
                     ПРОДОЛЖИТЬ ВЫБОР
                   </Link>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-30 grayscale saturate-0">
                   <ShieldCheck size={16} />
                   <div className="h-4 w-[1px] bg-white/20" />
                   <Truck size={16} />
                   <div className="h-4 w-[1px] bg-white/20" />
                   <ShoppingBag size={16} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
