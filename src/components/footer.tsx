import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          Built by{' '}
          <Link href="https://github.com/tulu-g559" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
            Arnab Ghosh
          </Link>
        </p>
        <div className="flex items-center gap-6">
          <Link href="mailto: garnab559@gmail.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
          <Link href="https://github.com/tulu-g559" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/tulug559" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
