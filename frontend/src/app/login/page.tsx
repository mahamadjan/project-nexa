'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
      }

      router.push('/profile');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Ошибка авторизации';
      if (err.message === 'Email rate limit exceeded') {
        msg = 'Лимит писем исчерпан. Пожалуйста, подождите или попросите админа отключить подтверждение Email в консоли Supabase.';
      }
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google login error:', err);
      alert('Ошибка при попытке входа через Google.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass border border-white/10 rounded-[3rem] p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
          
          <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Shield size={12} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">NEXA SECURE AUTH</span>
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight mb-2">
               {isLogin ? 'С возвращением' : 'Создать аккаунт'}
             </h1>
             <p className="text-gray-500 text-sm">
                {isLogin ? 'Рады видеть вас снова в NEXA Global' : 'Присоединяйтесь к сообществу профессионалов'}
             </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User size={18} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-bold"
                />
              </div>
            )}

            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email адрес" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-bold"
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-bold italic"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 mt-4 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-gray-700">
             <div className="flex-1 h-px bg-white/5" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Или войти через</span>
             <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
             <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors">
                <Github size={20} />
             </button>
             <button 
                type="button"
                onClick={handleGoogleLogin} 
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Chrome size={20} />
             </button>
          </div>

          <p className="text-center mt-10 text-sm text-gray-500">
            {isLogin ? 'У вас еще нет аккаунта?' : 'Уже есть аккаунт?'}
            <button 
               onClick={() => setIsLogin(!isLogin)}
               className="ml-2 text-white font-black hover:text-blue-400 underline decoration-blue-500/50 underline-offset-4"
            >
               {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
