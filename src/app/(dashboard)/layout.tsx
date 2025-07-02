'use client';

import NavLinks from '@/components/nav-links';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader } from '@/components/loader';
import { Icons } from '@/components/icons';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader className="h-16 w-16" />
        </div>
      )}
      <header className="sticky top-0 z-10 mb-8 flex h-auto flex-col items-center gap-6 border-b border-white/10 bg-background px-10 py-8 sm:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-x-3">
            <Icons.InternSparkLogo className="h-14 w-14" />
            <h1 className="text-4xl font-bold text-white">InternSpark</h1>
          </div>
          <p
            className={cn(
              'mt-2 bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-lg font-semibold text-transparent'
            )}
          >
            Prep smart. Stand out. Land your dream internship
          </p>
          <p>Ace your internship preparation with Gemini powered IntenSpark</p>
        </div>
        <NavLinks setIsLoading={setIsLoading} />
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <Footer />
    </div>
  );
}
