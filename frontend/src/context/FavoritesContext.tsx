'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  syncValidFavorites: (validIds: string[]) => void;
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

  const clearFavorites = () => {
    setFavorites([]);
    if (typeof window !== 'undefined') {
      const key = getFavoritesKey();
      localStorage.removeItem(key);
    }
  };

  const syncValidFavorites = (validIds: string[]) => {
    // This allows the Favorites page to remove IDs that no longer exist in the catalog
    setFavorites(prev => {
      const valid = prev.filter(id => validIds.includes(id));
      if (valid.length !== prev.length) {
        if (typeof window !== 'undefined') {
          const key = getFavoritesKey();
          localStorage.setItem(key, JSON.stringify(valid));
        }
        return valid;
      }
      return prev;
    });
  };

  if (!mounted) {
    return (
      <FavoritesContext.Provider value={{ favorites: [], toggleFavorite: () => {}, isFavorite: () => false, clearFavorites: () => {}, syncValidFavorites: () => {} }}>
        {children}
      </FavoritesContext.Provider>
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites, syncValidFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    return {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
      clearFavorites: () => {},
      syncValidFavorites: () => {}
    };
  }
  return context;
}
