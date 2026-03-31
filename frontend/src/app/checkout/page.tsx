'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Building2, Lock, ShieldCheck, CheckCircle2, ChevronDown, ArrowLeft, Mail } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

declare global {
  interface Window {
    google: unknown;
  }
}

// ─── Constants removed (Installments no longer supported) ─────────────────


// ─── Demo total removed ───────────────────────────────────────────────────

// ─── Card number formatter ────────────────────────────────────────────────
function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

type Step = 'details' | 'success';

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const { totalPrice, items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      setStatus('ready'); // Nothing to load for empty cart, but UI will handle it
      return;
    }

    if (totalPrice > 0) {
      setStatus('loading');
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, metadata: { source: 'checkout' } }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
          return data;
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setStatus('ready');
          } else {
            throw new Error('Не удалось получить ключ платежа');
          }
        })
        .catch((err) => {
          console.error('Checkout Load Error:', err);
          setErrorMsg(err.message || 'Ошибка инициализации платежа');
          setStatus('error');
        });
    }
  }, [totalPrice, items.length]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ошибка оплаты</h2>
          <p className="text-gray-400 mb-8">{errorMsg || 'Что-то пошло не так при подготовке платежа. Проверьте соединение.'}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Попробовать снова
            </button>
            <Link href="/cart" className="text-gray-500 hover:text-white text-sm font-bold">
              Вернуться в корзину
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (status === 'ready' && clientSecret) || items.length === 0 ? (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret, 
        appearance: { 
          theme: 'night', 
          variables: { colorPrimary: '#3b82f6', colorBackground: '#0f172a', colorText: '#e2e8f0' } 
        } 
      }}
    >
      <CheckoutInner />
    </Elements>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase animate-pulse">Безопасное соединение...</p>
      </div>
    </div>
  );
}

function CheckoutInner() {
  const { items, totalPrice, clearCart } = useCart();
  const total = totalPrice;
  const stripe = useStripe();
  const elements = useElements();

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Step state
  const [step, setStep]           = useState<Step>('details');
  const [loading, setLoading]     = useState(false);
  const [orderId, setOrderId]     = useState('');

  // Auto-redirect guest users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  const customerName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'NEXA Customer';
  const customerEmail = user?.email || '';


  const startPaymentProcess = async () => {
    if (items.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Stripe real confirmation flow
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: customerName,
            email: customerEmail,
          }
        }
      },
      redirect: 'if_required', 
    });

    if (error) {
      console.error('Stripe error:', error.message);
      alert(error.message || 'Ошибка обработки карты');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      handleFinalizeOrder(paymentIntent.id);
    }
  };



  const handleFinalizeOrder = async (stripePaymentId?: string) => {
    setLoading(true);
    const newOrderId = `#NX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);

    try {
      // Реальная попытка отправить письмо через API
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail,
          name: customerName,
          orderId: newOrderId,
          amount: total,
          productName: items.map((item: CartItem) => `${item.name} (${item.quantity})`).join(', '),
        }),
      });

      // Строго по схеме таблицы
      const newOrder = {
        id: newOrderId,
        customer: customerName,
        email: customerEmail,
        product: items.map((item: CartItem) => `${item.name} (${item.quantity})`).join(', '),
        amount: total,
        method: 'card',
        status: stripePaymentId ? `paid (${stripePaymentId})` : 'new',
        phone: '' // Phone no longer collected manually
      };

      // 1. ПРИОРИТЕТ: Локальная копия (чтобы пользователь видел заказ сразу)
      const storedOrders = localStorage.getItem('nexa_orders');
      const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
      const localOrder = { ...newOrder, date: new Date().toLocaleDateString('ru-RU') };
      ordersList.unshift(localOrder);
      localStorage.setItem('nexa_orders', JSON.stringify(ordersList));
      window.dispatchEvent(new Event('nexa_orders_updated'));

      // 2. ГЛОБАЛЬНАЯ СИНХРОНИЗАЦИЯ: Отправляем через наш API
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });
      } catch (e) {
        console.error('Fetch to /api/orders failed:', e);
      }

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
              Письмо отправлено на {customerEmail}
            </p>
            <p className="text-sm text-blue-200/70 leading-relaxed">
              Примерное время до готовности: 1-2 дня. Чек и все детали заказа высланы вам. <br/><br/>
              <span className="text-white">Спасибо за покупку на нашем сайте, всё идеально сработало!</span>
            </p>
          </motion.div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 btn-premium font-bold rounded-2xl transition-all"
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

          {/* Step 1 — Security Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Информация о клиенте</h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                  {customerName.charAt(0).toUpperCase()}
               </div>
               <div>
                  <p className="text-white font-bold">{customerName}</p>
                  <p className="text-xs text-gray-500">{customerEmail}</p>
               </div>
               <div className="ml-auto text-[10px] text-green-400 font-mono bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 uppercase tracking-widest">
                  Авторизован
               </div>
            </div>
          </motion.div>

          {/* Step 2 — Card Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  Безопасный платёж через Stripe. Мы не храним данные вашей карты.
                </p>
              </div>
            </div>

            {/* Stripe Secure Element Component */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/10 mb-5 relative group transition-all hover:border-blue-500/50">
              <PaymentElement 
                  options={{
                    layout: 'accordion',
                    defaultValues: { billingDetails: { name: customerName, email: customerEmail } }
                  }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-transparent group-hover:ring-blue-500/30 rounded-2xl pointer-events-none transition-all" />
            </div>

            {/* Logos row */}
            <div className="flex items-center gap-3 pt-2">
              <Lock size={12} className="text-green-400" />
              <p className="text-[11px] text-gray-500">SSL · PCI DSS · 3-D Secure</p>
              <div className="ml-auto flex gap-2 text-xs font-mono text-gray-500 border border-white/5 px-3 py-1 rounded-full">
                VISA · MC · AMEX
              </div>
            </div>
          </motion.div>
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
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">К оплате</span>
                  <span className="text-2xl font-black text-white">${total.toLocaleString()}</span>
                </div>
            </div>

            {/* Pay button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startPaymentProcess}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wider transition-all relative overflow-hidden ${loading ? 'opacity-50' : 'btn-premium'}`}
              style={{
                boxShadow: loading ? 'none' : '0 8px 32px var(--accent-glow)',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Обрабатываем...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2"><Lock size={14} /> Оплатить ${total.toLocaleString()}</span>
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
    </div>
  );
}
