/**
 * Section Navigator Component
 * Sticky navigation panel with scroll-to buttons
 */

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SectionConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SectionNavigatorProps {
  sections: SectionConfig[];
  className?: string;
  position?: 'right' | 'top';
  offset?: number; // pixels from top when scrolling
}

export function SectionNavigator({
  sections,
  className,
  position = 'right',
  offset = 80,
}: SectionNavigatorProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, offset]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [offset]);

  if (position === 'top') {
    return (
      <div
        className={cn(
          'sticky top-16 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-2',
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeSection === section.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Right sidebar position
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 p-2 rounded-xl glass-card',
        className
      )}
    >
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'group relative flex items-center gap-2 p-2 rounded-lg transition-all',
            activeSection === section.id
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {/* Dot indicator */}
          <div
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              activeSection === section.id ? 'bg-primary' : 'bg-muted-foreground/50'
            )}
          />
          
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 px-2 py-1 rounded bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            {section.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export default SectionNavigator;