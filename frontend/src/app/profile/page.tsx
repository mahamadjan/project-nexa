'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const syncData = () => {
      // 1. Проверяем авторизацию
      const session = localStorage.getItem('nexa_user_session');
      if (!session) {
        router.push('/login');
        return;
      }
      const userData = JSON.parse(session);
      setUser(userData);

      // 2. Загружаем именно его заказы (синхронно с тем, что видит админ)
      // Мы используем localStorage как общую "базу данных"
      const allOrders = JSON.parse(localStorage.getItem('nexa_orders') || '[]');
      
      // Фильтруем заказы по Email пользователя (без учета регистра)
      const userOrders = allOrders.filter((o: any) => 
        o.email && userData.email && o.email.toLowerCase() === userData.email.toLowerCase()
      );
      setOrders(userOrders);
    };

    syncData();

    // Слушаем события обновления заказов из чекаута или админки
    window.addEventListener('nexa_orders_updated', syncData);
    window.addEventListener('storage', syncData); // Для синхронизации между вкладками
    
    return () => {
      window.removeEventListener('nexa_orders_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('nexa_user_session');
    window.dispatchEvent(new Event('storage')); // Обновляем шапку
    router.push('/login');
  };

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4 relative">
               <User size={40} className="text-blue-400" />
               <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full" />
            </div>
            <h2 className="text-xl font-black truncate">{user.name}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Клиент NEXA</p>
            
            <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
               <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 text-blue-400 font-bold text-sm">
                  <div className="flex items-center gap-3"><Package size={18}/> Мои заказы</div>
                  <ChevronRight size={14} />
               </button>
               <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-red-400 font-bold text-sm transition-colors mt-4"
               >
                  <LogOut size={18}/> Выйти из аккаунта
               </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black tracking-tight mb-2">Ваши покупки</h1>
            <p className="text-gray-500">Здесь отображается актуальный статус ваших заказов</p>
          </motion.div>

          {orders.length === 0 ? (
            <div className="glass border border-white/5 rounded-[2.5rem] p-20 text-center">
               <Package size={48} className="mx-auto text-gray-700 mb-4" />
               <p className="text-gray-400 font-bold">У вас пока нет активных заказов</p>
               <Link href="/catalog" className="text-blue-400 font-black text-sm uppercase mt-4 inline-block hover:underline tracking-widest">
                  Заказать NexaBlade →
               </Link>
            </div>
          ) : (
            <div className="space-y-6">
               {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass border border-white/10 rounded-[2.5rem] overflow-hidden"
                  >
                     <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-32 h-32 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center shrink-0">
                           <span className="text-[10px] text-gray-600 font-black uppercase text-center px-2">{order.product}</span>
                        </div>

                        <div className="flex-1 space-y-4">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">НОМЕР {order.id}</p>
                                 <h3 className="text-xl font-black">{order.product}</h3>
                              </div>
                              <div className="text-left sm:text-right">
                                 <p className="text-2xl font-black text-white">${order.amount.toLocaleString()}</p>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.date}</p>
                              </div>
                           </div>

                           {/* Real-time Status Progress */}
                           <div className="pt-4">
                              <div className="flex justify-between mb-4">
                                 {[
                                   { id: 'new', label: 'Заказ принят', icon: Clock },
                                   { id: 'processing', label: 'Сборка/Тесты', icon: Settings },
                                   { id: 'shipped', label: 'Передан курьеру', icon: Truck },
                                   { id: 'delivered', label: 'Доставлен', icon: CheckCircle2 },
                                 ].map((step, sIdx) => {
                                   const statusFlow = ['new', 'processing', 'shipped', 'delivered'];
                                   const currentIndex = statusFlow.indexOf(order.status);
                                   const isPast = currentIndex >= sIdx;
                                   const isCancelled = order.status === 'cancelled';
                                   
                                   if (isCancelled && sIdx > 0) return null;

                                   return (
                                     <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                          isCancelled ? 'bg-red-500 text-white' :
                                          isPast ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 border-2 border-white/20' : 'bg-white/5 text-gray-600'
                                        }`}>
                                           {isCancelled && sIdx === 0 ? <XCircle size={18} /> : <step.icon size={18} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest text-center ${isPast ? 'text-white' : 'text-gray-600'}`}>
                                          {isCancelled ? 'Заказ отменен' : step.label}
                                        </span>
                                     </div>
                                   )
                                 })}
                              </div>
                              
                              {/* Progress bar background */}
                              {order.status !== 'cancelled' && (
                                <div className="relative h-1 bg-white/5 rounded-full overflow-hidden -mt-11 mx-12 mb-10">
                                   <motion.div 
                                      className="absolute top-0 left-0 h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"
                                      initial={{ width: 0 }}
                                      animate={{ 
                                         width: order.status === 'new' ? '0%' : 
                                                order.status === 'processing' ? '33%' :
                                                order.status === 'shipped' ? '66%' :
                                                order.status === 'delivered' ? '100%' : '0%' 
                                      }}
                                   />
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
