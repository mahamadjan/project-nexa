import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from '@/components/auth/AuthProvider';
import StarField from '@/components/ui/StarField';
import SiteSync from '@/components/config/SiteSync';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NEXA | Премиальные Ноутбуки',
  description: 'Будущее компьютеров. Каталог высокопроизводительных игровых и профессиональных ноутбуков с 3D взаимодействием.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <SiteSync />
            <CartProvider>
              <StarField />
              <Header />
              <main className="min-h-screen pt-16">
                {children}
              </main>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
