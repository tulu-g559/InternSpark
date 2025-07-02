import NavLinks from '@/components/nav-links';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-auto flex-col items-center gap-4 border-b border-white/10 bg-background px-4 py-6 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            InternSpark
          </h1>
          <p
            className={cn(
              'mt-2 bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-lg font-semibold text-transparent'
            )}
          >
            Your AI-Powered Internship Assistant
          </p>
        </div>
        <NavLinks />
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
