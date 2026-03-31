import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from '@/components/auth/AuthProvider';
import ParticleDashBackground from '@/components/ui/ParticleDashBackground';
import SiteSync from '@/components/config/SiteSync';
import NexaAssistant from '@/components/ui/NexaAssistant';
import Preloader from '@/components/ui/Preloader';

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
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC script: runs BEFORE any paint, sets theme class instantly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('nexa-theme');
                document.documentElement.classList.remove('dark','light');
                document.documentElement.classList.add(t === 'light' ? 'light' : 'dark');
              } catch(e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.light { background: #ffffff !important; color: #020617 !important; }
              html.dark { background: #000000 !important; color: #ffffff !important; }
              body { background: inherit; color: inherit; }
            `,
          }}
        />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <SiteSync />
            <Preloader />
            <FavoritesProvider>
              <CartProvider>
                <ParticleDashBackground />
                <Header />
                <NexaAssistant />
                <main className="min-h-screen pt-16">
                  {children}
                </main>
              </CartProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
