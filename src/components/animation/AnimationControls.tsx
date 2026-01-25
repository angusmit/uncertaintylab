/**
 * Animation Controls Component
 * Play/Pause, Speed, Slider, Frame Label
 */

import { Play, Pause, SkipBack, SkipForward, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AnimationController } from '@/hooks/useAnimationController';

interface AnimationControlsProps {
  controller: AnimationController;
  frameLabel?: (index: number) => string;
  className?: string;
  showSpeedControl?: boolean;
  showStepButtons?: boolean;
  showResetButton?: boolean;
  compact?: boolean;
}

const SPEED_OPTIONS = [
  { value: 50, label: '20 fps' },
  { value: 100, label: '10 fps' },
  { value: 200, label: '5 fps' },
  { value: 500, label: '2 fps' },
  { value: 1000, label: '1 fps' },
];

export function AnimationControls({
  controller,
  frameLabel,
  className,
  showSpeedControl = true,
  showStepButtons = true,
  showResetButton = false,
  compact = false,
}: AnimationControlsProps) {
  const {
    isPlaying,
    currentIndex,
    speed,
    totalFrames,
    toggle,
    setIndex,
    setSpeed,
    reset,
    stepForward,
    stepBackward,
  } = controller;

  const label = frameLabel
    ? frameLabel(currentIndex)
    : `Frame ${currentIndex + 1} / ${totalFrames}`;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={toggle}
          className="w-8 h-8 p-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Slider
          value={[currentIndex]}
          onValueChange={([v]) => setIndex(v)}
          min={0}
          max={Math.max(0, totalFrames - 1)}
          step={1}
          className="flex-1 min-w-[100px]"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[80px] text-right">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-3 rounded-lg bg-muted/30 border border-border/50',
        className
      )}
    >
      {/* Controls Row */}
      <div className="flex items-center gap-2">
        {showStepButtons && (
          <Button
            variant="ghost"
            size="sm"
            onClick={stepBackward}
            className="w-8 h-8 p-0"
            disabled={totalFrames <= 1}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={toggle}
          className="w-10 h-8 p-0"
          disabled={totalFrames <= 1}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        {showStepButtons && (
          <Button
            variant="ghost"
            size="sm"
            onClick={stepForward}
            className="w-8 h-8 p-0"
            disabled={totalFrames <= 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        )}

        {showResetButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="w-8 h-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}

        {showSpeedControl && (
          <Select
            value={speed.toString()}
            onValueChange={(v) => setSpeed(parseInt(v))}
          >
            <SelectTrigger className="w-[90px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPEED_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <span className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
          {label}
        </span>
      </div>

      {/* Slider Row */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-6">0</span>
        <Slider
          value={[currentIndex]}
          onValueChange={([v]) => setIndex(v)}
          min={0}
          max={Math.max(0, totalFrames - 1)}
          step={1}
          className="flex-1"
          disabled={totalFrames <= 1}
        />
        <span className="text-xs text-muted-foreground w-6 text-right">
          {totalFrames - 1}
        </span>
      </div>
    </div>
  );
}

export default AnimationControls;