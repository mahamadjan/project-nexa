'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Mail, Settings, ShieldCheck, CreditCard, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="relative min-h-screen overflow-hidden py-12 px-4 shadow-inner">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-6 mb-12"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white/5 shadow-2xl relative">
            {session.user.image ? (
               <img src={session.user.image} className="w-full h-full rounded-full object-cover" alt="Profile" />
            ) : (
               <User size={48} className="text-white" />
            )}
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gradient text-[var(--text-primary)]">
              {session.user.name || 'Пользователь'}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold rounded-full uppercase tracking-widest">
                Аккаунт NEXA
              </span>
              <span className="text-[var(--text-muted)] text-sm font-mono">{session.user.email}</span>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 space-y-6"
          >
            <div className="glass border border-[var(--glass-border)] rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mb-4">Данные аккаунта</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-muted)] flex items-center gap-2"><Box size={14} /> Заказов</span>
                    <span className="text-[var(--text-primary)] font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-muted)] flex items-center gap-2"><CreditCard size={14} /> Бонусы</span>
                    <span className="text-blue-500 font-bold">0 ₽</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-2 bg-red-500/5 text-red-500 hover:bg-red-500/10 border border-red-500/20 py-3 rounded-2xl transition-all font-semibold"
            >
              <LogOut size={18} /> Выйти из системы
            </button>
          </motion.div>

          {/* Settings Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="glass border border-[var(--glass-border)] rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-[var(--text-primary)]">
                  <Settings size={120} />
               </div>
               
               <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Настройки Безопасности</h3>
               
               <div className="space-y-6">
                 <div className="flex items-center justify-between py-4 border-b border-[var(--glass-border)]">
                   <div>
                     <p className="text-[var(--text-primary)] font-semibold">Двухфакторная аутентификация</p>
                     <p className="text-[var(--text-muted)] text-sm">Ваш аккаунт защищен</p>
                   </div>
                   <div className="w-12 h-6 bg-blue-600/20 border border-blue-600/30 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full translate-x-6 transition-transform shadow-lg shadow-blue-500/50" />
                   </div>
                 </div>

                 <div className="flex items-center justify-between py-4 border-b border-[var(--glass-border)]">
                   <div>
                     <p className="text-[var(--text-primary)] font-semibold">Уведомления</p>
                     <p className="text-[var(--text-muted)] text-sm">Получать отчеты о сессиях</p>
                   </div>
                   <div className="w-12 h-6 bg-[var(--glass-bg-accent)] rounded-full flex items-center px-1 border border-[var(--glass-border)] shadow-inner">
                      <div className="w-4 h-4 bg-gray-500 rounded-full" />
                   </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-500/20">
                      Сохранить изменения
                    </button>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
