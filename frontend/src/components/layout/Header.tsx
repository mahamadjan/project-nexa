'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Sun, Moon, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold tracking-tighter text-gradient">NEXA</span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/catalog" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Каталог</Link>
              <Link href="/catalog?type=gaming" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Игровые</Link>
              <Link href="/catalog?type=office" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Для работы</Link>
            </div>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
              className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 shrink-0"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                  : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)',
                boxShadow: theme === 'dark' ? '0 0 12px rgba(96,165,250,0.3)' : '0 0 12px rgba(251,191,36,0.3)',
              }}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                style={{
                  marginLeft: theme === 'dark' ? '0px' : '28px',
                  background: theme === 'dark'
                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                }}
              >
                {theme === 'dark' ? <Moon size={11} className="text-white" /> : <Sun size={11} className="text-white" />}
              </motion.div>
            </motion.button>

            {/* Animated Profile/Login Button */}
            <Link href={session ? "/profile" : "/login"} className="relative group flex items-center gap-2">
              {!session && (
                 <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors tracking-widest hidden lg:block">ВХОД</span>
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${session ? 'from-green-500/20 to-blue-500/20' : 'from-blue-500/20 to-purple-500/20'} border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:border-blue-500/50 transition-all overflow-hidden relative shadow-lg`}
              >
                {/* Background pulse animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.5, 0.2] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className={`absolute inset-0 ${session ? 'bg-green-500/10' : 'bg-blue-500/10'} blur-xl`}
                />
                {session?.user?.image ? (
                   <img src={session.user.image} className="w-full h-full object-cover relative z-10" alt="Profile" />
                ) : (
                   <User size={20} className="relative z-10" />
                )}
              </motion.div>
            </Link>

            <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden items-center gap-3">
             {/* Mobile Theme Toggle removed for brevity in this replace call */}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-dark border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/catalog" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Каталог</Link>
            <Link href="/cart" className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <ShoppingCart size={16} /> Корзина {totalItems > 0 && `(${totalItems})`}
            </Link>
            <Link href={session ? "/profile" : "/login"} className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <User size={16} /> {session ? 'Профиль' : 'Войти'}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
