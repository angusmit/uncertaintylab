/**
 * Animation Controller Hook
 * Manages play/pause state, frame index, and speed for animated visualizations
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface AnimationControllerOptions {
  totalFrames: number;
  initialSpeed?: number; // ms per frame
  loop?: boolean;
  autoPlay?: boolean;
  onFrameChange?: (index: number) => void;
}

export interface AnimationController {
  // State
  isPlaying: boolean;
  currentIndex: number;
  speed: number;
  totalFrames: number;
  progress: number; // 0-1
  
  // Actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
}

export function useAnimationController(options: AnimationControllerOptions): AnimationController {
  const {
    totalFrames,
    initialSpeed = 200,
    loop = true,
    autoPlay = false,
    onFrameChange,
  } = options;

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(initialSpeed);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onFrameChangeRef = useRef(onFrameChange);
  
  // Keep callback ref updated
  useEffect(() => {
    onFrameChangeRef.current = onFrameChange;
  }, [onFrameChange]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && totalFrames > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= totalFrames) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return next;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, totalFrames, loop]);

  // Call onFrameChange when index changes
  useEffect(() => {
    onFrameChangeRef.current?.(currentIndex);
  }, [currentIndex]);

  // Reset index if totalFrames changes
  useEffect(() => {
    if (currentIndex >= totalFrames) {
      setCurrentIndex(Math.max(0, totalFrames - 1));
    }
  }, [totalFrames, currentIndex]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((prev) => !prev), []);
  
  const setIndexSafe = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(totalFrames - 1, index)));
  }, [totalFrames]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next >= totalFrames ? (loop ? 0 : prev) : next;
    });
  }, [totalFrames, loop]);

  const stepBackward = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? (loop ? totalFrames - 1 : 0) : next;
    });
  }, [totalFrames, loop]);

  return {
    isPlaying,
    currentIndex,
    speed,
    totalFrames,
    progress: totalFrames > 1 ? currentIndex / (totalFrames - 1) : 0,
    play,
    pause,
    toggle,
    setIndex: setIndexSafe,
    setSpeed,
    reset,
    stepForward,
    stepBackward,
  };
}

export default useAnimationController;