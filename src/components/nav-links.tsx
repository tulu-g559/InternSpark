'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  MessagesSquare,
  Gauge,
  Mail,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/loader';

const navItems = [
  {
    href: '/resume-review',
    icon: FileText,
    label: 'Resume Review',
  },
  {
    href: '/mock-interview',
    icon: MessagesSquare,
    label: 'Mock Interview',
  },
  {
    href: '/readiness-tracker',
    icon: Gauge,
    label: 'Readiness Tracker',
  },
  {
    href: '/cover-letter',
    icon: Mail,
    label: 'Cover Letter',
  },
  {
    href: '/job-description-simplifier',
    icon: ClipboardList,
    label: 'JD Simplifier',
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // When the path changes, the new page has loaded, so we can stop showing the loader.
    if (loadingHref) {
      setLoadingHref(null);
    }
  }, [pathname, loadingHref]);

  const handleLinkClick = (href: string) => {
    // Start loading only if we are navigating to a different page.
    if (pathname !== href) {
      setLoadingHref(href);
    }
  };

  if (!mounted) {
    // Render a placeholder on the server to avoid hydration mismatch
    return (
      <nav className="flex items-center justify-center space-x-2 md:space-x-4">
        {navItems.map((item) => (
          <div key={item.href} className="h-10 w-24 animate-pulse rounded-md bg-slate-800" />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center space-x-2 overflow-x-auto p-1 md:space-x-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isLoading = loadingHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => handleLinkClick(item.href)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-primary',
              isActive && 'text-primary',
              isLoading && 'pointer-events-none opacity-75'
            )}
            aria-disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <Loader className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
            <span className={cn('relative', isActive && 'after:absolute after:-bottom-2.5 after:left-0 after:h-0.5 after:w-full after:bg-cyan-400')}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
