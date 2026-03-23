'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteSync() {
  const [maintenance, setMaintenance] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const applySettings = () => {
      const stored = localStorage.getItem('nexa_settings');
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          if (settings.name) document.title = settings.name;
          if (settings.maintenance !== undefined) setMaintenance(settings.maintenance);
        } catch (e) {}
      }
    };

    applySettings();
    window.addEventListener('nexa_settings_updated', applySettings);
    return () => window.removeEventListener('nexa_settings_updated', applySettings);
  }, []);

  if (maintenance && !pathname?.startsWith('/admin')) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050510] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black mb-4">Технические работы 🛠️</h1>
        <p className="text-gray-400 text-center max-w-md">
          Сайт временно недоступен в связи с техническим обслуживанием. Пожалуйста, зайдите позже.
        </p>
      </div>
    );
  }

  return null;
}
