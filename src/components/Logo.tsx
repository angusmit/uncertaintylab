/**
 * Logo Component - Uncertainty Lab branding
 * 
 * Shared logo component used across all layouts for visual consistency.
 * Always links to the homepage.
 */

import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Show text next to icon */
  showText?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-lg',
  },
  md: {
    container: 'w-10 h-10',
    icon: 'w-5 h-5',
    text: 'text-xl',
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-2xl',
  },
};

export default function Logo({ showText = true, size = 'md', className }: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-3 group',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'rounded-lg p-1 -m-1',
        className
      )}
      aria-label="Uncertainty Lab - Go to homepage"
    >
      <div
        className={cn(
          sizes.container,
          'rounded-xl bg-primary/20 flex items-center justify-center',
          'group-hover:bg-primary/30 transition-colors',
          'pulse-glow'
        )}
      >
        <FlaskConical className={cn(sizes.icon, 'text-primary')} />
      </div>
      {showText && (
        <span className={cn(sizes.text, 'font-semibold tracking-tight')}>
          <span className="gradient-text">Uncertainty</span>
          <span className="text-foreground"> Lab</span>
        </span>
      )}
    </Link>
  );
}