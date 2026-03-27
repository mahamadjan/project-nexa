'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  TrendingUp, Users, DollarSign, Bell, Plus, Trash2, Edit3,
  Tag, Send, CheckCircle2, Clock, XCircle, ChevronRight,
  Percent, MessageSquare, Mail, Save, RefreshCw, AlertTriangle, Menu,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// ─── Mock data ────────────────────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id: '1', name: 'NexaBlade 16',  type: 'GAMING', price: 3499, stock: 5,  discount: 0,  cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4090', ram: '64GB', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop' },
  { id: '2', name: 'ProBook Ultra', type: 'OFFICE', price: 3999, stock: 3,  discount: 10, cpu: 'Apple M3 Max',          gpu: '40-core', ram: '128GB', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
  { id: '3', name: 'Stealth 14',    type: 'GAMING', price: 1899, stock: 12, discount: 0,  cpu: 'AMD Ryzen 9 8945HS',   gpu: 'RTX 4070', ram: '32GB', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop' },
  { id: '4', name: 'ZenWork 15',    type: 'OFFICE', price: 1499, stock: 8,  discount: 5,  cpu: 'Intel Core Ultra 7',   gpu: 'Intel Arc', ram: '32GB', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop' },
  { id: '5', name: 'NexaBlade 14',  type: 'GAMING', price: 1299, stock: 20, discount: 0,  cpu: 'Intel Core i7-14700HX',gpu: 'RTX 4060', ram: '16GB', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop' },
  { id: '6', name: 'WorkStation X', type: 'OFFICE', price: 2799, stock: 2,  discount: 15, cpu: 'Intel Core Ultra 9',   gpu: 'RTX 4080', ram: '64GB', image: 'https://images.unsplash.com/photo-1531297172867-4f54e14fcceb?q=80&w=800&auto=format&fit=crop' },
];

const INIT_ORDERS = [
  { id: '#NX-100412', customer: 'Айбек Усупов',    email: 'aibek@mail.kg',    product: 'NexaBlade 16',  amount: 3499, method: 'card',        status: 'new',        date: '23.03.2026', phone: '+996 770 123 456' },
  { id: '#NX-100389', customer: 'Жигит Борубеков',  email: 'zhigit@mail.ru',  product: 'ProBook Ultra', amount: 3999, method: 'installment',  status: 'processing', date: '23.03.2026', phone: '+996 550 987 654' },
  { id: '#NX-100321', customer: 'Надя Асанова',     email: 'nadya@gmail.com', product: 'Stealth 14',    amount: 1899, method: 'card',        status: 'shipped',    date: '22.03.2026', phone: '+996 700 555 111' },
  { id: '#NX-100298', customer: 'Улан Мамытов',     email: 'ulan@mail.kg',    product: 'ZenWork 15',    amount: 1499, method: 'installment',  status: 'delivered',  date: '21.03.2026', phone: '+996 555 222 333' },
  { id: '#NX-100201', customer: 'Гульнара Токоева',  email: 'gul@mail.kg',    product: 'NexaBlade 14',  amount: 1299, method: 'card',        status: 'cancelled',  date: '20.03.2026', phone: '+996 702 444 999' },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  new:        { label: 'Новый',      color: 'text-blue-400',   icon: Bell },
  processing: { label: 'В работе',   color: 'text-yellow-400', icon: Clock },
  shipped:    { label: 'Отправлен',  color: 'text-purple-400', icon: RefreshCw },
  delivered:  { label: 'Доставлен', color: 'text-green-400', icon: CheckCircle2 },
  cancelled:  { label: 'Отменён',   color: 'text-red-400',    icon: XCircle },
};

const NAV = [
  { id: 'dashboard', label: 'Обзор',    icon: LayoutDashboard },
  { id: 'products',  label: 'Товары',   icon: Package },
  { id: 'orders',    label: 'Заказы',   icon: ShoppingBag },
  { id: 'users',     label: 'Клиенты',  icon: Users },
  { id: 'notify',    label: 'Уведомления', icon: Bell },
  { id: 'settings',  label: 'Настройки', icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [tab,       setTab]      = useState('dashboard');
  const [products,  setProducts] = useState(INIT_PRODUCTS);
  const [orders,    setOrders]   = useState(INIT_ORDERS);
  const [profiles,  setProfiles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notif,     setNotif]    = useState({ tgToken: '', tgChat: '', email: '', orderAlert: true, payAlert: true });
  const [siteSettings, setSiteSettings] = useState({ 
    name: 'NEXA | Премиальные Ноутбуки', 
    desc: 'Будущее компьютеров. Каталог высокопроизводительных ноутбуков.', 
    currency: 'USD ($)', 
    maintenance: false,
    heroImage: '',
    adminPhoto: '',
    dashboardBanner: '',
    aboutText: 'NEXA — это премиальный бренд, специализирующийся на высокопроизводительных ноутбуках для геймеров и профессионалов. Мы объединяем передовые технологии, безупречный дизайн и бескомпромиссную мощь в каждом устройстве.',
    contactPhone: '+996 700 123 456',
    contactEmail: 'hi@nexa.kg',
    contactAddress: 'г. Бишкек, пр. Чуй 123',
    mapSrc: 'https://yandex.ru/map-widget/v1/?ll=74.605330%2C42.875220&z=16'

  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editProd,  setEditProd] = useState<any>(null);
  const [toast,     setToast]    = useState('');
  const [newProd,   setNewProd]  = useState(false);
  const [blank,     setBlank]    = useState({ 
    name: '', type: 'GAMING', price: '', stock: '', discount: '0', 
    cpu: '', gpu: '', ram: '', image: '' 
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('nexa_admin') !== 'true') {
        router.replace('/admin');
      }
      
      // 1. Загрузка товаров из Supabase
      const fetchProducts = async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase
            .from('products')
            .select('*');
          
          if (error) throw error;
          if (data && data.length > 0) {
            setProducts(data);
          } else {
            setProducts(INIT_PRODUCTS);
          }
        } catch (err) {
          console.log('Products fetch failed, using defaults');
          const storedProducts = localStorage.getItem('nexa_products');
          if (storedProducts) setProducts(JSON.parse(storedProducts));
          else setProducts(INIT_PRODUCTS);
        }
      };

      fetchProducts();

      // 2. Загрузка настроек
      const storedSettings = localStorage.getItem('nexa_settings');
      if (storedSettings) {
        try { setSiteSettings(JSON.parse(storedSettings)); } catch(e){}
      }

      // 3. Загрузка заказов через API прокси (без ошибок в консоли браузера)
      const fetchGlobalOrders = async () => {
        const local = localStorage.getItem('nexa_orders');
        let initialOrders = local ? JSON.parse(local) : INIT_ORDERS;
        setOrders(initialOrders);

        try {
          const res = await fetch('/api/orders');
          const { data } = await res.json();
          if (data && data.length > 0) {
            const remoteOrders = data.map((o: any) => ({
              ...o,
              date: o.created_at ? new Date(o.created_at).toLocaleDateString('ru-RU') : (o.date || 'Неизвестно')
            }));
            const combined = [...initialOrders, ...remoteOrders];
            const unique = Array.from(new Map(combined.map(o => [o.id, o])).values());
            unique.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());
            setOrders(unique);
            fetchProfiles(unique);
          } else {
            fetchProfiles(initialOrders);
          }
        } catch {
          fetchProfiles(initialOrders);
        }
      };

      // 4. Загрузка пользователей
      const fetchProfiles = async (currentOrders: any[]) => {
        // ОСНОВНОЙ ИСТОЧНИК: Собираем уникальных клиентов из заказов
        // Это всегда работает, даже без базы данных
        const buildFromOrders = (orderList: any[]) => {
          const clientMap = new Map<string, any>();
          orderList.forEach(o => {
            if (o.email && !clientMap.has(o.email)) {
              clientMap.set(o.email, {
                id: o.user_id || o.email,
                email: o.email,
                full_name: o.customer || o.email.split('@')[0],
                avatar_url: null,
                created_at: o.created_at || o.date || new Date().toISOString(),
                updated_at: o.created_at || o.date || new Date().toISOString(),
                role: 'user',
                phone: o.phone || ''
              });
            }
          });
          return Array.from(clientMap.values());
        };

        // Сначала берём из локальных заказов
        const localOrdersStr = localStorage.getItem('nexa_orders');
        const localOrders = localOrdersStr ? JSON.parse(localOrdersStr) : [];
        const fromLocalOrders = buildFromOrders([...currentOrders, ...localOrders]);
        if (fromLocalOrders.length > 0) setProfiles(fromLocalOrders);

        // Пытаемся дополнить из Supabase profiles
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data: profilesData } = await supabase.from('profiles').select('*');
          if (profilesData && profilesData.length > 0) {
            const combined = [...fromLocalOrders, ...profilesData];
            const unique = Array.from(new Map(combined.map(p => [p.email || p.id, p])).values());
            setProfiles(unique);
          }
        } catch {
          // profiles недоступны — остаёмся с данными из заказов
        }
      };

      fetchGlobalOrders();

      // Немедленно показываем клиентов из локальных заказов без ожидания DB
      const localOrdsStr = localStorage.getItem('nexa_orders');
      const localOrds = localOrdsStr ? JSON.parse(localOrdsStr) : INIT_ORDERS;
      fetchProfiles(localOrds);

      // 4. Реальное время (Real-time) - слушаем появление новых заказов
      const setupRealtime = async () => {
        const { supabase } = await import('@/lib/supabase');
        
        const channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'orders' },
            (payload) => {
              console.log('Новый заказ в реальном времени!', payload.new);
              setOrders(prev => {
                const alreadyExists = prev.some(o => o.id === payload.new.id);
                if (alreadyExists) return prev;
                
                const newOrderFormatted = {
                  id: payload.new.id,
                  customer: payload.new.customer,
                  email: payload.new.email,
                  product: payload.new.product,
                  amount: payload.new.amount,
                  method: payload.new.method,
                  status: payload.new.status,
                  phone: payload.new.phone,
                  date: new Date(payload.new.created_at || new Date()).toLocaleDateString('ru-RU')
                };
                showToast(`🚀 Новый заказ: ${newOrderFormatted.id}`);
                return [newOrderFormatted, ...prev];
              });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      };

      setupRealtime();
    }
  }, [router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const logout = () => {
    localStorage.removeItem('nexa_admin');
    router.push('/admin');
  };

  const updateOrderStatus = async (id: string, status: string) => {
    // Находим заказ для получения email
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const nextOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(nextOrders);
    
    // Глобальное обновление в Supabase
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) console.error('Supabase Update Error:', error);
    } catch (e) {
      console.error('Supabase Execution Error:', e);
    }

    localStorage.setItem('nexa_orders', JSON.stringify(nextOrders));
    showToast(`Статус заказа ${id} обновлён`);

    // Отправка уведомления покупателю
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.email,
          name: order.customer,
          orderId: id,
          amount: order.amount,
          productName: order.product,
          statusUpdate: status 
        }),
      });
      if (res.ok) showToast('📧 Уведомление отправлено на почту');
    } catch (e) {
      console.error('Failed to notify customer', e);
    }
  };

  const saveDiscount = (id: string, discount: number) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, discount } : p);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexa_products', JSON.stringify(next));
        window.dispatchEvent(new Event('nexa_products_updated'));
      }
      return next;
    });
    showToast('Скидка сохранена');
  };

  const deleteProduct = async (id: string) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Товар удалён');
    } catch (e) {
      console.error('Delete Error:', e);
      showToast('Ошибка при удалении');
    }
  };

  const addProduct = async () => {
    if (!blank.name || !blank.price) return;
    try {
      const { supabase } = await import('@/lib/supabase');
      const productToId = blank.name.toLowerCase().replace(/\s+/g, '-');
      const newProduct = { 
        ...blank, 
        id: `${productToId}-${Date.now().toString().slice(-4)}`, 
        price: Number(blank.price), 
        stock: Number(blank.stock),
        discount: Number(blank.discount) 
      };

      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;

      setProducts(prev => [newProduct, ...prev]);
      setNewProd(false);
      setBlank({ name: '', type: 'GAMING', price: '', stock: '', discount: '0', cpu: '', gpu: '', ram: '', image: '' });
      showToast('Товар добавлен!');
    } catch (e) {
      console.error('Add Error:', e);
      showToast('Ошибка при добавлении');
    }
  };

  const updateProduct = async () => {
    if (!editProd || !editProd.name || !editProd.price) return;
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('products')
        .update({ 
          name: editProd.name,
          type: editProd.type,
          price: Number(editProd.price), 
          stock: Number(editProd.stock),
          discount: Number(editProd.discount),
          cpu: editProd.cpu,
          gpu: editProd.gpu,
          ram: editProd.ram,
          image: editProd.image
        })
        .eq('id', editProd.id);
      
      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === editProd.id ? { ...p, ...editProd, price: Number(editProd.price), stock: Number(editProd.stock), discount: Number(editProd.discount) } : p));
      setEditProd(null);
      showToast('Товар обновлён!');
    } catch (e: any) {
      console.error('Update Error Full:', e);
      if (e.message) showToast(`Ошибка: ${e.message}`);
      else showToast('Ошибка при обновлении (см. консоль)');
    }
  };

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexa_settings', JSON.stringify(siteSettings));
      window.dispatchEvent(new Event('nexa_settings_updated'));
    }
    showToast('✅ Настройки сохранены!');
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return showToast('❌ Файл слишком большой (макс 2MB)');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettings(prev => ({ ...prev, heroImage: reader.result as string }));
        showToast('📸 Фото загружено!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) return showToast('❌ Фото слишком большое (макс 1MB)');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettings(prev => ({ ...prev, adminPhoto: reader.result as string }));
        showToast('👤 Аватар загружен!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDashboardBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return showToast('❌ Баннер слишком большой (макс 2MB)');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettings(prev => ({ ...prev, dashboardBanner: reader.result as string }));
        showToast('🖼️ Баннер загружен!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return showToast('❌ Фото слишком большое (макс 5MB)');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditProd((prev: any) => ({ ...prev, image: reader.result as string }));
        } else {
          setBlank(prev => ({ ...prev, image: reader.result as string }));
        }
        showToast('📦 Фото товара загружено!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const activeOrders = orders.filter(o => o.status !== 'deleted');
  const revenue      = activeOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const numNewOrders = activeOrders.filter(o => o.status === 'new').length;
  const delivered    = activeOrders.filter(o => o.status === 'delivered').length;
  const totalStock   = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);

  const stats = [
    { label: 'Выручка',      value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e', change: '+12%' },
    { label: 'Новые заказы', value: numNewOrders,    icon: ShoppingBag,   color: '#3b82f6', change: `+${numNewOrders}` },
    { label: 'Доставлено',   value: delivered,    icon: CheckCircle2,  color: '#a855f7', change: `${delivered}` },
    { label: 'Товаров',      value: totalStock,   icon: Package,       color: '#f97316', change: `${products.length} SKU` },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-400 overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {siteSettings.adminPhoto ? (
            <img src={siteSettings.adminPhoto} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="Admin" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">A</span>
            </div>
          )}
          <span className="font-black text-sm uppercase tracking-tighter">NEXA ADMIN</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          {isMobileMenuOpen ? <XCircle size={24} className="text-red-400" /> : <Menu size={24} className="text-white" />}
        </button>
      </header>

      {/* Sidebar - uses isMounted to prevent hydration mismatch */}
      <AnimatePresence>
        {(isMobileMenuOpen || (isMounted && typeof window !== 'undefined' && window.innerWidth >= 768) || !isMounted) && (
          <motion.aside 
            initial={false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`w-64 shrink-0 bg-[var(--bg-primary)] shadow-2xl border-r border-white/8 flex flex-col fixed top-0 left-0 h-screen z-50 transition-all md:relative md:translate-x-0 ${isMobileMenuOpen ? 'flex' : 'hidden md:flex'}`}
          >
            <div className="px-6 py-5 border-b border-white/8 hidden md:block">
              <div className="flex items-center gap-3">
                {siteSettings.adminPhoto ? (
                  <img src={siteSettings.adminPhoto} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="Admin" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-black">A</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-black">NEXA Admin</p>
                  <p className="text-[10px] text-gray-500 font-mono italic">Role: {profiles.length > 0 ? (profiles.find(p => p.role === 'admin')?.role || 'User (No Admin Access)') : 'Loading...'}</p>
                </div>
                <button onClick={toggleTheme} className="ml-auto p-2 rounded-xl hover:bg-white/5 transition-colors">
                  {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-500" />}
                </button>
              </div>
            </div>

            <nav className="flex-1 px-3 py-6 md:py-4 space-y-1 overflow-y-auto">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setTab(id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    tab === id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} /> {label}
                  {id === 'orders' && numNewOrders > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center">{numNewOrders}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="px-3 py-4 border-t border-white/8 mt-auto">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut size={18} /> Выйти
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 w-full md:max-w-[calc(100vw-256px)] overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {siteSettings.dashboardBanner && (
                <div className="relative w-full h-40 md:h-56 rounded-3xl overflow-hidden mb-8 group border border-white/5">
                   <img src={siteSettings.dashboardBanner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-80" />
                   <div className="absolute bottom-6 left-8">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">DASHBOARD</p>
                     <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Добро пожаловать, <span className="text-gradient">Админ</span></h2>
                   </div>
                </div>
              )}

              <div className="mb-8">
                <h1 className="text-3xl font-black">Обзор <span className="text-gradient">NEXA</span></h1>
                <p className="text-gray-500 text-sm mt-1">Актуальные данные платформы</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="glass-dark border border-white/8 rounded-3xl p-5 relative overflow-hidden group hover:border-white/15 transition-all">
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20" style={{ background: s.color }} />
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                        <s.icon size={20} style={{ color: s.color }} />
                      </div>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{s.change}</span>
                    </div>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="glass-dark border border-white/8 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black">Последние заказы</h2>
                  <button onClick={() => setTab('orders')} className="text-xs text-blue-400 font-bold flex items-center gap-1">Все заказы <ChevronRight size={14} /></button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 4).map(o => {
                    const S = STATUS_MAP[o.status];
                    return (
                      <div key={o.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/2 border border-white/5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
                          {S?.icon ? <S.icon size={16} className={S.color} /> : <Bell size={16} className="text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{o.customer}</p>
                          <p className="text-xs text-gray-500">{o.product} · {o.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">${o.amount?.toLocaleString() || '0'}</p>
                          <p className={`text-xs font-bold ${S?.color || 'text-gray-500'}`}>{S?.label || '---'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <motion.div key="prods" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black">Товары</h1>
                <button onClick={() => setNewProd(true)} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm">
                  <Plus size={18} /> Добавить товар
                </button>
              </div>

              <AnimatePresence>
                {newProd && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                    <div className="glass border border-blue-500/30 rounded-3xl p-6">
                      <h3 className="text-lg font-black mb-4">Новый товар</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: 'name', label: 'Название' },
                          { key: 'price', label: 'Цена ($)' },
                          { key: 'stock', label: 'Склад' },
                          { key: 'discount', label: 'Скидка (%)' },
                          { key: 'cpu', label: 'Процессор' },
                          { key: 'gpu', label: 'Видеокарта' },
                          { key: 'ram', label: 'ОЗУ' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs font-bold text-gray-500 block mb-1">{f.label}</label>
                            <input value={(blank as any)[f.key]} onChange={e => setBlank(prev => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[var(--text-primary)] text-sm" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Тип</label>
                          <select value={blank.type} onChange={e => setBlank(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm">
                            <option>GAMING</option>
                            <option>OFFICE</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-500 block mb-1">Фото товара (Base64)</label>
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition">
                              Загрузить фото
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleProductImageUpload(e)} />
                            </label>
                            {blank.image && <img src={blank.image} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={addProduct} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">Сохранить</button>
                        <button onClick={() => setNewProd(false)} className="px-6 py-2 bg-white/5 text-gray-400 rounded-xl font-bold text-sm">Отмена</button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {editProd && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                    <div className="glass border border-orange-500/30 rounded-3xl p-6">
                      <h3 className="text-lg font-black mb-4">Редактировать товар</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: 'name', label: 'Название' },
                          { key: 'price', label: 'Цена ($)' },
                          { key: 'stock', label: 'Склад' },
                          { key: 'discount', label: 'Скидка (%)' },
                          { key: 'cpu', label: 'Процессор' },
                          { key: 'gpu', label: 'Видеокарта' },
                          { key: 'ram', label: 'ОЗУ' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs font-bold text-gray-500 block mb-1">{f.label}</label>
                            <input value={editProd[f.key] || ''} onChange={e => setEditProd((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[var(--text-primary)] text-sm" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Тип</label>
                          <select value={editProd.type} onChange={e => setEditProd((prev: any) => ({ ...prev, type: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm">
                            <option>GAMING</option>
                            <option>OFFICE</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-500 block mb-1">Фото товара</label>
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition">
                              Изменить фото
                              <input type="file" accept="image/*" className="hidden" onChange={e => handleProductImageUpload(e, true)} />
                            </label>
                            {editProd.image && <img src={editProd.image} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={updateProduct} className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm">Обновить</button>
                        <button onClick={() => setEditProd(null)} className="px-6 py-2 bg-white/5 text-gray-400 rounded-xl font-bold text-sm">Отмена</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glass-dark border border-white/8 rounded-3xl overflow-hidden p-2 sm:p-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/8">
                        <th className="px-6 py-4">Товар</th>
                        <th className="px-6 py-4">Тип</th>
                        <th className="px-6 py-4">Цена</th>
                        <th className="px-6 py-4">Склад</th>
                        <th className="px-6 py-4">Скидка</th>
                        <th className="px-6 py-4">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <Package size={16} className="text-gray-600" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{p.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{p.cpu}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">
                              {p.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">${p.price?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-bold">{p.stock}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <input type="number" defaultValue={p.discount} onBlur={e => saveDiscount(p.id, Number(e.target.value))}
                                className="w-12 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-xs text-center" />
                              <Percent size={12} className="text-gray-500" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center gap-2">
                               <button onClick={() => setEditProd(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit3 size={14}/></button>
                               <button onClick={() => deleteProduct(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3">
                  {products.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <Package size={20} className="text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black truncate">{p.name}</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">{p.type}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white">${p.price?.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-500 font-bold">Склад: {p.stock}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => setEditProd(p)} className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl"><Edit3 size={16}/></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-red-600/20 text-red-400 rounded-xl"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <h1 className="text-3xl font-black mb-8">Заказы</h1>
               <div className="space-y-4">
                 {orders.filter(o => o.status !== 'deleted').map(o => {
                  const S = STATUS_MAP[o.status];
                  return (
                    <div key={o.id} className="glass-dark border border-white/8 rounded-3xl p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{o.id} · {o.date}</p>
                          <p className="font-black text-lg">{o.customer}</p>
                          <p className="text-xs text-gray-400">{o.email} · {o.phone}</p>
                        </div>
                          <div className="text-right">
                           <p className="text-2xl font-black">${o.amount?.toLocaleString() || '0'}</p>
                           <p className={`text-xs font-black uppercase mt-1 ${S?.color || 'text-gray-500'}`}>{S?.label || 'Неизвестно'}</p>
                         </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest px-1">Изменить статус</p>
                        <div className="flex flex-wrap gap-2.5">
                          {Object.entries(STATUS_MAP).map(([k, v]) => (
                            <button 
                              key={k} 
                              onClick={() => updateOrderStatus(o.id, k)}
                              className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight border transition-all active:scale-95 ${
                                o.status === k 
                                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                  : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                          {/* DELETE BUTTON */}
                          <div className="ml-auto">
                            <button 
                              onClick={() => {
                                if (confirm('Вы уверены, что хотите полностью удалить этот заказ?')) {
                                  updateOrderStatus(o.id, 'deleted');
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 flex items-center justify-center"
                              title="Удалить заказ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                 })}
               </div>
            </motion.div>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black">Клиенты</h1>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400">
                  <Users size={14} /> Всего: {profiles.length}
                </div>
              </div>

              <div className="glass-dark border border-white/8 rounded-[2rem] overflow-hidden p-2 sm:p-4">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2">
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px]">Полное имя</th>
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px]">Email</th>
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px]">Роль</th>
                        <th className="px-6 py-4 text-left font-black text-gray-400 uppercase tracking-widest text-[10px]">Регистрация</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map(u => (
                        <tr key={u.id} onClick={() => setSelectedUser(u)} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold overflow-hidden border border-blue-500/20">
                                {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : (u.full_name?.[0] || 'U')}
                              </div>
                              <p className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm">{u.full_name || 'Без имени'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 font-mono text-xs">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.role === 'admin' ? 'bg-blue-600/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                              {u.role === 'admin' ? 'Админ' : 'Клиент'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs font-bold">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('ru-RU') : '---'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Grid */}
                <div className="lg:hidden grid grid-cols-1 gap-2">
                  {profiles.map(u => (
                    <div key={u.id} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold overflow-hidden border border-blue-500/20">
                         {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : (u.full_name?.[0] || 'U')}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-white truncate">{u.full_name || 'Без имени'}</p>
                         <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                       </div>
                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${u.role === 'admin' ? 'bg-blue-600/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                         {u.role === 'admin' ? 'Админ' : 'Клиент'}
                       </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* USER DETAIL MODAL */}
              <AnimatePresence>
                {selectedUser && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedUser(null)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white"
                  >
                    <motion.div 
                      onClick={e => e.stopPropagation()}
                      initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="glass border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden flex flex-col p-8 shadow-2xl relative"
                    >
                      <div className="flex items-center justify-between mb-8 text-white">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 text-2xl font-black border border-blue-500/20">
                            {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} className="w-full h-full object-cover rounded-2xl" alt="Avatar" /> : (selectedUser.full_name?.[0] || 'U')}
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white">{selectedUser.full_name || 'Без имени'}</h2>
                            <p className="text-xs text-gray-500 font-mono tracking-tighter opacity-60">{selectedUser.id}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedUser(null)}
                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Plus size={20} className="rotate-45" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-3xl bg-white/3 border border-white/5 text-left">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Email</p>
                          <p className="font-bold truncate text-sm">{selectedUser.email}</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/3 border border-white/5 text-left">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Зарегистрирован</p>
                          <p className="font-bold text-sm">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('ru-RU') : '---'}</p>
                        </div>
                      </div>

                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 px-2 flex items-center gap-2 text-left">
                        <ShoppingBag size={14} /> История заказов
                      </h3>
                      
                      <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar space-y-3">
                        {orders.filter((o: any) => o.user_id === selectedUser.id || o.email === selectedUser.email).length > 0 ? (
                          orders.filter((o: any) => o.user_id === selectedUser.id || o.email === selectedUser.email).map((o: any) => (
                            <div key={o.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-all text-left">
                              <div className="flex-1 min-w-0 mr-4">
                                <p className="font-bold text-sm text-white mb-1">{o.id}</p>
                                <p className="text-[10px] text-gray-500 truncate">{o.product}</p>
                                <p className="text-[9px] text-gray-600 mt-1">{o.date}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-black text-blue-400 text-base">${o.amount.toLocaleString()}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${STATUS_MAP[o.status as keyof typeof STATUS_MAP]?.color}`}>
                                  {STATUS_MAP[o.status as keyof typeof STATUS_MAP]?.label}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
                            <ShoppingBag size={32} className="mx-auto text-gray-700 mb-3 opacity-20" />
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-gray-400">Нет заказов</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notify' && (
            <motion.div key="notify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <h1 className="text-3xl font-black mb-8">Уведомления</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass-dark border border-white/8 rounded-3xl p-6">
                    <h2 className="font-black mb-4">Telegram Bot</h2>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm mb-4" placeholder="Bot Token" value={notif.tgToken} onChange={e => setNotif({...notif, tgToken: e.target.value})} />
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm mb-6" placeholder="Chat ID" value={notif.tgChat} onChange={e => setNotif({...notif, tgChat: e.target.value})} />
                    <button onClick={() => showToast('✅ Сохранено')} className="w-full py-3 bg-blue-600 rounded-2xl font-bold">Сохранить</button>
                 </div>
                 <div className="glass-dark border border-white/8 rounded-3xl p-6">
                    <h2 className="font-black mb-4">Email Рассылка</h2>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm mb-8" placeholder="Admin Email" value={notif.email} onChange={e => setNotif({...notif, email: e.target.value})} />
                    <button onClick={() => showToast('✅ Сохранено')} className="w-full py-3 bg-purple-600 rounded-2xl font-bold">Сохранить</button>
                 </div>
               </div>
            </motion.div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <h1 className="text-3xl font-black mb-8">Настройки</h1>
               <div className="glass-dark border border-white/8 rounded-3xl p-8 max-w-2xl space-y-6">
                  <div>
                    <label className="text-xs font-black text-gray-500 mb-2 block uppercase">Название сайта</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4" value={siteSettings.name} onChange={e => setSiteSettings({...siteSettings, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-3xl bg-white/3 border border-white/8">
                      <p className="text-xs font-bold text-gray-500 mb-4">АВАТАР АДМИНА</p>
                      <label className="cursor-pointer block">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                           {siteSettings.adminPhoto ? <img src={siteSettings.adminPhoto} className="w-full h-full object-cover" /> : <Plus size={24} />}
                        </div>
                        <input type="file" className="hidden" onChange={handleAdminPhotoUpload} />
                      </label>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/3 border border-white/8">
                      <p className="text-xs font-bold text-gray-500 mb-4">ГЛАВНОЕ ФОТО (HERO)</p>
                      <label className="cursor-pointer block">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                           {siteSettings.heroImage ? <img src={siteSettings.heroImage} className="w-full h-full object-cover" /> : <Plus size={24} />}
                        </div>
                        <input type="file" className="hidden" onChange={handleHeroImageUpload} />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-white/3 border border-white/8">
                    <p className="text-xs font-bold text-gray-500 mb-4 uppercase">Баннер панели</p>
                    <label className="cursor-pointer block relative h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                       {siteSettings.dashboardBanner ? <img src={siteSettings.dashboardBanner} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Plus size={24} /></div>}
                       <input type="file" className="hidden" onChange={handleDashboardBannerUpload} />
                    </label>
                  </div>

                  <div className="p-4 rounded-3xl bg-white/3 border border-white/8 space-y-4">
                    <h2 className="text-lg font-black uppercase text-blue-400">О компании и Контакты</h2>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Текст "О компании"</label>
                      <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[100px] text-sm" value={siteSettings.aboutText || ''} onChange={e => setSiteSettings({...siteSettings, aboutText: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Телефон</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm" value={siteSettings.contactPhone || ''} onChange={e => setSiteSettings({...siteSettings, contactPhone: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm" value={siteSettings.contactEmail || ''} onChange={e => setSiteSettings({...siteSettings, contactEmail: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Адрес</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm" value={siteSettings.contactAddress || ''} onChange={e => setSiteSettings({...siteSettings, contactAddress: e.target.value})} />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Yandex/Google Map Iframe URL (src)</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-mono text-xs placeholder:text-gray-600" placeholder="https://yandex.ru/map-widget/..." value={siteSettings.mapSrc || ''} onChange={e => setSiteSettings({...siteSettings, mapSrc: e.target.value})} />
                    </div>
                  </div>

                  <button onClick={saveSettings} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20">Сохранить всё</button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 glass rounded-2xl z-50 text-sm font-bold shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
