'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-600" />
          <h1 className="text-3xl font-bold mb-2">Ваша корзина пуста</h1>
          <p className="text-gray-400 mb-8">Добавьте ноутбуки из каталога, чтобы начать покупки.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Перейти в каталог
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Ваша Корзина</h1>
          <button
            onClick={clearCart}
            className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
          >
            <Trash2 size={14} /> Очистить всё
          </button>
        </div>

        <div className="space-y-4 mb-10">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-dark rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative"
              >
                {/* Remove button for mobile (Top Right) */}
                <div className="flex flex-row items-center gap-3 sm:gap-6 w-full">
                  {/* Icon/Image placeholder */}
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-gray-600 font-mono">NEXA</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-xs text-blue-400 font-bold tracking-widest mb-0.5 uppercase">{item.brand}</p>
                    <h3 className="text-sm sm:text-lg font-bold truncate">{item.name}</h3>
                    <p className="text-gray-500 text-[10px] sm:text-sm">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm sm:text-xl font-black text-white">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  {/* Desktop delete button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="hidden sm:flex text-gray-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Mobile delete button (Swipe or small button) */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="sm:hidden absolute -top-1 -right-1 bg-red-500/10 text-red-500 p-1.5 rounded-full border border-red-500/20"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          layout
          className="glass-dark rounded-[2rem] p-5 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <h2 className="text-sm sm:text-lg font-black uppercase tracking-widest text-gray-500 mb-4 font-mono">Сводка заказа</h2>
          
          <div className="space-y-3 text-sm sm:text-base text-gray-400 mb-6">
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-gray-300 transition-colors">Товары ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="text-white font-mono">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-gray-300 transition-colors">Экспресс-доставка</span>
              <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">Бесплатно</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline text-xl sm:text-3xl font-black border-t border-white/10 pt-5 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">К оплате</span>
            <span className="text-white font-mono">${totalPrice.toLocaleString()}</span>
          </div>

          <div className="flex gap-3">
            <Link
              href="/catalog"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-gray-400 hover:text-white font-bold py-3.5 rounded-xl transition-colors text-[10px] uppercase tracking-widest border border-white/5"
            >
              ← Назад
            </Link>
            <Link
              href="/checkout"
              className="flex-[2] btn-premium text-white font-black py-4 px-6 rounded-2xl text-center flex items-center justify-center gap-2 uppercase tracking-tight text-xs shadow-xl shadow-blue-600/20"
            >
              Оформить <Plus size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

