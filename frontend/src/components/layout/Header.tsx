'use client';
// v2.6: Fix for 'Link is not defined' cache issue
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, Sun, Moon, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/components/auth/AuthProvider';

const ThemeToggle = ({ theme, toggleTheme, size = 'md' }: { theme: 'dark' | 'light', toggleTheme: () => void, size?: 'sm' | 'md' }) => {
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      className={`flex items-center justify-center rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 ${
        size === 'md' ? 'w-10 h-10' : 'w-9 h-9'
      }`}
    >
      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} className="text-amber-500" />}
    </button>
  );
};

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { user } = useAuth();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] border-b border-black md:border-black/10 dark:md:border-white/5 dark:border-white/10 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMenu}>
            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-gradient">NEXA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link href="/" onClick={handleHomeClick} className="hover:text-white text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">Главная</Link>
            <Link href="/catalog" className="hover:text-white text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">Каталог</Link>
            <Link href="/anatomy" className="hover:text-white text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">3D Анатомия</Link>
            <button onClick={() => { if(typeof window !== 'undefined') window.dispatchEvent(new Event('open_nexa_ai')) }} className="hover:text-white text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="mb-0.5" /> Подбор ИИ</span>
            </button>
          </nav>

          {/* Desktop right icons */}
          <div className="hidden md:flex items-center space-x-1">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} size="md" />

            <Link href="/favorites" className="flex items-center justify-center w-10 h-10 hover:text-white text-gray-400 rounded-xl hover:bg-white/5 transition-all relative">
              <Heart size={20} /> 
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg pointer-events-none z-20">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link href="/cart" className="flex items-center justify-center w-10 h-10 hover:text-white text-gray-400 rounded-xl hover:bg-white/5 transition-all relative">
              <ShoppingCart size={20} /> 
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg pointer-events-none z-20">
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <Link href={user ? "/profile" : "/login"} className="flex items-center justify-center w-10 h-10 hover:text-white text-gray-400 rounded-xl hover:bg-white/5 transition-all relative overflow-hidden">
               {user && (user as any).user_metadata?.avatar_url ? (
                 <img src={(user as any).user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={20} />
               )}
            </Link>
          </div>

          {/* Mobile right: theme + cart + user + burger */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} size="sm" />
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white" onClick={closeMenu}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
                       <Link href={user ? "/profile" : "/login"} onClick={closeMenu} className="p-2 text-gray-300 hover:text-white">
               <User size={20} className={user ? "text-blue-400" : ""} />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="ml-1 text-gray-400 hover:text-white p-2 rounded-xl" aria-label="Меню">
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
            <div className="bg-[var(--bg-secondary)] border-t border-[var(--glass-border)] px-4 py-4 space-y-1 shadow-2xl">
              {/* Current theme label */}
              <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-2xl bg-white/4 border border-[var(--glass-border)]">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {theme === 'dark' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
                </span>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} size="sm" />
              </div>

              {[
                { href: '/',           label: 'Главная' },
                { href: '/catalog',    label: 'Каталог' },
                { href: '/anatomy',    label: '3D Анатомия' },
                { isAction: true, id: 'ai_mobile', label: 'Подбор ИИ' },
                { href: '/cart',                   label: `Корзина${totalItems > 0 ? ` (${totalItems})` : ''}` },
                { href: '/favorites',                label: `Избранное${favorites.length > 0 ? ` (${favorites.length})` : ''}` },
              ].map((item) => {
                if ('isAction' in item) {
                  return (
                    <button key={item.id} onClick={() => { closeMenu(); if(typeof window !== 'undefined') window.dispatchEvent(new Event('open_nexa_ai')); }}
                      className="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/6 active:bg-white/10 transition-all">
                      {item.label}
                    </button>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} onClick={item.href === '/' ? handleHomeClick : closeMenu}
                    className="block px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/6 active:bg-white/10 transition-all">
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
