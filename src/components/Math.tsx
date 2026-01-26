/**
 * Math Component - LaTeX rendering with KaTeX
 * 
 * Renders mathematical notation using KaTeX for professional typesetting
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  /** LaTeX expression to render */
  children: string;
  /** Display mode (block) vs inline mode */
  display?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function Math({ children, display = false, className = '' }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX error:', error);
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }
  }, [children, display]);

  return (
    <span 
      ref={ref} 
      className={`${display ? 'block my-4 overflow-x-auto' : 'inline'} ${className}`}
    />
  );
}

interface MathBlockProps {
  /** LaTeX expression to render */
  children: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Block-level math display (centered, larger)
 */
export function MathBlock({ children, className = '' }: MathBlockProps) {
  return (
    <div className={`my-6 py-4 px-6 rounded-lg bg-muted/30 overflow-x-auto ${className}`}>
      <Math display>{children}</Math>
    </div>
  );
}

/**
 * Inline math (within text)
 */
export function MathInline({ children, className = '' }: MathBlockProps) {
  return <Math className={className}>{children}</Math>;
}

export default Math;