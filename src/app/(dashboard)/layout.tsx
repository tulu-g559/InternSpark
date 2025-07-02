import NavLinks from '@/components/nav-links';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-auto flex-col items-center gap-6 border-b border-white/10 bg-background px-10 py-20 sm:px-8 mb-30">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            ⚡InternSpark⚡
          </h1>
          <p
            className={cn(
              'mt-2 bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-lg font-semibold text-transparent'
            )}
          >
          Prep smart. Stand out. Land your dream internship
          </p>
          <p> Ace your internship preparation with Gemini powered IntenSpark
          </p>
        </div>
        <NavLinks />
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <Footer />
    </div>
  );
}
