'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  // Beautiful theme toggle pill – shared between mobile + desktop
  const ThemeToggle = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
    const isSmall = size === 'sm';
    return (
      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.88 }}
        aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        className="relative flex items-center rounded-full shrink-0 transition-all duration-300"
        style={{
          width: isSmall ? 52 : 56,
          height: isSmall ? 26 : 28,
          padding: '3px',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1e293b, #0f172a)'
            : 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: theme === 'dark'
            ? '1px solid rgba(255,255,255,0.15)'
            : '1px solid rgba(251,191,36,0.4)',
          boxShadow: theme === 'dark'
            ? '0 0 14px rgba(96,165,250,0.3), inset 0 1px 2px rgba(0,0,0,0.4)'
            : '0 0 14px rgba(251,191,36,0.4), inset 0 1px 2px rgba(255,255,255,0.6)',
        }}
      >
        {/* Track icons */}
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Moon size={10} className={theme === 'dark' ? 'text-blue-300' : 'text-amber-300 opacity-0'} />
        </span>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Sun size={10} className={theme === 'dark' ? 'text-blue-400 opacity-0' : 'text-amber-500'} />
        </span>

        {/* Sliding thumb */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          className="rounded-full flex items-center justify-center shadow-md z-10 absolute"
          style={{
            width: isSmall ? 20 : 22,
            height: isSmall ? 20 : 22,
            top: '50%',
            transform: 'translateY(-50%)',
            left: theme === 'dark' ? 3 : (isSmall ? 29 : 31),
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
              : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            boxShadow: theme === 'dark'
              ? '0 2px 8px rgba(99,102,241,0.6)'
              : '0 2px 8px rgba(245,158,11,0.6)',
          }}
        >
          {theme === 'dark'
            ? <Moon size={11} className="text-white" />
            : <Sun size={11} className="text-white" />}
        </motion.div>
      </motion.button>
    );
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMenu}>
            <span className="text-xl font-bold tracking-tighter text-gradient">NEXA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-baseline space-x-6">
            <Link href="/catalog" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Каталог</Link>
            <Link href="/catalog?type=gaming" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Игровые</Link>
            <Link href="/catalog?type=office" className="hover:text-white text-gray-300 px-3 py-2 rounded-md transition-colors text-sm font-medium">Для работы</Link>
          </nav>

          {/* Desktop right icons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle size="md" />
            <Link href={session ? "/profile" : "/login"} className="relative group flex items-center gap-2">
              {!session && (
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors tracking-widest hidden lg:block">ВХОД</span>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${session ? 'from-green-500/20 to-blue-500/20' : 'from-blue-500/20 to-purple-500/20'} border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:border-blue-500/50 transition-all overflow-hidden relative shadow-lg`}
              >
                <motion.div animate={{ scale: [1,1.4,1], opacity: [0.2,0.5,0.2] }} transition={{ duration: 3, repeat: Infinity }}
                  className={`absolute inset-0 ${session ? 'bg-green-500/10' : 'bg-blue-500/10'} blur-xl`} />
                {session?.user?.image
                  ? <img src={session.user.image} className="w-full h-full object-cover relative z-10" alt="Profile" />
                  : <User size={20} className="relative z-10" />}
              </motion.div>
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Mobile right: theme + cart + burger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white" onClick={closeMenu}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2 rounded-xl" aria-label="Меню">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-dark border-t border-white/8 px-4 py-4 space-y-1">
              {/* Current theme label */}
              <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-2xl bg-white/4 border border-white/8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {theme === 'dark' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
                </span>
                <ThemeToggle size="sm" />
              </div>

              {[
                { href: '/catalog',                label: '🗂️  Каталог' },
                { href: '/catalog?type=gaming',    label: '🎮  Игровые' },
                { href: '/catalog?type=office',    label: '💼  Для работы' },
                { href: '/cart',                   label: `🛒  Корзина${totalItems > 0 ? ` (${totalItems})` : ''}` },
                { href: session ? '/profile' : '/login', label: session ? '👤  Профиль' : '🔐  Войти' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} onClick={closeMenu}
                  className="block px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/6 active:bg-white/10 transition-all">
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
