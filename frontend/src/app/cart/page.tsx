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
                className="glass-dark rounded-2xl p-6 flex items-center gap-6"
              >
                {/* Icon placeholder */}
                <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs text-gray-500 font-mono">3D</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-400 font-bold tracking-widest mb-1">{item.brand} · {item.type === 'GAMING' ? 'Игровой' : 'Для работы'}</p>
                  <h3 className="text-lg font-bold truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm">${item.price.toLocaleString()} за шт.</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right shrink-0 w-28">
                  <p className="text-xl font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          layout
          className="glass-dark rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold mb-4">Сводка заказа</h2>
          <div className="space-y-2 text-sm text-gray-400 mb-4">
            <div className="flex justify-between">
              <span>Итого ({items.reduce((s, i) => s + i.quantity, 0)} тов.)</span>
              <span className="text-white">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка</span>
              <span className="text-green-400">Бесплатно</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-6">
            <span>Всего</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-center hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
          >
            Перейти к оплате →
          </Link>
          <Link
            href="/catalog"
            className="block text-center text-gray-400 hover:text-white mt-4 text-sm transition-colors"
          >
            ← Продолжить покупки
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
