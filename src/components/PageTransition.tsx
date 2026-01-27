/**
 * PageTransition - Hexagonal GRID mask transition for paper pages
 * 
 * Creates a mosaic reveal/hide effect using hundreds of hexagon tiles
 * that animate in a wave pattern across the screen.
 * 
 * This is the "hex grid tile mask" transition matching Uncertainty Lab branding.
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

const HEX_SIZE = 32;
const WAVE_SPREAD = 0.35;
const STAGGER_NOISE = 0.06;
const DURATION = 850;

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
  if (size < 0.5) return;
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

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function generateHexGrid(width: number, height: number) {
  const hexes: Array<{ x: number; y: number; delay: number }> = [];
  const hexWidth = HEX_SIZE * 2;
  const hexHeight = Math.sqrt(3) * HEX_SIZE;
  const horizDist = hexWidth * 0.75 + 2;
  const vertDist = hexHeight + 2;
  
  const cols = Math.ceil(width / horizDist) + 4;
  const rows = Math.ceil(height / vertDist) + 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = -HEX_SIZE * 2 + col * horizDist;
      const y = -HEX_SIZE * 2 + row * vertDist + (col % 2 === 1 ? vertDist / 2 : 0);
      hexes.push({ x, y, delay: 0 });
    }
  }
  return hexes;
}

function calculateDelays(
  hexes: Array<{ x: number; y: number; delay: number }>,
  width: number,
  height: number,
  originX: number,
  originY: number
) {
  const maxDist = Math.sqrt(width * width + height * height);
  for (const hex of hexes) {
    const dx = hex.x - originX;
    const dy = hex.y - originY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const normalizedDist = dist / maxDist;
    const randomOffset = (Math.random() - 0.5) * STAGGER_NOISE;
    hex.delay = Math.max(0, Math.min(1, normalizedDist * WAVE_SPREAD + randomOffset));
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
  originX?: number;
  originY?: number;
  darkColor: string;
}

function HexGridCanvas({
  isActive,
  direction,
  onComplete,
  onPartialReveal,
  originX = 0.5,
  originY = 0.5,
  darkColor,
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
    
    hexesRef.current = generateHexGrid(width, height);
    calculateDelays(hexesRef.current, width, height, originX * width, originY * height);
    
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
      
      ctx.clearRect(0, 0, width, height);
      
      for (const hex of hexesRef.current) {
        const hexProgress = Math.max(0, Math.min(1, (progress - hex.delay) / (1 - WAVE_SPREAD)));
        const easedProgress = easeInOutCubic(hexProgress);
        
        if (direction === 'reveal') {
          if (easedProgress < 1) {
            const scale = 1 - easedProgress;
            drawHexagon(ctx, hex.x, hex.y, HEX_SIZE * scale, darkColor);
          }
        } else {
          if (easedProgress > 0) {
            const scale = easedProgress;
            drawHexagon(ctx, hex.x, hex.y, HEX_SIZE * scale, darkColor);
          }
        }
      }
      
      if (!partialFired.current && progress >= 0.55 && direction === 'reveal') {
        partialFired.current = true;
        onPartialReveal?.();
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    // Draw initial frame
    ctx.clearRect(0, 0, width, height);
    if (direction === 'reveal') {
      // Start with full coverage
      for (const hex of hexesRef.current) {
        drawHexagon(ctx, hex.x, hex.y, HEX_SIZE, darkColor);
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, direction, originX, originY, darkColor, onComplete, onPartialReveal, prefersReducedMotion]);

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
  const [exitOrigin, setExitOrigin] = useState({ x: 0.5, y: 0.5 });
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
  const handleExit = useCallback((targetPath: string, clickX?: number, clickY?: number) => {
    if (phase === 'exiting') return;
    
    (window as any).__exitTarget = targetPath;
    
    if (clickX !== undefined && clickY !== undefined) {
      setExitOrigin({
        x: clickX / window.innerWidth,
        y: clickY / window.innerHeight,
      });
    }
    
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
      {/* Base dark background */}
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
          originX={0.5}
          originY={0.3}
          darkColor={baseBg}
        />
      )}
      
      {phase === 'exiting' && (
        <HexGridCanvas
          isActive={showCanvas}
          direction="hide"
          onComplete={handleExitComplete}
          originX={exitOrigin.x}
          originY={exitOrigin.y}
          darkColor={baseBg}
        />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.4,
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
 * Custom back link that triggers exit animation with click position
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
      exitFn(to, e.clientX, e.clientY);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default PageTransition;