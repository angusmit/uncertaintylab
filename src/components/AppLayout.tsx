/**
 * AppLayout - Global layout with header for all pages
 * 
 * Provides consistent navigation header across all pages
 * Logo always links to home
 */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Footer from './Footer';

const navItems = [
  { label: 'Explore', href: '/explore' },
  { label: 'Data', href: '/app/data' },
  { label: 'Vol Surface', href: '/app/surface' },
  { label: 'Pricer', href: '/app/pricer' },
  { label: 'Methods', href: '/methods' },
  { label: 'Publications', href: '/publications' },
  { label: 'About', href: '/about' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  transparentHeader?: boolean;
}

export default function AppLayout({ 
  children, 
  showFooter = true,
  transparentHeader = false 
}: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3',
          !transparentHeader && 'bg-background/80 backdrop-blur-xl border-b border-border/50'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            'flex items-center justify-between',
            transparentHeader && 'glass-card px-4 md:px-6 py-3 rounded-xl'
          )}>
            {/* Logo - Always links to home */}
            <Link 
              to="/" 
              className="flex items-center gap-2 md:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-1 -m-1"
              aria-label="Uncertainty Lab - Go to homepage"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors pulse-glow">
                <FlaskConical className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <span className="text-lg md:text-xl font-semibold tracking-tight">
                <span className="gradient-text">Uncertainty</span>
                <span className="text-foreground"> Lab</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors relative',
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button 
                variant="glow" 
                size="sm" 
                asChild 
                className="hidden md:inline-flex"
              >
                <Link to="/app/data">Enter Lab</Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 glass-card p-4 rounded-xl space-y-1"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'block px-4 py-2.5 rounded-lg transition-colors',
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-border">
                <Button variant="glow" className="w-full" asChild>
                  <Link to="/app/data" onClick={() => setIsOpen(false)}>
                    Enter Lab
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}