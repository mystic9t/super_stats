'use client';

import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  onOpenMenu?: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-border bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-primary/10 rounded-lg p-2 border border-border">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">
              Vibes
            </h1>
            <p className="text-xs text-muted-foreground">Your cosmic guide</p>
          </div>
        </div>

        {/* Right Section */}
        <ThemeToggle />
      </div>
    </header>
  );
}
