'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const getFavoritesKey = () => {
    try {
      const userStr = localStorage.getItem('nexa_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email) return `nexa-favorites-${user.email}`;
      }
    } catch (e) {}
    return 'nexa_favorites';
  };

  useEffect(() => {
    setMounted(true);
    const key = getFavoritesKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        const key = getFavoritesKey();
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  if (!mounted) {
    return (
      <FavoritesContext.Provider value={{ favorites: [], toggleFavorite: () => {}, isFavorite: () => false }}>
        {children}
      </FavoritesContext.Provider>
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    // Return a safe fallback rather than crashing the whole site
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
    };
  }
  return context;
}
