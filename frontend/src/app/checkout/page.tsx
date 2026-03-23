'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Building2, Lock, ShieldCheck, CheckCircle2, ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// ─── Kyrgyzstan banks offering installments ────────────────────────────────
const BANKS = [
  { id: 'mbank',      name: 'MBank',           logo: '🏦', rate: 0, description: 'Без переплат до 12 мес.' },
  { id: 'optima',     name: 'Optima Bank',      logo: '🔵', rate: 1.8, description: 'Рассрочка от 3–24 мес.' },
  { id: 'bakcell',    name: 'Bakai Bank',       logo: '🟢', rate: 1.5, description: 'Рассрочка до 18 мес.' },
  { id: 'demirbank',  name: 'Demir Kyrgyz',     logo: '🔴', rate: 2.0, description: 'Рассрочка до 24 мес.' },
  { id: 'rsb',        name: 'RSK Bank',         logo: '🟡', rate: 1.2, description: 'Выгодный процент' },
];
const MONTHS_OPTIONS = [3, 6, 12, 18, 24];

// ─── Demo total ───────────────────────────────────────────────────────────
const DEMO_TOTAL = 3499;

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
  const total = DEMO_TOTAL;

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
  const [phone,   setPhone]       = useState('');

  const [loading, setLoading]     = useState(false);

  // Monthly payment calculation
  const monthlyPayment = useMemo(() => {
    const interest = bank.rate / 100;
    const perMonth = total / months;
    return Math.ceil(perMonth * (1 + interest * months * 0.5));
  }, [bank, months, total]);

  const overpay = useMemo(() => Math.ceil(monthlyPayment * months - total), [monthlyPayment, months, total]);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2200);
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
          <p className="text-gray-400 mb-2">Номер заказа: <span className="font-mono text-white">#NX-{Math.floor(100000 + Math.random() * 900000)}</span></p>
          <p className="text-gray-400 mb-8">Детали отправлены на ваш Email. Ожидайте звонка менеджера.</p>
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all font-mono tracking-widest"
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Ваше имя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Айбек Уста"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Номер телефона</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+996 700 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 outline-none transition-all"
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

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">NexaBlade 16 × 1</span>
                <span className="text-white font-bold">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
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
              onClick={handlePay}
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
    </div>
  );
}
