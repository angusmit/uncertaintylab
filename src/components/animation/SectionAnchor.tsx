/**
 * Section Anchor Component
 * Wrapper for scrollable sections with ID anchors
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionAnchorProps {
  id: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
}

export const SectionAnchor = forwardRef<HTMLElement, SectionAnchorProps>(
  ({ id, title, description, children, className, showHeader = true }, ref) => {
    return (
      <motion.section
        ref={ref}
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className={cn('scroll-mt-20', className)}
      >
        {showHeader && title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </motion.section>
    );
  }
);

SectionAnchor.displayName = 'SectionAnchor';

export default SectionAnchor;