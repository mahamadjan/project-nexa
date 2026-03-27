'use client';
import { useState, useEffect, useRef } from 'react';
import { User, Package, Settings, LogOut, ChevronRight, ChevronLeft, Clock, CheckCircle2, Truck, XCircle, Edit2, Save, X, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { INITIAL_PRODUCTS } from '@/data/products';

export default function ClientProfileDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

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
    setActiveTab('settings');
    setMobileView('content');
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      // 1. Сначала берем из LocalStorage (Всегда работает)
      const stored = localStorage.getItem('nexa_orders');
      let allLocalOrders = stored ? JSON.parse(stored) : [];
      
      // Фильтруем заказы, чтобы показывать только заказы текущего пользователя (и не удаленные)
      let localOrders = allLocalOrders.filter((o: any) => 
        (o.email === user.email || (user.id && o.user_id === user.id)) && o.status !== 'deleted'
      );
      
      setOrders(localOrders);

      try {
        if (!user) return;

        // Используем API прокси - браузер видит только localhost, без ошибок в консоли
        const params = new URLSearchParams();
        if (user.id) params.set('user_id', user.id);

        const [byId, byEmail, prodRes] = await Promise.all([
          fetch(`/api/orders?user_id=${user.id}`).then(r => r.json()).catch(() => ({ data: [] })),
          user.email ? fetch(`/api/orders?email=${encodeURIComponent(user.email)}`).then(r => r.json()).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          fetch('/api/products').then(r => r.json()).catch(() => ({ data: [] })),
        ]);

        const remoteOrders = [...(byId.data || []), ...(byEmail.data || [])];

        if (remoteOrders.length > 0) {
          const combined = [...localOrders, ...remoteOrders];
          const uniqueOrders = Array.from(new Map(combined.map(o => [o.id, o])).values());
          uniqueOrders.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());
          setOrders(uniqueOrders.filter(o => o.status !== 'deleted'));
        }

        if (prodRes.data?.length > 0) setProducts(prodRes.data);

      } catch (err: any) {
        console.log('Using local fallback mode');
      }
    };
    fetchOrders();
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    router.push('/login');
  };

  const selectTab = (tab: 'orders' | 'settings') => {
    setActiveTab(tab);
    setMobileView('content');
  };

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6">
      <style jsx global>{`
        @keyframes status-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes truck-drive {
          0% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          100% { transform: translateX(-2px); }
        }
        @keyframes success-pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        .animate-status-pulse { animation: status-pulse 2s infinite ease-in-out; }
        .animate-gear-spin { animation: gear-spin 3s infinite linear; }
        .animate-truck-drive { animation: truck-drive 1.5s infinite ease-in-out; }
        .animate-success-pop { animation: success-pop 0.5s ease-out forwards; }
      `}</style>
      <div className="max-w-5xl mx-auto">
        
        {/* Mobile View Switching Logic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar - Visible on Desktop OR if mobileView is 'menu' */}
          <div className={`${mobileView === 'menu' ? 'block' : 'hidden lg:block'} lg:col-span-3 space-y-4`}>
            <div className="glass border border-white/10 rounded-[2rem] p-5 text-center relative overflow-hidden fade-in-up">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              
              <div className="fade-in-up">
                  <div className="w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-3 relative overflow-hidden group">
                     {user.user_metadata?.avatar_url ? (
                       <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <User size={30} className="text-blue-400" />
                     )}
                     <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full z-10" />
                  </div>
                  <h2 className="text-lg font-black truncate">{user.user_metadata?.full_name || 'Пользователь'}</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5 truncate">{user.email}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
                 <button 
                    onClick={() => selectTab('orders')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      activeTab === 'orders' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    } font-bold text-sm`}
                 >
                    <div className="flex items-center gap-3"><Package size={18}/> Мои заказы</div>
                    <ChevronRight size={14} className="opacity-50" />
                 </button>

                 <button 
                    onClick={() => selectTab('settings')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      activeTab === 'settings' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    } font-bold text-sm`}
                 >
                    <div className="flex items-center gap-3"><Settings size={18}/> Настройки</div>
                    <ChevronRight size={14} className="opacity-50" />
                 </button>

                 <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-red-500/10 text-red-500/60 font-bold text-sm transition-colors mt-4">
                    <LogOut size={18}/> Выйти
                 </button>
              </div>
            </div>
          </div>

          {/* Main Content - Visible on Desktop OR if mobileView is 'content' */}
          <div className={`${mobileView === 'content' ? 'block' : 'hidden lg:block'} lg:col-span-9 space-y-6`}>
            
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-4">
               <button 
                  onClick={() => setMobileView('menu')}
                  className="flex items-center gap-2 text-blue-400 font-black text-sm uppercase tracking-widest hover:text-blue-300 transition-colors"
                >
                  <ChevronLeft size={20} /> Назад в меню
               </button>
            </div>

            {activeTab === 'orders' ? (
              <div className="fade-in-up space-y-6">
                <div>
                  <h1 className="text-3xl font-black tracking-tight mb-1">Ваши покупки</h1>
                  <p className="text-sm text-gray-500">История и статус заказов</p>
                </div>

                {orders.length === 0 ? (
                  <div className="glass border border-white/5 rounded-[2.5rem] p-16 text-center">
                     <Package size={48} className="mx-auto text-gray-800 mb-4" />
                     <p className="text-gray-400 font-bold text-sm">Нет заказов</p>
                     <Link href="/catalog" className="text-blue-400 font-black text-xs uppercase mt-4 inline-block hover:underline tracking-widest">
                        В каталог →
                     </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                      {orders.map((order, idx) => {
                        const fallbackImage = products.find(p => p.name === order.product || order.product?.includes(p.name))?.image;
                        const displayImage = order.image_url || fallbackImage;

                        return (
                          <div key={order.id} className="glass border border-white/5 rounded-[2rem] overflow-hidden fade-in-up transition-all hover:border-blue-500/10 mb-4" style={{ animationDelay: `${idx * 0.1}s` }}>
                            {/* Status Header */}
                            <div className="bg-white/[0.03] border-b border-white/5 px-6 py-3 flex justify-between items-center">
                              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none">#{order.id?.slice(-8) || '---'}</p>
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{order.date || 'Недавно'}</span>
                            </div>

                            <div className="p-4 sm:p-7 space-y-6 sm:space-y-8">
                              <div className="flex flex-row gap-4 sm:gap-6 items-center sm:items-stretch relative z-10">
                                {/* Left: Square Photo */}
                                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 overflow-hidden flex-shrink-0 shadow-2xl relative group">
                                  {displayImage ? (
                                    <img src={displayImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={order.product} />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 opacity-20 bg-gradient-to-tr from-white/5 to-transparent">
                                      <Package size={24} className="text-gray-400 mb-1" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
 
                                {/* Right: Square Details Box */}
                                <div className="flex-1 min-w-0 bg-white/[0.03] border border-white/5 rounded-2xl sm:rounded-[1.5rem] p-3 sm:p-5 flex flex-col justify-center relative overflow-hidden group/box">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full -mr-10 -mt-10" />
                                  <div className="relative z-10">
                                    <h3 className="text-xs sm:text-lg font-black text-white tracking-tight leading-snug line-clamp-2 mb-1 sm:mb-2 group-hover/box:text-blue-400 transition-colors">
                                      {order.product || 'Заказ Nexa'}
                                    </h3>
                                    <div className="flex items-end justify-between gap-4 mt-auto">
                                      <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1 italic">К оплате</span>
                                        <p className="text-2xl font-black text-white tracking-tighter leading-none">${(order.amount || 0).toLocaleString()}</p>
                                      </div>
                                      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-3 py-1.5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">
                                          {order.method === 'card' ? 'Visa/MC' : 'Рассрочка'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="pt-2">
                                <div className="flex justify-between relative z-10 mb-6 px-1">
                                  {[
                                    { id: 'new', label: 'Принят', icon: Clock },
                                    { id: 'processing', label: 'Сборка', icon: Settings },
                                    { id: 'shipped', label: 'В пути', icon: Truck },
                                    { id: 'delivered', label: 'Готово', icon: CheckCircle2 },
                                  ].map((step, sIdx) => {
                                    const statusFlow = ['new', 'processing', 'shipped', 'delivered'];
                                    const currentIndex = statusFlow.indexOf(order.status);
                                    const isPast = currentIndex >= sIdx;
                                    const isActive = order.status === step.id;
                                    let anim = '';
                                    if (isActive) {
                                      if (step.id === 'new') anim = 'animate-status-pulse';
                                      if (step.id === 'processing') anim = 'animate-gear-spin';
                                      if (step.id === 'shipped') anim = 'animate-truck-drive';
                                      if (step.id === 'delivered') anim = 'animate-success-pop';
                                    }
                                    return (
                                      <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                          isPast ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 border border-white/10' : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
                                        } ${anim}`} style={{ color: isPast ? '#ffffff' : 'var(--text-muted)' }}>
                                          <step.icon size={18} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest text-center ${isActive ? 'text-blue-400' : ''}`} style={{ color: isPast ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                          {step.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                {order.status !== 'cancelled' && (
                                  <div className="relative h-1.5 rounded-full overflow-hidden mx-4 mt-6 mb-4" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                    <div 
                                      className="absolute top-0 left-0 h-full animate-shimmer transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                      style={{ 
                                        width: order.status === 'new' ? '12%' : 
                                               order.status === 'processing' ? '37%' :
                                               order.status === 'shipped' ? '62%' :
                                               order.status === 'delivered' ? '100%' : '0%' 
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              <div className="fade-in-up space-y-6">
                 <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Настройки</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Управляйте личными данными</p>
                 </div>

                 <div className="glass border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 max-w-2xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                       <div 
                          className="w-32 h-32 rounded-3xl bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center relative cursor-pointer group hover:bg-blue-600/20 transition-all overflow-hidden"
                          onClick={() => fileInputRef.current?.click()}
                        >
                           {editAvatar ? (
                             <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover shadow-2xl" />
                           ) : (
                             <User size={60} className="text-blue-400" />
                           )}
                           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Camera size={32} className="text-white mb-2" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-white">Изменить</span>
                           </div>
                           <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>ПОЛНОЕ ИМЯ</label>
                              <input 
                                type="text" 
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                placeholder="Ваше имя"
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                style={{ color: 'var(--text-primary)' }}
                              />
                           </div>

                           <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>EMAIL</label>
                              <div className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 font-bold cursor-not-allowed opacity-60" style={{ color: 'var(--text-muted)' }}>
                                 {user.email}
                              </div>
                           </div>

                           <div className="pt-4 flex gap-4">
                              <button onClick={handleSaveProfile} className="btn-premium flex-1 py-4 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                                 <Save size={18} /> Сохранить
                              </button>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
