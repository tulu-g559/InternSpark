'use client';

import NavLinks from '@/components/nav-links';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader } from '@/components/loader';
import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: isAuthLoading, logout } = useAuth();

  useEffect(() => {
    // If auth is not loading and there's no user, redirect to login page.
    if (!isAuthLoading && !user) {
      router.push('/auth');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    setIsPageLoading(false);
  }, [pathname]);

  // While checking auth, show a full-screen loader.
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-16 w-16" />
      </div>
    );
  }

  // If there's a user, render the dashboard. Otherwise, render nothing while redirecting.
  return user ? (
    <div className="flex min-h-screen w-full flex-col">
      {isPageLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader className="h-16 w-16" />
        </div>
      )}
      <header className="sticky top-0 z-10 mb-8 flex h-auto flex-col items-center gap-6 border-b border-white/10 bg-background px-4 py-8 sm:px-8">
        <div className="container mx-auto flex w-full items-center justify-between gap-4">
          <div className="flex-1" />
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-x-3">
              <Icons.InternSparkLogo className="h-14 w-14" />
              <h1 className="text-4xl font-bold text-white">InternSpark⚡</h1>
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
          <div className="flex flex-1 justify-end">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="font-medium text-white">{user.displayName ?? user.email}</span>
              </div>
              <Button variant="ghost" onClick={logout} className="shrink-0 text-muted-foreground hover:bg-card hover:text-primary">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
              </Button>
            </div>
          </div>
        </div>
        <NavLinks setIsLoading={setIsPageLoading} />
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <Footer />
    </div>
  ) : null;
}
