'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, Check, Zap, Cpu, ShoppingBag, Info, ArrowRight, MessageSquare, Globe, Laptop } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  link?: string;
  isSearching?: boolean;
  type?: 'text' | 'selection' | 'product';
  data?: any;
};

export default function NexaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Привет! Я NEXA CORE AI 🤖. Я могу помочь вам выбрать ноутбук, ответить на технические вопросы или подсказать по условиям покупки. О чем хотите узнать?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open_nexa_ai', handleOpen);
      const syncProducts = async () => {
        const { data } = await supabase.from('products').select('*');
        if (data) setAllProducts(data);
      };
      syncProducts();
      return () => window.removeEventListener('open_nexa_ai', handleOpen);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSearching]);

  const generateResponse = async (text: string) => {
    const query = text.toLowerCase();
    
    // Simulate thinking
    setIsSearching(true);
    
    // Determine context
    const isGaming = query.includes('игр') || query.includes('гейм') || query.includes('gaming') || query.includes('fps');
    const isWork = query.includes('работ') || query.includes('офис') || query.includes('кодинг') || query.includes('график');
    const isCheap = query.includes('дешев') || query.includes('бюджет') || query.includes('недорог');
    const isMac = query.includes('mac') || query.includes('эпл') || query.includes('apple') || query.includes('мак');
    const isDelivery = query.includes('доставк') || query.includes('привез') || query.includes('курьер');
    const isInstallment = query.includes('рассрочк') || query.includes('кредит') || query.includes('оплат');

    setTimeout(() => {
      setIsSearching(false);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        let response = "";
        let link = "";
        let matchedProducts: any[] = [];

        if (isInstallment) {
          response = "Да, мы предоставляем рассрочку до 24 месяцев через Kaspi, Halyk или наш внутренний сервис NEXA Finance. 💳 Одобрение занимает около 2 минут прямо при оформлении заказа в корзине. \n\nХотите подобрать ноутбук, который проходит под минимальный платеж?";
        } else if (isDelivery) {
          response = "Бесплатная экспресс-доставка по всему Казахстану! 🚚 В Алматы и Астане привозим в течение 2-4 часов. При получении вы сможете полностью проверить устройство перед оплатой.";
        } else if (isGaming) {
          matchedProducts = allProducts.filter(p => p.type === 'GAMING').sort((a,b) => b.price - a.price).slice(0, 2);
          response = `Для гейминга я рекомендую выбирать модели с RTX 4070 и выше. 🎮 В нашем каталоге сейчас лидируют:\n\n${matchedProducts.length > 0 ? matchedProducts.map(p => `- **${p.name}** ($${p.price})`).join('\n') : '- Скоро появятся новые поступления!'}\n\nЭти машины потянут любые новинки на ультра-настройках. Желаете посмотреть подробнее?`;
          link = '/catalog?type=GAMING';
        } else if (isMac) {
          matchedProducts = allProducts.filter(p => p.brand.toLowerCase() === 'apple').slice(0, 2);
          response = `MacBook — идеальный выбор для творческих профессионалов и тех, кто ценит автономность. 🍏 У нас есть последние модели на чипах M3 и M3 Max. \n\n${matchedProducts.length > 0 ? matchedProducts.map(p => `- **${p.name}** ($${p.price})`).join('\n') : 'К сожалению, сейчас MacBook разобрали. Загляните позже!'}`;
          link = '/catalog?search=apple';
        } else if (isCheap) {
          matchedProducts = allProducts.sort((a,b) => a.price - b.price).slice(0, 2);
          response = `Если важен бюджет, у нас отличные предложения в категории "Бизнес-Комфорт". 💸 Самые выгодные сейчас:\n\n${matchedProducts.length > 0 ? matchedProducts.map(p => `- **${p.name}** ($${p.price})`).join('\n') : 'Данные загружаются...'}`;
          link = '/catalog?sort=price-asc';
        } else if (query.includes('привет') || query.includes('здравствуй')) {
          response = "Здравствуйте! 😊 Я — NEXA AI. Я всегда на связи, чтобы сделать ваш выбор ноутбука максимально легким и приятным. Чем могу помочь?";
        } else {
          // General Knowledge Fallback (like ChatGPT)
          const fallbackResponses = [
             "Интересный вопрос! 🧠 Наша команда экспертов сейчас мониторит рынок, и я могу сказать, что NEXA всегда выбирает лучшие комплектующие. Вас интересует техническая часть или условия покупки?",
             "Понимаю вас. В мире технологий всё меняется быстро. 🚀 Какой именно аспект для вас важнее всего в ноутбуке: мощность процессора, качество экрана или время работы от батареи?",
             "Я готов обсудить любую тему! Но прежде всего я спец по электронике. Хотите, я сравню производительность разных видеокарт для ваших задач?"
          ];
          response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }

        const newMsg: Message = { id: Date.now().toString(), sender: 'ai', text: response, link: link || undefined };
        setMessages(prev => [...prev, newMsg]);
      }, 700 + Math.random() * 800);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isSearching) return;
    const t = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: t }]);
    setInput('');
    generateResponse(t);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[650px] max-h-[85vh] z-[100] flex flex-col rounded-[2.5rem] overflow-hidden glass-dark border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)] origin-bottom-right"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 flex items-center justify-between backdrop-blur-3xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
               <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-[#0a0a0c] flex items-center justify-center">
                           <Sparkles size={20} className="text-blue-400" />
                        </div>
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0a0c] rounded-full shadow-lg" />
                  </div>
                  <div>
                     <h3 className="font-black text-sm text-white tracking-widest uppercase">NEXA <span className="text-blue-400">CORE AI</span></h3>
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Quantum Logic Online</p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all backdrop-blur-md">
                  <X size={18} />
               </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-hide flex flex-col bg-[rgba(6,6,8,0.4)]">
               {messages.map(msg => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] shadow-2xl relative ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
                          : 'bg-[#1a1a20] border border-white/5 text-gray-200 rounded-tl-sm'
                     }`}>
                        <p className="text-[13px] font-medium leading-relaxed whitespace-pre-line tracking-tight">{msg.text}</p>
                        {msg.link && (
                           <Link 
                             href={msg.link}
                             onClick={() => setIsOpen(false)}
                             className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                              Перейти <ArrowRight size={12} />
                           </Link>
                        )}
                        {msg.sender === 'ai' && (
                           <div className="absolute -left-2 top-0 text-[#1a1a20]">
                              {/* Tail SVG or similar could go here */}
                           </div>
                        )}
                     </div>
                  </motion.div>
               ))}
               
               {isSearching && (
                  <motion.div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 w-fit">
                     <Globe className="text-blue-400 animate-spin" size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/70">Анализ запроса...</span>
                  </motion.div>
               )}

               {isTyping && (
                  <motion.div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 w-fit ml-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-white/5 bg-[#0a0a0c]/80 backdrop-blur-3xl">
               <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                     type="text"
                     value={input}
                     onChange={e => setInput(e.target.value)}
                     placeholder="Спросите меня о чем угодно..."
                     disabled={isTyping || isSearching}
                     className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isTyping || isSearching}
                    className="absolute right-2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all disabled:opacity-30 shadow-lg shadow-blue-500/20"
                  >
                     <Send size={18} className="translate-x-0.5" />
                  </button>
               </form>
               
               <div className="mt-4 flex flex-wrap gap-2">
                  {[
                     { label: 'Игровые топ 🔥', q: 'Какие лучшие игровые ноуты?' },
                     { label: 'Рассрочка 💳', q: 'Какие условия рассрочки?' },
                     { label: 'MacBook 💻', q: 'Покажи макбуки' }
                  ].map(hint => (
                     <button
                        key={hint.label}
                        onClick={() => { setInput(hint.q); }}
                        className="px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                     >
                        {hint.label}
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger */}
      <AnimatePresence>
         {!isOpen && (
            <motion.button
               initial={{ scale: 0, rotate: -45 }}
               animate={{ scale: 1, rotate: 0 }}
               whileHover={{ scale: 1.1, y: -5 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsOpen(true)}
               className="fixed bottom-6 right-6 w-16 h-16 rounded-[1.8rem] bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center z-[101] group border border-blue-400/30 overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
               <Sparkles className="text-white relative z-10" size={28} />
               
               {/* Pulse Ring */}
               <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-[1.8rem] border-2 border-blue-400/50"
               />
            </motion.button>
         )}
      </AnimatePresence>
    </>
  );
}
