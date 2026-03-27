'use client';
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  type: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to get user-specific cart key
  const getCartKey = () => {
    try {
      const userStr = localStorage.getItem('nexa_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email) return `nexa-cart-${user.email}`;
      }
    } catch (e) {
      // ignore parse errors
    }
    return 'nexa-cart-guest';
  };

  // Load from localStorage on mount
  useEffect(() => {
    const key = getCartKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      const key = getCartKey();
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      setItems(prev =>
        prev.map(item => item.id === id ? { ...item, quantity } : item)
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
