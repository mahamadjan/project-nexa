'use client';
// Cache bust: force Next.js Turbopack to recompile this specific file
import { useState, useEffect, useRef } from 'react';
import { User, Package, Settings, LogOut, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Mail, MapPin, Edit2, Save, X, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ClientProfileDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.updateUser({
        data: { full_name: editName, avatar_url: editAvatar }
      });
      if (error) throw error;
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения');
    }
  };

  const startEditing = () => {
    setEditName(user?.user_metadata?.full_name || '');
    setEditAvatar(user?.user_metadata?.avatar_url || '');
    setIsEditing(true);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        // First try to get by user_id (most reliable)
        let { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        // If no results by user_id, try by email (for older orders)
        if ((!data || data.length === 0) && user.email) {
          const res = await supabase
            .from('orders')
            .select('*')
            .eq('email', user.email)
            .order('created_at', { ascending: false });
          data = res.data;
          error = res.error;
        }
        
        if (error) {
          console.error('Fetch orders error:', error);
          return;
        }
        if (data) setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
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
          <div className="glass border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden fade-in-up">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            {isEditing ? (
              <div className="space-y-4 fade-in-up">
                <div 
                  className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4 relative cursor-pointer group hover:bg-blue-600/30 transition-all overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                   {editAvatar ? (
                     <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User size={40} className="text-blue-400" />
                   )}
                   <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera size={20} className="text-white mb-1" />
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-blue-500 transition-colors text-center"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveProfile} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Save size={16} /> Сохранить
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-white/10 hover:bg-white/20 text-white font-black text-sm uppercase tracking-widest p-3 rounded-xl transition-colors flex items-center justify-center shrink-0">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="fade-in-up">
                <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4 relative overflow-hidden group">
                   {user.user_metadata?.avatar_url ? (
                     <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User size={40} className="text-blue-400" />
                   )}
                   <div className="absolute bottom-0 right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full z-10" />
                   
                   <button onClick={startEditing} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20">
                     <Edit2 size={24} className="text-white" />
                   </button>
                </div>
                <h2 className="text-xl font-black truncate">{user.user_metadata?.full_name || 'Пользователь'}</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 truncate">{user.email}</p>
                <button onClick={startEditing} className="mt-3 text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center justify-center gap-1 mx-auto">
                  <Edit2 size={12} /> Изменить
                </button>
              </div>
            )}
            
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
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          <div className="fade-in-up">
            <h1 className="text-4xl font-black tracking-tight mb-2">Ваши покупки</h1>
            <p className="text-gray-500">Здесь отображается актуальный статус ваших заказов</p>
          </div>

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
                  <div
                    key={order.id}
                    className="glass border border-white/10 rounded-[2.5rem] overflow-hidden fade-in-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                     <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-32 h-32 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center shrink-0">
                           <span className="text-[10px] text-gray-600 font-black uppercase text-center px-2">{order.product || 'ТОВАР'}</span>
                        </div>

                        <div className="flex-1 space-y-4">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">НОМЕР {order.id || '---'}</p>
                                 <h3 className="text-xl font-black">{order.product || 'Секретный заказ'}</h3>
                              </div>
                              <div className="text-left sm:text-right">
                                 <p className="text-2xl font-black text-white">${(order.amount || 0).toLocaleString()}</p>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.date || ''}</p>
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
                                   <div 
                                      className="absolute top-0 left-0 h-full bg-blue-600 shadow-[0_0_10px_#2563eb] transition-all duration-1000 ease-out"
                                      style={{ 
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
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
