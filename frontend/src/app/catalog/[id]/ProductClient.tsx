'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check, Image as ImageIcon, Box } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function SimpleLaptopViewer() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4, 0.1, 3]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Screen */}
      <group position={[0, -0.05, -1.4]} rotation={[-0.2, 0, 0]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[4, 2.8, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.4, 0.06]}>
          <planeGeometry args={[3.8, 2.6]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function ProductClient({ product, id }: { product: any, id: string }) {
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<'3D' | 'IMAGE'>('IMAGE');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      type: product.type,
      image: product.image
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center gap-8 text-center max-w-xl mx-auto">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
           <Box size={40} className="text-gray-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Товар не найден</h1>
          <p className="text-gray-400">Данный ноутбук больше недоступен в каталоге или ссылка неверна.</p>
        </div>
        <Link 
          href="/catalog"
          className="bg-white text-black font-black px-12 py-4 rounded-full uppercase tracking-widest hover:bg-gray-200 transition-all text-xs"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] glass-dark rounded-3xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {viewMode === '3D' ? (
            <motion.div 
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="city" />
                <Float rotationIntensity={0.2} floatIntensity={0.5} speed={1.5}>
                  <SimpleLaptopViewer />
                </Float>
                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
                <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
              </Canvas>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono">3D МОДЕЛЬ</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono">ЗАЖМИТЕ ДЛЯ ПОВОРОТА</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 glass px-2 py-2 rounded-full backdrop-blur-xl border border-white/10">
          <button 
            onClick={() => setViewMode('IMAGE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${viewMode === 'IMAGE' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
          >
            <ImageIcon size={14} /> ФОТО
          </button>
          <button 
            onClick={() => setViewMode('3D')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${viewMode === '3D' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
          >
            <Box size={14} /> 3D ОБЗОР
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center"
      >
        <p className="text-blue-400 font-bold tracking-widest text-sm mb-2">{product.brand}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">{product.description}</p>

        <div className="text-4xl font-light mb-8">${product.price.toLocaleString()}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="glass p-4 rounded-xl">
            <span className="block text-xs text-gray-500 mb-1">Процессор (CPU)</span>
            <span className="font-medium text-sm">{product.cpu}</span>
          </div>
          <div className="glass p-4 rounded-xl">
            <span className="block text-xs text-gray-500 mb-1">Видеокарта (GPU)</span>
            <span className="font-medium text-sm">{product.gpu}</span>
          </div>
          <div className="glass p-4 rounded-xl">
            <span className="block text-xs text-gray-500 mb-1">ОЗУ (RAM)</span>
            <span className="font-medium text-sm">{product.ram}</span>
          </div>
          <div className="glass p-4 rounded-xl">
            <span className="block text-xs text-gray-500 mb-1">Накопитель</span>
            <span className="font-medium text-sm">{product.storage}</span>
          </div>
          <div className="glass p-4 rounded-xl sm:col-span-2">
            <span className="block text-xs text-gray-500 mb-1">Экран</span>
            <span className="font-medium text-sm">{product.display}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 font-semibold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2
              ${added
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-gray-200'
              }`}
          >
            {added ? (
              <>
                <Check size={18} />
                Добавлено!
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                В корзину
              </>
            )}
          </motion.button>
          <button className="px-8 bg-transparent border border-white/20 font-semibold rounded-full hover:bg-white/10 transition-colors">
            В избранное
          </button>
        </div>
      </motion.div>
    </div>
  );
}
