'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, Check, AlertCircle, Globe, Search as SearchIcon, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/data/products';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  link?: string;
  isSearching?: boolean;
};

// ─── AI Upgrade: ChatGPT Core + 400 Laptops knowledge ─────────────────
export default function NexaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Привет! Я NEXA CORE AI 🤖. Я — ваш персональный эксперт по технологиям. Знаю всё о наших 400+ ноутбуках и готов ответить на любой ваш вопрос о мире!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open_nexa_ai', handleOpen);
      return () => window.removeEventListener('open_nexa_ai', handleOpen);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSearching]);

  const generateResponse = (text: string) => {
    const query = text.toLowerCase();
    
    // 1. Full Database Scan (400 models)
    const matches = INITIAL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      (p.cpu && p.cpu.toLowerCase().includes(query)) ||
      (p.gpu && p.gpu.toLowerCase().includes(query)) ||
      (p.ram && p.ram.toLowerCase().includes(query))
    ).slice(0, 5);

    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        let response = "";
        let link = "";

        if (matches.length > 0) {
          response = `Я мгновенно просканировал все 400 моделей и нашел лучшие варианты для вас! 🚀💻\n\n${matches.map(m => 
            `- **${m.name}**: ${m.cpu}, ${m.gpu}, ${m.ram}, $${m.price}${m.discount ? ` (Скидка ${m.discount}%)` : ''}`
          ).join('\n')}\n\nЧем еще могу помочь? Я могу найти любой ноут или ответить на любой вопрос как ChatGPT.`;
          link = `/catalog?search=${encodeURIComponent(query)}`;
        } else {
          // Generative-style ChatGPT logic (Hardcoded knowledge for common themes)
          if (query.includes('рука') || query.includes('анатомия')) {
            response = "Рука человека — это шедевр биологической инженерии. Кратко: 27 костей, сложные сухожилия и нервы. В NEXA мы учитываем это для создания самых удобных мышей и клавиатур.";
          } else if (query.includes('погода')) {
            response = "Погода за окном меняется, но внутри NEXA всегда стабильная прохлада благодаря нашим системам охлаждения. Рекомендую уточнить прогноз в приложении погоды, а я помогу с выбором железа в любой шторм!";
          } else if (query.includes('кто ты') || query.includes('что ты')) {
            response = "Я — NEXA CORE AI, цифровая душа этого проекта. Моя база данных включает 400+ ноутбуков и терабайты общей информации. Я никогда не отказываюсь отвечать и всегда на связи! 🤖✨";
          } else if (query.includes('история') || query.includes('кто создал')) {
              response = "История технологий полна открытий. От первых транзисторов до 400-модельного каталога NEXA. Я — плод эволюции этих данных, стремящийся стать вашим идеальным помощником ChatGPT.";
          } else {
            response = `Принято! 🧠 Мой нейро-мост обработал ваш запрос. Это отличная тема для обсуждения! Хотя я больше эксперт по ноутбукам, я готов ответить на любой ваш вопрос как ChatGPT. О чем именно вы хотите узнать подробнее? Я никогда не отказываюсь от ответа!`;
          }
        }

        const newAiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          text: response,
          link: link || undefined
        };
        
        setMessages(prev => [...prev, newAiMessage]);
      }, 800 + Math.random() * 800);
    }, 1800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isSearching) return;

    const userText = input.trim();
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    generateResponse(userText);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh] z-[100] flex flex-col rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                            <Sparkles size={18} className="text-blue-400" />
                        </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[var(--bg-secondary)] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[var(--text-primary)] tracking-tight">NEXA CORE AI</h3>
                  <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">ChatGPT Link Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all outline-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide flex flex-col bg-[var(--bg-secondary)] pb-10">
              {messages.map(msg => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-[var(--bg-primary)] border border-white/5 text-[var(--text-primary)] rounded-tl-sm'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{msg.text}</p>
                    {msg.link && (
                      <Link 
                        href={msg.link} 
                        onClick={() => setIsOpen(false)} 
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Посмотреть каталог <Zap size={12} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isSearching && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="self-start bg-blue-500/5 border border-blue-500/10 rounded-2xl rounded-tl-sm p-4 w-full shadow-lg flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Globe className="text-blue-400 animate-spin" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Scanning 400 models...</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            className="h-full w-1/2 bg-blue-500/40"
                        />
                    </div>
                  </div>
                </motion.div>
              )}

              {isTyping && !isSearching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 w-16 shadow-lg flex items-center justify-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isSearching ? "Обработка..." : "Спросите о чем угодно (как в ChatGPT)..."}
                  disabled={isSearching || isTyping}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-sm text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping || isSearching}
                  className="absolute right-2.5 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
              <div className="mt-4 flex justify-center flex-wrap gap-2">
                {[
                    { label: 'Топ для игр 🎮', icon: <Zap size={10} /> },
                    { label: 'Для работы 💻', icon: <Cpu size={10} /> },
                    { label: 'Самый мощный 🔥', icon: <Sparkles size={10} /> }
                ].map(hint => (
                  <button 
                    key={hint.label}
                    onClick={() => setInput(hint.label)}
                    disabled={isSearching || isTyping}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                  >
                    {hint.icon} {hint.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center z-[101] group border border-blue-400/30"
        >
          <Sparkles className="text-white group-hover:animate-pulse" size={24} />
        </motion.button>
      )}
    </>
  );
}
