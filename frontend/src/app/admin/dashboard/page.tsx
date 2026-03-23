'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  TrendingUp, Users, DollarSign, Bell, Plus, Trash2, Edit3,
  Tag, Send, CheckCircle2, Clock, XCircle, ChevronRight,
  Percent, MessageSquare, Mail, Save, RefreshCw, AlertTriangle
} from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id: '1', name: 'NexaBlade 16',  type: 'GAMING', price: 3499, stock: 5,  discount: 0,  cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4090', ram: '64GB' },
  { id: '2', name: 'ProBook Ultra', type: 'OFFICE', price: 3999, stock: 3,  discount: 10, cpu: 'Apple M3 Max',          gpu: '40-core', ram: '128GB' },
  { id: '3', name: 'Stealth 14',    type: 'GAMING', price: 1899, stock: 12, discount: 0,  cpu: 'AMD Ryzen 9 8945HS',   gpu: 'RTX 4070', ram: '32GB' },
  { id: '4', name: 'ZenWork 15',    type: 'OFFICE', price: 1499, stock: 8,  discount: 5,  cpu: 'Intel Core Ultra 7',   gpu: 'Intel Arc', ram: '32GB' },
  { id: '5', name: 'NexaBlade 14',  type: 'GAMING', price: 1299, stock: 20, discount: 0,  cpu: 'Intel Core i7-14700HX',gpu: 'RTX 4060', ram: '16GB' },
  { id: '6', name: 'WorkStation X', type: 'OFFICE', price: 2799, stock: 2,  discount: 15, cpu: 'Intel Core Ultra 9',   gpu: 'RTX 4080', ram: '64GB' },
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
  { id: 'notify',    label: 'Уведомления', icon: Bell },
  { id: 'settings',  label: 'Настройки', icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab,       setTab]      = useState('dashboard');
  const [products,  setProducts] = useState(INIT_PRODUCTS);
  const [orders,    setOrders]   = useState(INIT_ORDERS);
  const [notif,     setNotif]    = useState({ tgToken: '', tgChat: '', email: '', orderAlert: true, payAlert: true });
  const [siteSettings, setSiteSettings] = useState({ name: 'NEXA | Премиальные Ноутбуки', desc: 'Будущее компьютеров. Каталог высокопроизводительных ноутбуков.', currency: 'USD ($)', maintenance: false });
  const [editProd,  setEditProd] = useState<any>(null);
  const [toast,     setToast]    = useState('');
  const [newProd,   setNewProd]  = useState(false);
  const [blank,     setBlank]    = useState({ name: '', type: 'GAMING', price: '', stock: '', discount: '', cpu: '', gpu: '', ram: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('nexa_admin') !== 'true') {
        router.replace('/admin');
      }
      
      const storedProducts = localStorage.getItem('nexa_products');
      if (storedProducts) {
        try { setProducts(JSON.parse(storedProducts)); } catch(e){}
      } else {
        localStorage.setItem('nexa_products', JSON.stringify(INIT_PRODUCTS));
      }

      const storedSettings = localStorage.getItem('nexa_settings');
      if (storedSettings) {
        try { setSiteSettings(JSON.parse(storedSettings)); } catch(e){}
      }
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

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Статус заказа ${id} обновлён`);
  };

  const saveDiscount = (id: string, discount: number) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, discount } : p);
      if (typeof window !== 'undefined') localStorage.setItem('nexa_products', JSON.stringify(next));
      return next;
    });
    showToast('Скидка сохранена');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('nexa_products', JSON.stringify(next));
      return next;
    });
    showToast('Товар удалён');
  };

  const addProduct = () => {
    if (!blank.name || !blank.price) return;
    setProducts(prev => {
      const next = [...prev, { ...blank, id: Date.now().toString(), price: Number(blank.price), stock: Number(blank.stock), discount: Number(blank.discount) }];
      if (typeof window !== 'undefined') localStorage.setItem('nexa_products', JSON.stringify(next));
      return next;
    });
    setNewProd(false);
    setBlank({ name: '', type: 'GAMING', price: '', stock: '', discount: '', cpu: '', gpu: '', ram: '' });
    showToast('Товар добавлен!');
  };

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexa_settings', JSON.stringify(siteSettings));
      // Dispatch event so other tabs/components can update immediately
      window.dispatchEvent(new Event('nexa_settings_updated'));
    }
    showToast('✅ Настройки сохранены и синхронизированы!');
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const revenue     = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);
  const newOrders   = orders.filter(o => o.status === 'new').length;
  const delivered   = orders.filter(o => o.status === 'delivered').length;
  const totalStock  = products.reduce((s, p) => s + p.stock, 0);

  const stats = [
    { label: 'Выручка',      value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e', change: '+12%' },
    { label: 'Новые заказы', value: newOrders,    icon: ShoppingBag,   color: '#3b82f6', change: `+${newOrders}` },
    { label: 'Доставлено',   value: delivered,    icon: CheckCircle2,  color: '#a855f7', change: `${delivered}` },
    { label: 'Товаров',      value: totalStock,   icon: Package,       color: '#f97316', change: `${products.length} SKU` },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 glass border-r border-white/8 flex flex-col fixed top-0 left-0 h-screen z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">A</span>
            </div>
            <div>
              <p className="text-sm font-black text-white">NEXA Admin</p>
              <p className="text-[10px] text-gray-500 font-mono">Control Panel v2</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                tab === id
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} /> {label}
              {id === 'orders' && newOrders > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-blue-500 text-[10px] font-black text-white flex items-center justify-center">{newOrders}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/8">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-64 flex-1 min-h-screen p-8">
        <AnimatePresence mode="wait">

          {/* ══ DASHBOARD ══════════════════════════════════════════════════════ */}
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Обзор <span className="text-gradient">NEXA</span></h1>
                <p className="text-gray-500 text-sm mt-1">Актуальные данные платформы</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="glass-dark border border-white/8 rounded-3xl p-5 relative overflow-hidden group hover:border-white/15 transition-all">
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: s.color }} />
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

              {/* Recent orders mini */}
              <div className="glass-dark border border-white/8 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black text-white">Последние заказы</h2>
                  <button onClick={() => setTab('orders')} className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:text-blue-300 transition-colors">
                    Все заказы <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 4).map(o => {
                    const S = STATUS_MAP[o.status];
                    return (
                      <div key={o.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/2 border border-white/5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                          <S.icon size={16} className={S.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{o.customer}</p>
                          <p className="text-xs text-gray-500">{o.product} · {o.id}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-white">${o.amount.toLocaleString()}</p>
                          <p className={`text-xs font-bold ${S.color}`}>{S.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ PRODUCTS ════════════════════════════════════════════════════════ */}
          {tab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white">Товары</h1>
                  <p className="text-gray-500 text-sm">{products.length} позиций</p>
                </div>
                <button onClick={() => setNewProd(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                  <Plus size={18} /> Добавить товар
                </button>
              </div>

              {/* Add product modal */}
              <AnimatePresence>
                {newProd && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                    <div className="glass border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                      <h3 className="text-lg font-black text-white mb-4">Новый товар</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: 'name', label: 'Название', placeholder: 'NexaBlade Pro' },
                          { key: 'price', label: 'Цена ($)', placeholder: '2999' },
                          { key: 'stock', label: 'На складе', placeholder: '10' },
                          { key: 'discount', label: 'Скидка (%)', placeholder: '0' },
                          { key: 'cpu', label: 'Процессор', placeholder: 'Intel Core i9' },
                          { key: 'gpu', label: 'Видеокарта', placeholder: 'RTX 4080' },
                          { key: 'ram', label: 'ОЗУ', placeholder: '32GB' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">{f.label}</label>
                            <input value={(blank as any)[f.key]} onChange={e => setBlank(prev => ({ ...prev, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white placeholder:text-gray-600 outline-none text-sm focus:border-blue-500/50 transition-all" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Тип</label>
                          <select value={blank.type} onChange={e => setBlank(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none text-sm focus:border-blue-500/50 transition-all">
                            <option>GAMING</option>
                            <option>OFFICE</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={addProduct} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                          Сохранить
                        </button>
                        <button onClick={() => setNewProd(false)} className="px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
                          Отмена
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products table */}
              <div className="glass-dark border border-white/8 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_90px_100px_120px] text-xs font-black uppercase tracking-widest text-gray-500 px-6 py-4 border-b border-white/8">
                  <span>Товар</span><span>Тип</span><span>Цена</span><span>Склад</span><span>Скидка</span><span>Действия</span>
                </div>
                <div className="divide-y divide-white/5">
                  {products.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-[1fr_80px_80px_90px_100px_120px] items-center px-6 py-4 hover:bg-white/2 transition-colors">
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.cpu}</p>
                      </div>
                      <span className={`text-xs font-black py-1 px-2 rounded-lg w-fit ${p.type === 'GAMING' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'}`}>
                        {p.type}
                      </span>
                      <span className="text-white font-bold text-sm">${p.price.toLocaleString()}</span>
                      <span className={`text-sm font-bold ${p.stock < 5 ? 'text-red-400' : 'text-white'}`}>
                        {p.stock < 5 && <AlertTriangle size={12} className="inline mr-1" />}{p.stock} шт
                      </span>
                      {/* Discount inline edit */}
                      <div className="flex items-center gap-1">
                        <input type="number" defaultValue={p.discount} min={0} max={90}
                          onBlur={e => saveDiscount(p.id, Number(e.target.value))}
                          className="w-12 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-white text-sm outline-none text-center" />
                        <Percent size={12} className="text-gray-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditProd(p)} className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ ORDERS ═══════════════════════════════════════════════════════════ */}
          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Заказы</h1>
                <p className="text-gray-500 text-sm">{orders.length} всего · {newOrders} новых</p>
              </div>

              <div className="space-y-4">
                {orders.map((o, i) => {
                  const S = STATUS_MAP[o.status];
                  return (
                    <motion.div key={o.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="glass-dark border border-white/8 rounded-3xl p-6 hover:border-white/15 transition-all">
                      <div className="flex flex-wrap items-start gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-gray-500">{o.id}</span>
                            <span className="text-xs text-gray-500">·</span>
                            <span className="text-xs text-gray-500">{o.date}</span>
                          </div>
                          <p className="font-black text-white">{o.customer}</p>
                          <p className="text-xs text-gray-400">{o.email}</p>
                          <p className="text-xs text-gray-400">{o.phone}</p>
                        </div>

                        <div className="flex-1 min-w-[160px]">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Товар</p>
                          <p className="font-bold text-white">{o.product}</p>
                          <p className="text-xs text-gray-400">{o.method === 'card' ? '💳 Карта' : '🏦 Рассрочка'}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-white">${o.amount.toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-black py-1.5 px-3 rounded-full mt-1 ${S.color}`}
                            style={{ background: `${S.color.replace('text-', '').replace('-400', '')}20` }}>
                            <S.icon size={12} /> {S.label}
                          </span>
                        </div>
                      </div>

                      {/* Status control */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-gray-500">Изменить статус:</span>
                        {Object.entries(STATUS_MAP).map(([k, v]) => (
                          <button key={k} onClick={() => updateOrderStatus(o.id, k)}
                            disabled={o.status === k}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              o.status === k
                                ? `${v.color} bg-white/5 border border-white/10 opacity-60 cursor-default`
                                : 'text-gray-500 bg-white/3 border border-white/8 hover:text-white hover:bg-white/8'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                        {/* Quick notify button */}
                        <button onClick={() => showToast(`📨 Уведомление отправлено для ${o.customer}`)}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                          <Send size={12} /> Уведомить клиента
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ NOTIFICATIONS ═════════════════════════════════════════════════ */}
          {tab === 'notify' && (
            <motion.div key="notify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Уведомления</h1>
                <p className="text-gray-500 text-sm">Telegram Bot и Email рассылка</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Telegram */}
                <div className="glass-dark border border-white/8 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                      <MessageSquare size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h2 className="font-black text-white">Telegram Bot</h2>
                      <p className="text-xs text-gray-500">Уведомления о новых заказах</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Bot Token</label>
                      <input value={notif.tgToken} onChange={e => setNotif(p => ({ ...p, tgToken: e.target.value }))}
                        placeholder="1234567890:AABBCCddeeFF..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-gray-600 outline-none text-sm focus:border-blue-500/50 transition-all font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Chat ID</label>
                      <input value={notif.tgChat} onChange={e => setNotif(p => ({ ...p, tgChat: e.target.value }))}
                        placeholder="-100123456789"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-gray-600 outline-none text-sm focus:border-blue-500/50 transition-all font-mono" />
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-xs text-gray-400 leading-relaxed">
                      <p className="font-bold text-blue-300 mb-1">Как подключить:</p>
                      1. Создайте бота через @BotFather<br />
                      2. Скопируйте токен<br />
                      3. Добавьте бота в нужный чат<br />
                      4. Получите Chat ID через @userinfobot
                    </div>

                    <button onClick={() => showToast('✅ Telegram настроен и тест отправлен!')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors">
                      <Send size={16} /> Сохранить и тест
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="glass-dark border border-white/8 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <Mail size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h2 className="font-black text-white">Email уведомления</h2>
                      <p className="text-xs text-gray-500">Оповещения на почту администратора</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email администратора</label>
                      <input value={notif.email} onChange={e => setNotif(p => ({ ...p, email: e.target.value }))}
                        type="email" placeholder="admin@nexa.kg"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-gray-600 outline-none text-sm focus:border-purple-500/50 transition-all" />
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: 'orderAlert', label: 'Новый заказ', desc: 'Уведомлять при каждом заказе' },
                        { key: 'payAlert',   label: 'Успешный платёж', desc: 'После подтверждения оплаты' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/8">
                          <div>
                            <p className="text-sm font-bold text-white">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                          <button onClick={() => setNotif(p => ({ ...p, [key]: !(p as any)[key] }))}
                            className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${(notif as any)[key] ? 'bg-purple-600' : 'bg-white/10'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${(notif as any)[key] ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => showToast('✅ Email-настройки сохранены!')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm hover:bg-purple-700 transition-colors">
                      <Save size={16} /> Сохранить настройки
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SETTINGS ══════════════════════════════════════════════════════ */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Настройки сайта</h1>
              </div>

              <div className="glass-dark border border-white/8 rounded-3xl p-8 max-w-2xl space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Название сайта</label>
                    <input value={siteSettings.name} onChange={e => setSiteSettings(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white outline-none text-sm focus:border-blue-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Описание (SEO)</label>
                    <textarea rows={3} value={siteSettings.desc} onChange={e => setSiteSettings(p => ({ ...p, desc: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white outline-none text-sm focus:border-blue-500/50 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Валюта</label>
                    <select value={siteSettings.currency} onChange={e => setSiteSettings(p => ({ ...p, currency: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white outline-none text-sm bg-transparent">
                      <option value="USD ($)">USD ($)</option>
                      <option value="KGS (сом)">KGS (сом)</option>
                      <option value="RUB (₽)">RUB (₽)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/8">
                    <div>
                      <p className="font-bold text-white">Режим технического обслуживания</p>
                      <p className="text-xs text-gray-500">Скрыть сайт от пользователей</p>
                    </div>
                    <button onClick={() => setSiteSettings(p => ({ ...p, maintenance: !p.maintenance }))}
                      className={`w-12 h-6 rounded-full flex items-center px-1 border border-white/10 transition-all ${siteSettings.maintenance ? 'bg-red-600' : 'bg-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full transition-all bg-white ${siteSettings.maintenance ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  <button onClick={saveSettings}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-colors cursor-pointer">
                    <Save size={16} /> Сохранить настройки
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3.5 glass border border-green-500/30 rounded-2xl text-green-300 text-sm font-bold shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
