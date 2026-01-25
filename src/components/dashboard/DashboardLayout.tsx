/**
 * Dashboard Layout - Sidebar navigation with status indicators
 * Uncertainty Lab - Computational Laboratory for Mathematical Finance
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Database,
  LineChart,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Activity,
  Sparkles,
  BookOpen,
  FileText,
  Info,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDiagnostics } from '@/lib/api/hooks';

const navItems = [
  { label: 'Explore', href: '/explore', icon: Sparkles },
  { label: 'Data Import', href: '/app/data', icon: Database },
  { label: 'Vol Surface', href: '/app/surface', icon: LineChart },
  { label: 'Pricer', href: '/app/pricer', icon: Calculator },
  { type: 'divider' },
  { label: 'Methods', href: '/methods', icon: FileText },
  { label: 'Publications', href: '/publications', icon: BookOpen },
  { label: 'About', href: '/about', icon: Info },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { data: diagnostics } = useDiagnostics();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-semibold"
                >
                  <span className="gradient-text">Uncertainty</span>
                  <span> Lab</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return (
                <div key={`divider-${index}`} className="my-3 border-t border-sidebar-border" />
              );
            }
            
            const navItem = item as { label: string; href: string; icon: any };
            const isActive = location.pathname === navItem.href;
            const Icon = navItem.icon;
            return (
              <Link
                key={navItem.href}
                to={navItem.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent group',
                  isActive && 'bg-primary/20 text-primary'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'text-sm font-medium whitespace-nowrap',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {navItem.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Status Panel */}
        <div className="px-2 py-4 border-t border-sidebar-border">
          <AnimatePresence mode="wait">
            {!collapsed && diagnostics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="px-3 py-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </span>
                </div>
                <StatusIndicator
                  label="Chain"
                  active={diagnostics.chain_loaded}
                  value={diagnostics.chain_loaded ? `${diagnostics.n_quotes}` : '—'}
                />
                <StatusIndicator
                  label="IV"
                  active={diagnostics.iv_computed}
                  value={diagnostics.iv_computed ? `${diagnostics.n_valid_iv}` : '—'}
                />
                <StatusIndicator
                  label="Surface"
                  active={diagnostics.surface_fitted}
                  value={diagnostics.surface_fitted ? '✓' : '—'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed indicators */}
          {collapsed && diagnostics && (
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  diagnostics.chain_loaded ? 'bg-green-500' : 'bg-yellow-500'
                )}
              />
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  diagnostics.iv_computed ? 'bg-green-500' : 'bg-muted'
                )}
              />
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  diagnostics.surface_fitted ? 'bg-green-500' : 'bg-muted'
                )}
              />
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'ml-[72px]' : 'ml-64'
        )}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Computational Laboratory for Mathematical Finance
            </span>
          </div>
          {diagnostics && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Chain:{' '}
                <span className={diagnostics.chain_loaded ? 'text-green-500' : ''}>
                  {diagnostics.chain_loaded ? diagnostics.n_quotes : '—'}
                </span>
              </span>
              <span className="text-muted-foreground">
                IV:{' '}
                <span className={diagnostics.iv_computed ? 'text-green-500' : ''}>
                  {diagnostics.iv_computed ? diagnostics.n_valid_iv : '—'}
                </span>
              </span>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function StatusIndicator({
  label,
  active,
  value,
}: {
  label: string;
  active: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sidebar-accent/50">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          active ? 'bg-green-500' : 'bg-muted-foreground'
        )}
      />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <span className={cn('text-xs', active ? 'text-foreground' : 'text-muted-foreground')}>
        {value}
      </span>
    </div>
  );
}