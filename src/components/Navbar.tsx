import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const navItems = [
  { label: 'Explore', href: '/explore' },
  { label: 'Data', href: '/app/data' },
  { label: 'Vol Surface', href: '/app/surface' },
  { label: 'Pricer', href: '/app/pricer' },
  { label: 'Methods', href: '/methods' },
  { label: 'Publications', href: '/publications' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo - Always links to homepage */}
          <Logo size="md" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA - Enter Lab */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="glow" size="sm" asChild>
              <Link to="/app/data">Enter Lab</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-card p-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Button variant="glow" className="w-full" asChild>
                <Link to="/app/data" onClick={() => setIsOpen(false)}>
                  Enter Lab
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}