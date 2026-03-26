'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Building2, Lock, ShieldCheck, CheckCircle2, ChevronDown, ArrowLeft, Mail } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

declare global {
  interface Window {
    google: any;
  }
}

// ─── Kyrgyzstan banks offering installments ────────────────────────────────
const BANKS = [
  { id: 'mbank',      name: 'MBank',           logo: '🏦', rate: 0, description: 'Без переплат до 12 мес.' },
  { id: 'optima',     name: 'Optima Bank',      logo: '🔵', rate: 1.8, description: 'Рассрочка от 3–24 мес.' },
  { id: 'bakcell',    name: 'Bakai Bank',       logo: '🟢', rate: 1.5, description: 'Рассрочка до 18 мес.' },
  { id: 'demirbank',  name: 'Demir Kyrgyz',     logo: '🔴', rate: 2.0, description: 'Рассрочка до 24 мес.' },
  { id: 'rsb',        name: 'RSK Bank',         logo: '🟡', rate: 1.2, description: 'Выгодный процент' },
];
const MONTHS_OPTIONS = [3, 6, 12, 18, 24];

// ─── Demo total removed ───────────────────────────────────────────────────

// ─── Card number formatter ────────────────────────────────────────────────
function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

type PayMethod = 'card' | 'installment';
type Step = 'method' | 'details' | 'success';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const total = totalPrice;

  // Step state
  const [step, setStep]           = useState<Step>('method');
  const [method, setMethod]       = useState<PayMethod>('card');

  // Card form
  const [cardNum, setCardNum]     = useState('');
  const [expiry,  setExpiry]      = useState('');
  const [cvv,     setCvv]         = useState('');
  const [holder,  setHolder]      = useState('');

  // Installment
  const [bank,    setBank]        = useState(BANKS[0]);
  const [months,  setMonths]      = useState(12);
  const [name,    setName]        = useState('');
  const [phone,   setPhone]       = useState('+996 ');
  const [email,   setEmail]       = useState('');

  const { user } = useAuth();
  
  // Hydrate from user session first, then localStorage
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.user_metadata?.full_name || '');
    } else {
      const saved = localStorage.getItem('nexa_remembered_user');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.holder) setHolder(data.holder);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
        } catch(e){}
      }
    }
  }, [user]);

  const [loading, setLoading]     = useState(false);
  const [orderId, setOrderId]     = useState('');
  
  // 3D Secure (SMS Verification) simulated state
  const [show3DS, setShow3DS]     = useState(false);
  const [smsCode, setSmsCode]     = useState('');
  const [countdown, setCountdown] = useState(60);
  const [smsError, setSmsError]   = useState(false);
  const [generatedSms, setGeneratedSms] = useState(''); 
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Monthly payment calculation
  const monthlyPayment = useMemo(() => {
    const interest = bank.rate / 100;
    const perMonth = total / months;
    return Math.ceil(perMonth * (1 + interest * months * 0.5));
  }, [bank, months, total]);

  const overpay = useMemo(() => Math.ceil(monthlyPayment * months - total), [monthlyPayment, months, total]);

  const startPaymentProcess = () => {
    if (items.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }
    setLoading(true);
    // Имитация связи с банком
    setTimeout(() => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedSms(newCode);
      setLoading(false);
      setShow3DS(true);
      setShowNotification(true); // Показываем "уведомление" сверху
      setCountdown(60);
      setSmsError(false);
      setSmsCode('');

      // Скрываем пуш через 8 секунд
      setTimeout(() => setShowNotification(false), 8000);
    }, 1500);
  };

  useEffect(() => {
    let timer: any;
    if (show3DS && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [show3DS, countdown]);

  const handleVerifySms = async () => {
    if (smsCode !== generatedSms) {
      setSmsError(true);
      return;
    }
    
    // Код верный -> завершаем оплату
    setSmsError(false);
    setShow3DS(false);
    handleFinalizeOrder();
  };

  const handleFinalizeOrder = async () => {
    setLoading(true);
    const newOrderId = `#NX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);

    try {
      // Реальная попытка отправить письмо через API
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          name: name || holder,
          orderId: newOrderId,
          amount: total,
          productName: items.map((item: CartItem) => `${item.name} (${item.quantity})`).join(', '),
        }),
      });

      // ЗАПИСЬ В БАЗУ ДАННЫХ (Supabase) ДЛЯ ГЛОБАЛЬНОЙ АДМИНКИ
      const finalOrderEmail = email || user?.email || 'guest@nexa.ai';
      const finalCustomerName = name || holder || user?.user_metadata?.full_name || 'Имя не указано';

      const newOrder = {
        id: newOrderId,
        customer: finalCustomerName,
        email: finalOrderEmail,
        product: items.map((item: CartItem) => `${item.name} (${item.quantity})`).join(', '),
        amount: total,
        method: method,
        status: 'new',
        phone: phone,
        user_id: user?.id || null
      };

      // 1. Сохраняем в Supabase (Общая база)
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: insertedOrder, error: sbError } = await supabase.from('orders').insert([newOrder]).select();
        if (sbError) {
          console.error('Supabase Insert Error:', sbError);
          // Show visible error to admin during debugging
          alert(`❌ Ошибка сохранения заказа в базе данных:\n${sbError.message}\n\nCode: ${sbError.code}\n\nЗаказ будет только в localStorage.`);
        } else {
          console.log('✅ Заказ успешно сохранён в Supabase:', insertedOrder);
        }
      } catch (e) {
        console.error('Supabase Execution Error:', e);
      }
      
      // 2. Локальная копия (для обратной совместимости)
      const storedOrders = localStorage.getItem('nexa_orders');
      const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
      ordersList.unshift({ ...newOrder, date: new Date().toLocaleDateString('ru-RU') });
      localStorage.setItem('nexa_orders', JSON.stringify(ordersList));
      window.dispatchEvent(new Event('nexa_orders_updated'));

      // СОХРАНЯЕМ ДЛЯ СЛЕДУЮЩЕГО РАЗА (Remember Me)
      localStorage.setItem('nexa_remembered_user', JSON.stringify({
        holder: holder,
        email: email,
        phone: phone
      }));

      clearCart(); // ОЧИЩАЕМ КОРЗИНУ ПОСЛЕ УСПЕШНОГО ЗАКАЗА

      setLoading(false);
      setStep('success');
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStep('success');
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} className="text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-3">Заказ оформлен!</h1>
          <p className="text-gray-400 mb-2">Номер заказа: <span className="font-mono text-white">{orderId || '#NX-000000'}</span></p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl mb-8 mt-6"
          >
            <p className="text-blue-300 font-bold mb-2 flex items-center justify-center gap-2">
              <Mail size={18}/> 
              Письмо отправлено на {email || 'вашу почту'}
            </p>
            <p className="text-sm text-blue-200/70 leading-relaxed">
              Примерное время до готовности: 1-2 дня. Чек и все детали заказа высланы вам. <br/><br/>
              <span className="text-white">Спасибо за покупку на нашем сайте, всё идеально сработало!</span>
            </p>
          </motion.div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} /> Вернуться в каталог
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link href="/cart" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6 w-fit">
          <ArrowLeft size={16} /> Назад в корзину
        </Link>
        <p className="text-xs text-blue-400 font-mono tracking-widest uppercase mb-2">NEXA · Оформление заказа</p>
        <h1 className="text-4xl font-black text-white tracking-tight">Оплата</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left: form ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1 — choose method */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Способ оплаты</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'card' as PayMethod,        icon: CreditCard,  label: 'Банковская карта',  sub: 'Visa, Mastercard, Элкарт' },
                { id: 'installment' as PayMethod, icon: Building2,   label: 'Рассрочка',          sub: 'Банки Кыргызстана 3–24 мес.' },
              ].map(({ id, icon: Icon, label, sub }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`relative p-4 rounded-2xl text-left transition-all border ${
                    method === id
                      ? 'bg-blue-600/15 border-blue-500/50 text-white'
                      : 'bg-white/[0.03] border-white/8 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {method === id && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                  )}
                  <Icon size={22} className={method === id ? 'text-blue-400 mb-3' : 'mb-3'} />
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 2 — Details */}
          <AnimatePresence mode="wait">
            {method === 'card' ? (

              /* ─── Card form ──────────────────────────────────────────── */
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass border border-white/10 rounded-3xl p-6 space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Данные карты</h2>

                {/* Security notice */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-500/8 border border-green-500/20">
                  <ShieldCheck size={18} className="text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-green-300 font-bold">Ваши данные зашифрованы и защищены</p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Все платёжные данные передаются по протоколу TLS 1.3 и шифруются по стандарту AES-256.
                      Мы не храним данные вашей карты — платёж обрабатывается сертифицированной системой PCI DSS Level 1.
                    </p>
                  </div>
                </div>

                {/* Visual card preview */}
                <motion.div
                  className="relative h-44 rounded-3xl p-6 overflow-hidden text-white shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)' }}
                >
                  {/* Hologram circles */}
                  <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 border border-white/10" />
                  <div className="absolute -right-2 top-4 w-20 h-20 rounded-full bg-white/5 border border-white/10" />
                  <div className="absolute top-4 left-4 text-xs font-mono opacity-60 tracking-widest">NEXA PAY</div>
                  <div className="absolute bottom-14 left-6 font-mono text-lg tracking-[0.25em] text-white/90">
                    {cardNum || '•••• •••• •••• ••••'}
                  </div>
                  <div className="absolute bottom-5 left-6">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Держатель</p>
                    <p className="text-sm font-bold tracking-wider">{holder || 'ИМЯ ФАМИЛИЯ'}</p>
                  </div>
                  <div className="absolute bottom-5 right-6 text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Срок</p>
                    <p className="text-sm font-bold">{expiry || 'ММ/ГГ'}</p>
                  </div>
                  {/* Card type logos */}
                  <div className="absolute top-4 right-6 flex gap-1 opacity-80">
                    <div className="w-8 h-5 rounded-sm bg-yellow-400/80" />
                    <div className="w-8 h-5 rounded-sm bg-red-500/80 -ml-3" />
                  </div>
                </motion.div>

                {/* Card number */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Номер карты</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNum}
                    onChange={e => setCardNum(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all font-mono tracking-widest text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Срок действия</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="ММ/ГГ"
                      maxLength={5}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">CVV / CVC</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Имя держателя</label>
                  <input
                    type="text"
                    value={holder}
                    onChange={e => setHolder(e.target.value.toUpperCase())}
                    placeholder="IVANOV IVAN"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all font-mono tracking-widest mb-4"
                  />
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-5 mb-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email (для чека)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => {
                        let v = e.target.value;
                        if (!v.startsWith('+996')) v = '+996 ' + v.replace(/\D/g, '');
                        setPhone(v);
                      }}
                      placeholder="+996 700 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Logos row */}
                <div className="flex items-center gap-3 pt-2">
                  <Lock size={12} className="text-green-400" />
                  <p className="text-[11px] text-gray-500">Защищено протоколом SSL · PCI DSS · 3-D Secure</p>
                  <div className="ml-auto flex gap-2 text-xs font-mono text-gray-500 border border-white/5 px-3 py-1 rounded-full">
                    VISA · MC · Элкарт
                  </div>
                </div>
              </motion.div>

            ) : (

              /* ─── Installment form ────────────────────────────────────── */
              <motion.div
                key="installment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Оформление рассрочки</h2>

                {/* Bank select */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Выберите банк</label>
                  <div className="space-y-2">
                    {BANKS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setBank(b)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all ${
                          bank.id === b.id
                            ? 'bg-blue-600/12 border-blue-500/40'
                            : 'bg-white/[0.03] border-white/7 hover:border-white/18'
                        }`}
                      >
                        <span className="text-2xl">{b.logo}</span>
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${bank.id === b.id ? 'text-blue-300' : 'text-white'}`}>{b.name}</p>
                          <p className="text-xs text-gray-500">{b.description}</p>
                        </div>
                        {b.rate === 0 ? (
                          <span className="text-xs font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">0%</span>
                        ) : (
                          <span className="text-xs text-gray-500">{b.rate}%/мес</span>
                        )}
                        {bank.id === b.id && <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Months */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Срок рассрочки</label>
                  <div className="flex gap-2 flex-wrap">
                    {MONTHS_OPTIONS.map(m => (
                      <button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`flex-1 min-w-[60px] py-2.5 rounded-2xl text-sm font-black border transition-all ${
                          months === m
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white/[0.03] border-white/8 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {m} мес.
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculator result */}
                <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Расчёт рассрочки</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Сумма покупки</span><span className="text-white font-bold">${total.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Срок</span><span className="text-white font-bold">{months} месяцев</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Банк</span><span className="text-white font-bold">{bank.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Ставка</span><span className="text-white font-bold">{bank.rate === 0 ? '0% (без переплат)' : `${bank.rate}%/мес`}</span></div>
                    {overpay > 0 && (
                      <div className="flex justify-between"><span className="text-gray-400">Переплата</span><span className="text-orange-400 font-bold">+${overpay.toLocaleString()}</span></div>
                    )}
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-base">
                      <span className="text-white font-bold">Платёж в месяц</span>
                      <span className="text-2xl font-black text-blue-300">${monthlyPayment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Ваше имя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Имя Фамилия"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => {
                        let v = e.target.value;
                        if (!v.startsWith('+996')) v = '+996 ' + v.replace(/\D/g, '');
                        setPhone(v);
                      }}
                      placeholder="+996 700 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email (для чека)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Right: order summary ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass border border-white/10 rounded-3xl p-6 sticky top-24"
          >
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Ваш заказ</h2>

            <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between text-sm items-start gap-4">
                  <div className="flex-1">
                    <p className="text-white font-bold leading-tight">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{item.quantity} шт. × ${item.price.toLocaleString()}</p>
                  </div>
                  <span className="text-white font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                <span className="text-gray-400">Доставка</span>
                <span className="text-green-400 font-bold">Бесплатно</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Гарантия</span>
                <span className="text-blue-400 font-bold">3 года</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              {method === 'installment' ? (
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-sm">Итого</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">${monthlyPayment.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/мес</span></p>
                      <p className="text-xs text-gray-500">× {months} мес = ${(monthlyPayment * months).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">К оплате</span>
                  <span className="text-2xl font-black text-white">${total.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Pay button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startPaymentProcess}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm tracking-wider transition-all relative overflow-hidden"
              style={{
                background: loading ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(59,130,246,0.35)',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Обрабатываем...
                </div>
              ) : method === 'card' ? (
                <span className="flex items-center justify-center gap-2"><Lock size={14} /> Оплатить ${total.toLocaleString()}</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Building2 size={14} /> Подать заявку</span>
              )}
            </motion.button>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: '🔒', text: 'TLS 1.3 шифрование' },
                { icon: '🛡️', text: 'PCI DSS Level 1' },
                { icon: '↩️', text: '30 дней возврат' },
                { icon: '✅', text: '3-D Secure' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 3D SECURE MODAL (Realistic Bank View) ── */}
      <AnimatePresence>
        {show3DS && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden flex flex-col items-center p-8 text-black shadow-[0_0_100px_rgba(37,99,235,0.3)]"
            >
              {/* Bank Header */}
              <div className="flex items-center justify-between w-full mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">V</div>
                  <span className="font-bold text-sm tracking-tight">Visa Secure</span>
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-2 px-3 py-1 rounded-full border-gray-100">Verified</div>
              </div>

                 <div className="text-center mb-6">
                 <h2 className="text-xl font-black mb-2">Подтверждение</h2>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   Мы отправили SMS с кодом на ваш номер. <br/>Списание: <span className="text-blue-600 font-bold">${total.toLocaleString()}.00</span>
                 </p>
              </div>

              <div className="w-full space-y-4">
                 <div className="relative">
                    <input 
                       type="text" 
                       value={smsCode}
                       onChange={e => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                       placeholder="• • • • • •"
                       className={`w-full bg-gray-50 border-2 ${smsError ? 'border-red-500 bg-red-50' : 'border-gray-100'} rounded-2xl py-4 text-center text-2xl font-black tracking-[0.5em] focus:border-blue-500 focus:bg-white transition-all outline-none`}
                       autoFocus
                    />
                    {smsError && <p className="text-[10px] text-red-500 font-bold absolute -bottom-5 left-0 w-full text-center uppercase tracking-widest">Неверный код. Введите код из уведомления.</p>}
                 </div>

                 <p className="text-center text-[11px] text-gray-400 pt-4">
                   {countdown > 0 ? (
                     <>Код действителен еще <span className="font-bold text-blue-600 font-mono">{countdown}с</span></>
                   ) : (
                     <button onClick={() => {
                        const nextCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedSms(nextCode);
                        setCountdown(60); 
                        setSmsError(false);
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 8000);
                     }} className="text-blue-600 font-bold hover:underline font-black uppercase tracking-tighter">Отправить новый код</button>
                   )}
                 </p>

                 <button 
                   onClick={handleVerifySms}
                   className="w-full bg-black text-white py-4 rounded-2xl font-black mt-4 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-30 shadow-xl shadow-black/10"
                   disabled={smsCode.length < 6 || countdown === 0}
                 >
                   Подтвердить оплату
                 </button>

                 <button 
                   onClick={() => setShow3DS(false)}
                   className="w-full text-gray-400 text-[11px] font-black py-2 hover:text-gray-600 uppercase tracking-widest"
                 >
                   Отменить платеж
                 </button>
              </div>

              {/* Security Badge */}
              <div className="mt-8 flex items-center gap-2 opacity-20">
                 <ShieldCheck size={14} />
                 <span className="text-[9px] font-bold uppercase tracking-widest">PCI DSS Secure Encryption</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Realistic SMS Notification (Top Push) ── */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none px-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 flex items-start gap-4 max-w-sm w-full pointer-events-auto ring-1 ring-black/5">
               <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                  <Mail size={22} className="opacity-90" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">MBank / VISA</span>
                     <span className="text-[10px] text-gray-400 font-bold">Сейчас</span>
                  </div>
                  <p className="text-sm text-black font-black leading-tight">Код подтверждения оплаты</p>
                  <p className="text-xs text-gray-600 mt-1">Никому не сообщайте Ваш код: <span className="text-blue-600 font-black text-sm bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{generatedSms}</span> для списания ${total.toLocaleString()}.00</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
