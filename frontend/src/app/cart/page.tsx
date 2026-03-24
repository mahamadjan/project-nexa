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
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="sm:hidden absolute top-4 right-4 text-gray-500 hover:text-red-400 p-1"
                >
                  <Trash2 size={18} />
                </button>

                {/* Icon/Image placeholder */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs text-gray-500 font-mono">3D</span>
                </div>

                <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                  <p className="text-[10px] sm:text-xs text-blue-400 font-bold tracking-widest mb-0.5 sm:mb-1 uppercase">{item.brand} · {item.type === 'GAMING' ? 'Игровой' : 'Для работы'}</p>
                  <h3 className="text-base sm:text-lg font-bold truncate">{item.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">${item.price.toLocaleString()} за шт.</p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-10 border-t border-white/5 sm:border-none pt-4 sm:pt-0">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/5"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg sm:text-xl font-black text-white">${(item.price * item.quantity).toLocaleString()}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hidden sm:inline-flex text-gray-500 hover:text-red-400 transition-colors mt-1 items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Удалить
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          layout
          className="glass-dark rounded-[2rem] p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <h2 className="text-lg font-black uppercase tracking-widest text-gray-400 mb-6 font-mono">Сводка заказа</h2>
          
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

          <div className="flex justify-between items-baseline text-xl sm:text-3xl font-black border-t border-white/10 pt-6 mb-8">
            <span className="text-sm uppercase tracking-widest text-gray-500">Всего к оплате</span>
            <span className="text-white font-mono">${totalPrice.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/catalog"
              className="order-2 sm:order-1 flex items-center justify-center gap-2 text-gray-400 hover:text-white font-bold py-4 transition-colors text-sm uppercase tracking-widest"
            >
              ← Продолжить покупки
            </Link>
            <Link
              href="/checkout"
              className="order-1 sm:order-2 bg-white text-black font-black py-4 px-8 rounded-2xl text-center hover:bg-blue-400 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-2 uppercase tracking-tight text-sm"
            >
              Оформить заказ <Plus size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

