/**
 * PageTransition - Hexagonal GRID mask transition for paper pages
 * 
 * Creates a seamless mosaic reveal/hide effect using overlapping hexagon tiles
 * that animate in a wave pattern across the screen.
 * 
 * - Entrance (reveal): Dark hexes shrink LEFT-TO-RIGHT, revealing white paper
 * - Exit (hide): Dark hexes grow RIGHT-TO-LEFT, covering the paper
 * 
 * No gaps - hexes overlap to ensure complete coverage.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Background color of the revealed content */
  revealBg?: string;
  /** Background color being transitioned from/to */
  baseBg?: string;
}

// =============================================================================
// Hex Grid Configuration
// =============================================================================

const HEX_SIZE = 40; // Base hex radius
const HEX_DRAW_SIZE = 48; // Larger draw size for overlap (eliminates gaps)
const WAVE_SPREAD = 0.5; // How spread out the wave is (0-1)
const STAGGER_NOISE = 0.03; // Small random variation for organic feel
const DURATION = 950; // Animation duration in ms

// =============================================================================
// Hex Math Utilities
// =============================================================================

function hexCorner(cx: number, cy: number, size: number, i: number): [number, number] {
  const angleDeg = 60 * i - 30;
  const angleRad = (Math.PI / 180) * angleDeg;
  return [cx + size * Math.cos(angleRad), cy + size * Math.sin(angleRad)];
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fillStyle: string
) {
  if (size < 1) return;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const [x, y] = hexCorner(cx, cy, size, i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function easeInQuart(t: number): number {
  return t * t * t * t;
}

function generateHexGrid(width: number, height: number) {
  const hexes: Array<{ x: number; y: number; delay: number }> = [];
  const hexWidth = HEX_SIZE * 2;
  const hexHeight = Math.sqrt(3) * HEX_SIZE;
  // Tight spacing for overlap
  const horizDist = hexWidth * 0.72;
  const vertDist = hexHeight * 0.88;
  
  // Extra columns/rows to cover edges
  const cols = Math.ceil(width / horizDist) + 8;
  const rows = Math.ceil(height / vertDist) + 8;
  
  const startX = -HEX_SIZE * 4;
  const startY = -HEX_SIZE * 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * horizDist;
      const y = startY + row * vertDist + (col % 2 === 1 ? vertDist / 2 : 0);
      hexes.push({ x, y, delay: 0 });
    }
  }
  return hexes;
}

// Calculate delays for horizontal wave
function calculateDelays(
  hexes: Array<{ x: number; y: number; delay: number }>,
  width: number,
  direction: 'ltr' | 'rtl'
) {
  const minX = -HEX_SIZE * 4;
  const maxX = width + HEX_SIZE * 4;
  const range = maxX - minX;
  
  for (const hex of hexes) {
    const normalizedX = (hex.x - minX) / range;
    // Small vertical wave for organic feel
    const verticalWave = Math.sin(hex.y * 0.015) * 0.02;
    const randomOffset = (Math.random() - 0.5) * STAGGER_NOISE;
    
    // LTR: left hexes animate first; RTL: right hexes animate first
    const baseDelay = direction === 'ltr' ? normalizedX : (1 - normalizedX);
    
    hex.delay = Math.max(0, Math.min(0.95, baseDelay * WAVE_SPREAD + verticalWave + randomOffset));
  }
}

// =============================================================================
// Hex Grid Canvas Component
// =============================================================================

interface HexGridCanvasProps {
  isActive: boolean;
  direction: 'reveal' | 'hide';
  onComplete?: () => void;
  onPartialReveal?: () => void;
  darkColor: string;
  lightColor: string;
}

function HexGridCanvas({
  isActive,
  direction,
  onComplete,
  onPartialReveal,
  darkColor,
  lightColor,
}: HexGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const hexesRef = useRef<Array<{ x: number; y: number; delay: number }>>([]);
  const partialFired = useRef(false);
  const startTime = useRef<number | null>(null);
  
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    
    // Generate hex grid
    hexesRef.current = generateHexGrid(width, height);
    
    // Wave direction: LTR for reveal (entrance), RTL for hide (exit)
    const waveDirection = direction === 'reveal' ? 'ltr' : 'rtl';
    calculateDelays(hexesRef.current, width, waveDirection);
    
    startTime.current = null;
    partialFired.current = false;

    if (prefersReducedMotion) {
      setTimeout(() => {
        onPartialReveal?.();
        onComplete?.();
      }, 50);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(1, elapsed / DURATION);
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      if (direction === 'reveal') {
        // REVEAL: Start dark, hexes shrink left-to-right to show white
        // First fill with white (the revealed content)
        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw dark hexes that shrink (revealing white underneath)
        for (const hex of hexesRef.current) {
          const hexProgress = Math.max(0, Math.min(1, (progress - hex.delay) / (1 - WAVE_SPREAD)));
          const easedProgress = easeOutQuart(hexProgress);
          
          // Hex shrinks from full size to 0
          const scale = 1 - easedProgress;
          if (scale > 0.01) {
            drawHexagon(ctx, hex.x, hex.y, HEX_DRAW_SIZE * scale, darkColor);
          }
        }
      } else {
        // HIDE: Start white, dark hexes grow right-to-left to cover
        // First fill with white (the current content)
        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw dark hexes that grow (covering white)
        for (const hex of hexesRef.current) {
          const hexProgress = Math.max(0, Math.min(1, (progress - hex.delay) / (1 - WAVE_SPREAD)));
          const easedProgress = easeInQuart(hexProgress);
          
          // Hex grows from 0 to full size
          const scale = easedProgress;
          if (scale > 0.01) {
            drawHexagon(ctx, hex.x, hex.y, HEX_DRAW_SIZE * scale, darkColor);
          }
        }
      }
      
      // Fire partial reveal callback at ~50% for content animation
      if (!partialFired.current && progress >= 0.45 && direction === 'reveal') {
        partialFired.current = true;
        onPartialReveal?.();
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    // Draw initial frame immediately
    ctx.clearRect(0, 0, width, height);
    
    if (direction === 'reveal') {
      // Initial state: fully dark (all hexes at full size covering white)
      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, width, height);
      for (const hex of hexesRef.current) {
        drawHexagon(ctx, hex.x, hex.y, HEX_DRAW_SIZE, darkColor);
      }
    } else {
      // Initial state: fully white (no dark hexes yet)
      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Small delay before starting animation for smoother perception
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 16);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, direction, darkColor, lightColor, onComplete, onPartialReveal, prefersReducedMotion]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

// =============================================================================
// Page Transition Component
// =============================================================================

export function PageTransition({ 
  children, 
  revealBg = '#ffffff',
  baseBg = '#0B0E14'
}: PageTransitionProps) {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [showContent, setShowContent] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle entrance
  useEffect(() => {
    setPhase('entering');
    setShowCanvas(true);
    setShowContent(false);
  }, [location.pathname]);

  const handlePartialReveal = useCallback(() => {
    setShowContent(true);
  }, []);

  const handleEnterComplete = useCallback(() => {
    setPhase('visible');
    setShowCanvas(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    const target = (window as any).__exitTarget;
    if (target) {
      navigate(target);
      delete (window as any).__exitTarget;
    }
  }, [navigate]);

  // Intercept navigation for exit animation
  const handleExit = useCallback((targetPath: string) => {
    if (phase === 'exiting') return;
    
    (window as any).__exitTarget = targetPath;
    setPhase('exiting');
    setShowCanvas(true);
    setShowContent(false);
  }, [phase]);

  // Expose exit handler globally
  useEffect(() => {
    (window as any).__paperPageExit = handleExit;
    return () => {
      delete (window as any).__paperPageExit;
    };
  }, [handleExit]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Base dark background (for when canvas is not showing) */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: baseBg,
          zIndex: 0,
        }}
      />

      {/* Paper (light) background */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: revealBg,
          zIndex: 1,
        }}
      />

      {/* Hex Grid Canvas Transition */}
      {phase === 'entering' && (
        <HexGridCanvas
          isActive={showCanvas}
          direction="reveal"
          onPartialReveal={handlePartialReveal}
          onComplete={handleEnterComplete}
          darkColor={baseBg}
          lightColor={revealBg}
        />
      )}
      
      {phase === 'exiting' && (
        <HexGridCanvas
          isActive={showCanvas}
          direction="hide"
          onComplete={handleExitComplete}
          darkColor={baseBg}
          lightColor={revealBg}
        />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.35,
              ease: 'easeOut',
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              minHeight: '100vh',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Custom back link that triggers exit animation
 */
export function TransitionBackLink({ 
  to, 
  children, 
  className 
}: { 
  to: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const exitFn = (window as any).__paperPageExit;
    if (exitFn) {
      exitFn(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default PageTransition;