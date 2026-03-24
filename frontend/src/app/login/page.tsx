'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome, AlertCircle, Fingerprint } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      setError('Что-то пошло не так. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 overflow-hidden bg-[#0A0A0A]">
      {/* Premium OS Desktop Background (Abstract Gradients) */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] bg-gradient-to-br from-indigo-500/30 to-purple-600/30 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[80%] bg-gradient-to-tl from-blue-500/20 to-teal-500/20 blur-[130px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-[28rem] z-10"
      >
        {/* Sleek MacOS/Windows 11 Style Application Window */}
        <div className="backdrop-blur-[40px] bg-[var(--bg-primary)]/70 border border-white/10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* subtle interior glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Window Header (Traffic Lights) */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Nexa System Logon</div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 text-white">
                <Fingerprint size={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold mb-1 tracking-tight text-[var(--text-primary)]">С возвращением</h1>
              <p className="text-[var(--text-muted)] text-sm">Доступ к вашей учетной записи</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl flex items-center gap-2 overflow-hidden"
                  >
                    <AlertCircle size={16} className="shrink-0" /> 
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(email === '' ? e.target.value.trim() : e.target.value)}
                    required
                    className="w-full bg-[var(--glass-bg-accent)] text-[var(--text-primary)] border border-white/10 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all placeholder-gray-500 shadow-inner text-sm"
                    placeholder="Ваш email адрес"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[var(--glass-bg-accent)] text-[var(--text-primary)] border border-white/10 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all placeholder-gray-500 shadow-inner text-sm"
                    placeholder="Пароль"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 font-semibold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full animate-spin" />
                ) : (
                  <>Войти в систему <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
              <span className="relative px-3 text-xs font-medium text-gray-400 bg-transparent backdrop-blur-md rounded-full border border-white/10 py-1">или</span>
            </div>

            <button 
               onClick={(e) => {
                 e.preventDefault();
                 signIn('credentials', { redirect: true, callbackUrl: '/profile', email: 'user@google.com', password: 'mock' });
               }}
               className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-[var(--text-primary)] font-medium py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <Chrome size={18} className="text-blue-400" /> 
              Продолжить через Google
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
