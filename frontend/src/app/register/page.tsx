'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, AlertCircle, Chrome } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка при регистрации');
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          setError('Ошибка входа после регистрации');
        } else {
          router.push('/profile');
          router.refresh();
        }
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[30%] right-[15%] w-[350px] h-[350px] bg-purple-600/10 blur-[110px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute bottom-[25%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-600" />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Создать аккаунт</h1>
            <p className="text-gray-400 text-sm">Присоединяйтесь к эксклюзивному сообществу NEXA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl flex items-center gap-2 overflow-hidden"
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Ваше имя</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all"
                    placeholder="Александр"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Email адрес</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Пароль</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Зарегистрироваться <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
            <span className="relative bg-[#0a0a0c] px-4 text-xs text-gray-500 font-bold uppercase tracking-widest">Или</span>
          </div>

          <button 
             onClick={() => signIn('google')}
             className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group"
          >
            <Chrome size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
            Регистрация через Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-purple-400 hover:underline font-bold">Войти</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
