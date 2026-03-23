'use client';
import { motion } from 'framer-motion';
import { User, Settings, Heart, Clock, LogOut } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function Dashboard() {
  // Mock data for user's favorite items
  const favorites = [
    { id: '1', name: 'NexaBlade 16', brand: 'NEXA', type: 'GAMING', cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4090 16GB', ram: '64GB DDR5', price: 3499 },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Profile */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/4"
      >
        <div className="glass-dark rounded-3xl p-6 sticky top-24">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-4">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <User size={40} className="text-white/50" />
              </div>
            </div>
            <h2 className="text-xl font-bold">Alex Mercer</h2>
            <p className="text-gray-400 text-sm">alex.mercer@example.com</p>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 text-white transition-colors">
              <Heart size={18} />
              <span className="font-medium">Favorites</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Clock size={18} />
              <span className="font-medium">Order History</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Settings size={18} />
              <span className="font-medium">Settings</span>
            </button>
            <div className="pt-4 mt-4 border-t border-white/10">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
                <LogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full md:w-3/4"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Favorites</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-3xl p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
            <p className="text-gray-400">Items you like will appear here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
