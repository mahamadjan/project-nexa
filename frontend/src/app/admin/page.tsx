'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';

// ─── ADMIN CREDENTIALS — change these to your own ───
const ADMIN_EMAIL    = 'admin@nexa.kg';
const ADMIN_PASSWORD = 'NexaAdmin2024!';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  // Already logged in?
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('nexa_admin') === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('nexa_admin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Неверный email или пароль администратора');
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.2)', '0 0 40px rgba(239,68,68,0.4)', '0 0 20px rgba(239,68,68,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center"
            >
              <Shield size={32} className="text-red-400" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">NEXA Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Доступ только для администраторов</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-bold">
                {error}
              </motion.div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email администратора</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@nexa.kg"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-red-500/50 outline-none transition-all" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Пароль</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 pr-12 text-white placeholder:text-gray-600 focus:border-red-500/50 outline-none transition-all" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm tracking-wider text-white transition-all mt-2"
              style={{ background: loading ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg, #dc2626, #7c3aed)', boxShadow: loading ? 'none' : '0 8px 32px rgba(220,38,38,0.3)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Проверка...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Lock size={14} /> Войти в панель</span>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-600 mt-6">
            Несанкционированный доступ запрещён · NEXA Security
          </p>
        </div>
      </motion.div>
    </div>
  );
}
