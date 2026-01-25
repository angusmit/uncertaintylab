/**
 * Vol Surface Page - Complete with Animations and Section Navigation
 * 
 * Sections:
 * 1. Smiles (static)
 * 2. Animated Smile (across expiries)
 * 3. Heatmap (static)
 * 4. Animated Heatmap (with mode toggle)
 * 5. 3D Surface (static)
 * 6. Animated 3D (across params or expiries)
 * 7. Parameter Sensitivity
 * 8. Diagnostics
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import {
  LineChart,
  Grid3X3,
  Box,
  Loader2,
  Play,
  Settings2,
  Activity,
  Layers,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDiagnostics,
  useFitSurface,
  useFetchSurfaceGrid,
  useChain,
  SurfaceGridResponse,
} from '@/lib/api/hooks';
import {
  AnimationControls,
  SectionNavigator,
  SectionAnchor,
  useAnimationController,
  type SectionConfig,
} from '@/components/animation';
import { cn } from '@/lib/utils';

// Plotly dark theme
const plotlyDarkTheme = {
  paper_bgcolor: 'rgba(16, 20, 30, 0.6)',
  plot_bgcolor: 'rgba(16, 20, 30, 0.4)',
  font: { family: 'Space Grotesk, sans-serif', color: '#f0f4f8', size: 12 },
  xaxis: {
    gridcolor: 'rgba(255, 255, 255, 0.06)',
    linecolor: 'rgba(255, 255, 255, 0.1)',
    tickfont: { color: '#8b9cb3' },
  },
  yaxis: {
    gridcolor: 'rgba(255, 255, 255, 0.06)',
    linecolor: 'rgba(255, 255, 255, 0.1)',
    tickfont: { color: '#8b9cb3' },
  },
  margin: { l: 60, r: 30, t: 40, b: 60 },
};

const surfaceColorscale: [number, string][] = [
  [0, '#0a0c12'],
  [0.2, '#1a1f30'],
  [0.4, '#00808c'],
  [0.6, '#00e6e6'],
  [0.8, '#8c50ff'],
  [1, '#c084fc'],
];

const smileColors = ['#00e6e6', '#8c50ff', '#22c55e', '#eab308', '#ef4444', '#3b82f6', '#ec4899', '#f97316'];

// Section configuration
const SECTIONS: SectionConfig[] = [
  { id: 'controls', label: 'Controls', icon: <Settings2 className="w-3 h-3" /> },
  { id: 'smiles', label: 'Smiles', icon: <LineChart className="w-3 h-3" /> },
  { id: 'animated-smile', label: 'Animated Smile', icon: <Play className="w-3 h-3" /> },
  { id: 'heatmap', label: 'Heatmap', icon: <Grid3X3 className="w-3 h-3" /> },
  { id: 'animated-heatmap', label: 'Animated Heatmap', icon: <Layers className="w-3 h-3" /> },
  { id: 'surface-3d', label: '3D Surface', icon: <Box className="w-3 h-3" /> },
  { id: 'animated-3d', label: 'Animated 3D', icon: <TrendingUp className="w-3 h-3" /> },
  { id: 'param-sensitivity', label: 'Param Sensitivity', icon: <BarChart3 className="w-3 h-3" /> },
  { id: 'diagnostics', label: 'Diagnostics', icon: <Activity className="w-3 h-3" /> },
];

export default function VolSurfacePage() {
  // Core state
  const [hx, setHx] = useState(0.1);
  const [hy, setHy] = useState(0.1);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [gridData, setGridData] = useState<SurfaceGridResponse | null>(null);
  
  // Debounce state for sliders
  const [debouncedHx, setDebouncedHx] = useState(hx);
  const [debouncedHy, setDebouncedHy] = useState(hy);
  
  // Hooks
  const { data: diagnostics } = useDiagnostics();
  const { data: chainData } = useChain();
  const fitSurface = useFitSurface();
  const fetchGrid = useFetchSurfaceGrid();

  const canFit = diagnostics?.iv_computed && diagnostics.n_valid_iv >= 5;

  // Debounce hx/hy changes
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedHx(hx), 300);
    return () => clearTimeout(timer);
  }, [hx]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedHy(hy), 300);
    return () => clearTimeout(timer);
  }, [hy]);

  // Prepare smile data from chain
  const { smileData, expiries, expiryLabels } = useMemo(() => {
    if (!chainData?.quotes) return { smileData: {}, expiries: [], expiryLabels: [] };
    
    const data: Record<number, { strikes: number[]; ivs: number[] }> = {};
    chainData.quotes
      .filter((q) => q.option_type === optionType && q.iv != null)
      .forEach((q) => {
        if (!data[q.expiry]) data[q.expiry] = { strikes: [], ivs: [] };
        data[q.expiry].strikes.push(q.strike);
        data[q.expiry].ivs.push(q.iv! * 100);
      });
    
    const sortedExpiries = Object.keys(data).map(Number).sort((a, b) => a - b);
    const labels = sortedExpiries.map((e) => `T=${e.toFixed(2)}y`);
    
    return { smileData: data, expiries: sortedExpiries, expiryLabels: labels };
  }, [chainData, optionType]);

  // Fit surface handler
  const handleFitSurface = async () => {
    try {
      const result = await fitSurface.mutateAsync({
        h_x: debouncedHx,
        h_y: debouncedHy,
        option_type: optionType,
      });
      toast.success(`Surface fitted! RMSE: ${(result.rmse * 100).toFixed(2)}%`);

      const grid = await fetchGrid.mutateAsync({ nx: 40, ny: 20, option_type: optionType });
      setGridData(grid);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fit surface');
    }
  };

  return (
    <div className="relative">
      {/* Section Navigator (right sidebar) */}
      <SectionNavigator sections={SECTIONS} position="right" offset={80} />

      <div className="space-y-8 pr-16">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Volatility Surface</h1>
            <p className="text-muted-foreground">
              Fit and visualize implied volatility surface with animations
            </p>
          </div>
          {!canFit && (
            <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
              Load data and compute IVs first
            </div>
          )}
        </div>

        {/* Sticky Controls Section */}
        <SectionAnchor id="controls" title="Surface Parameters" showHeader={false}>
          <StickyControls
            hx={hx}
            hy={hy}
            optionType={optionType}
            debouncedHx={debouncedHx}
            debouncedHy={debouncedHy}
            setHx={setHx}
            setHy={setHy}
            setOptionType={setOptionType}
            onFit={handleFitSurface}
            canFit={canFit}
            isLoading={fitSurface.isPending || fetchGrid.isPending}
            diagnostics={diagnostics}
          />
        </SectionAnchor>

        {/* Static Smiles */}
        <SectionAnchor id="smiles" title="Volatility Smiles" description="IV curves by expiry">
          <Card className="glass-card">
            <CardContent className="pt-6">
              {expiries.length > 0 ? (
                <StaticSmilePlot
                  smileData={smileData}
                  expiries={expiries}
                  expiryLabels={expiryLabels}
                  spot={chainData?.spot || 100}
                />
              ) : (
                <EmptyPlaceholder message="No IV data available" />
              )}
            </CardContent>
          </Card>
        </SectionAnchor>

        {/* Animated Smile */}
        <SectionAnchor id="animated-smile" title="Animated Smile" description="Scrub through expiries">
          <AnimatedSmileSection
            smileData={smileData}
            expiries={expiries}
            expiryLabels={expiryLabels}
            spot={chainData?.spot || 100}
          />
        </SectionAnchor>

        {/* Static Heatmap */}
        <SectionAnchor id="heatmap" title="IV Heatmap" description="2D surface visualization">
          <Card className="glass-card">
            <CardContent className="pt-6">
              {gridData ? (
                <HeatmapPlot data={gridData} />
              ) : (
                <EmptyPlaceholder message="Fit surface to see heatmap" />
              )}
            </CardContent>
          </Card>
        </SectionAnchor>

        {/* Animated Heatmap */}
        <SectionAnchor id="animated-heatmap" title="Animated Heatmap" description="Progressive reveal or slice view">
          <AnimatedHeatmapSection gridData={gridData} expiries={expiries} />
        </SectionAnchor>

        {/* Static 3D Surface */}
        <SectionAnchor id="surface-3d" title="3D Surface" description="Interactive 3D visualization">
          <Card className="glass-card">
            <CardContent className="pt-6">
              {gridData ? (
                <Surface3DPlot data={gridData} />
              ) : (
                <EmptyPlaceholder message="Fit surface to see 3D view" />
              )}
            </CardContent>
          </Card>
        </SectionAnchor>

        {/* Animated 3D */}
        <SectionAnchor id="animated-3d" title="Animated 3D Surface" description="Rotate or parameter sweep">
          <Animated3DSection gridData={gridData} />
        </SectionAnchor>

        {/* Parameter Sensitivity */}
        <SectionAnchor id="param-sensitivity" title="Parameter Sensitivity" description="Animate across bandwidth values">
          <ParamSensitivitySection
            chainData={chainData}
            optionType={optionType}
            baseHx={debouncedHx}
            baseHy={debouncedHy}
          />
        </SectionAnchor>

        {/* Diagnostics */}
        <SectionAnchor id="diagnostics" title="Diagnostics" description="Surface fitting statistics">
          <DiagnosticsSection diagnostics={diagnostics} />
        </SectionAnchor>
      </div>
    </div>
  );
}

// ============= Sub-Components =============

interface StickyControlsProps {
  hx: number;
  hy: number;
  optionType: 'call' | 'put';
  debouncedHx: number;
  debouncedHy: number;
  setHx: (v: number) => void;
  setHy: (v: number) => void;
  setOptionType: (v: 'call' | 'put') => void;
  onFit: () => void;
  canFit: boolean;
  isLoading: boolean;
  diagnostics: any;
}

function StickyControls({
  hx, hy, optionType, debouncedHx, debouncedHy,
  setHx, setHy, setOptionType, onFit, canFit, isLoading, diagnostics,
}: StickyControlsProps) {
  return (
    <Card className="glass-card sticky top-20 z-10">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          {/* Option Type */}
          <div className="space-y-2">
            <Label>Option Type</Label>
            <Select value={optionType} onValueChange={(v) => setOptionType(v as 'call' | 'put')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="put">Put</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bandwidth hx */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>hₓ (strike)</Label>
              <span className="text-sm text-muted-foreground">{hx.toFixed(2)}</span>
            </div>
            <Slider
              value={[hx]}
              onValueChange={([v]) => setHx(v)}
              min={0.02}
              max={0.5}
              step={0.01}
            />
          </div>

          {/* Bandwidth hy */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>hᵧ (time)</Label>
              <span className="text-sm text-muted-foreground">{hy.toFixed(2)}</span>
            </div>
            <Slider
              value={[hy]}
              onValueChange={([v]) => setHy(v)}
              min={0.02}
              max={0.5}
              step={0.01}
            />
          </div>

          {/* Fit Button */}
          <Button onClick={onFit} disabled={!canFit || isLoading} className="w-full">
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fitting...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" />Fit Surface</>
            )}
          </Button>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={cn('w-2 h-2 rounded-full', diagnostics?.surface_fitted ? 'bg-green-500' : 'bg-muted')} />
            <span className="text-muted-foreground">
              {diagnostics?.surface_fitted ? `${diagnostics.n_valid_iv} pts` : 'Not fitted'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Static Smile Plot
function StaticSmilePlot({
  smileData,
  expiries,
  expiryLabels,
  spot,
}: {
  smileData: Record<number, { strikes: number[]; ivs: number[] }>;
  expiries: number[];
  expiryLabels: string[];
  spot: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || expiries.length === 0) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const traces = expiries.map((exp, i) => ({
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: expiryLabels[i],
        x: smileData[exp].strikes,
        y: smileData[exp].ivs,
        line: { color: smileColors[i % smileColors.length], width: 2 },
        marker: { size: 6, color: smileColors[i % smileColors.length] },
      }));

      Plotly.default.newPlot(containerRef.current!, traces, {
        ...plotlyDarkTheme,
        xaxis: { ...plotlyDarkTheme.xaxis, title: 'Strike' },
        yaxis: { ...plotlyDarkTheme.yaxis, title: 'IV (%)' },
        legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, xanchor: 'center', x: 0.5, bgcolor: 'rgba(16,20,30,0.8)', font: { color: '#f0f4f8' } },
        shapes: [{ type: 'line', x0: spot, x1: spot, y0: 0, y1: 1, yref: 'paper', line: { color: 'rgba(255,255,255,0.5)', dash: 'dash', width: 1 } }],
      }, { responsive: true, displayModeBar: false });
    });

    return () => {
      if (containerRef.current) {
        import('plotly.js-dist-min').then((Plotly) => Plotly.default.purge(containerRef.current!));
      }
    };
  }, [smileData, expiries, expiryLabels, spot]);

  return <div ref={containerRef} className="w-full h-[350px]" />;
}

// Animated Smile Section
function AnimatedSmileSection({
  smileData,
  expiries,
  expiryLabels,
  spot,
}: {
  smileData: Record<number, { strikes: number[]; ivs: number[] }>;
  expiries: number[];
  expiryLabels: string[];
  spot: number;
}) {
  const controller = useAnimationController({
    totalFrames: expiries.length,
    initialSpeed: 500,
    loop: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const plotlyRef = useRef<any>(null);

  // Initialize plot
  useEffect(() => {
    if (!containerRef.current || expiries.length === 0) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const exp = expiries[0];
      const trace = {
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        x: smileData[exp]?.strikes || [],
        y: smileData[exp]?.ivs || [],
        line: { color: '#00e6e6', width: 3 },
        marker: { size: 8, color: '#00e6e6' },
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 230, 230, 0.1)',
      };

      Plotly.default.newPlot(containerRef.current!, [trace], {
        ...plotlyDarkTheme,
        xaxis: { ...plotlyDarkTheme.xaxis, title: 'Strike' },
        yaxis: { ...plotlyDarkTheme.yaxis, title: 'IV (%)', range: [0, Math.max(...Object.values(smileData).flatMap(d => d.ivs)) * 1.1] },
        shapes: [{ type: 'line', x0: spot, x1: spot, y0: 0, y1: 1, yref: 'paper', line: { color: 'rgba(255,255,255,0.5)', dash: 'dash', width: 1 } }],
      }, { responsive: true, displayModeBar: false });

      plotlyRef.current = containerRef.current;
    });

    return () => {
      if (plotlyRef.current) {
        import('plotly.js-dist-min').then((Plotly) => Plotly.default.purge(plotlyRef.current));
      }
    };
  }, [expiries.length > 0]);

  // Update plot on frame change
  useEffect(() => {
    if (!plotlyRef.current || expiries.length === 0) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const exp = expiries[controller.currentIndex];
      if (!smileData[exp]) return;

      Plotly.default.react(plotlyRef.current, [{
        type: 'scatter',
        mode: 'lines+markers',
        x: smileData[exp].strikes,
        y: smileData[exp].ivs,
        line: { color: smileColors[controller.currentIndex % smileColors.length], width: 3 },
        marker: { size: 8, color: smileColors[controller.currentIndex % smileColors.length] },
        fill: 'tozeroy',
        fillcolor: `${smileColors[controller.currentIndex % smileColors.length]}20`,
      }], {
        ...plotlyDarkTheme,
        title: { text: expiryLabels[controller.currentIndex], font: { color: '#f0f4f8', size: 14 } },
        xaxis: { ...plotlyDarkTheme.xaxis, title: 'Strike' },
        yaxis: { ...plotlyDarkTheme.yaxis, title: 'IV (%)', range: [0, Math.max(...Object.values(smileData).flatMap(d => d.ivs)) * 1.1] },
        shapes: [{ type: 'line', x0: spot, x1: spot, y0: 0, y1: 1, yref: 'paper', line: { color: 'rgba(255,255,255,0.5)', dash: 'dash', width: 1 } }],
      }, { responsive: true, displayModeBar: false });
    });
  }, [controller.currentIndex, smileData, expiries, expiryLabels, spot]);

  if (expiries.length === 0) {
    return <Card className="glass-card"><CardContent className="pt-6"><EmptyPlaceholder message="No IV data for animation" /></CardContent></Card>;
  }

  return (
    <Card className="glass-card">
      <CardContent className="pt-6 space-y-4">
        <AnimationControls
          controller={controller}
          frameLabel={(i) => expiryLabels[i] || `Frame ${i + 1}`}
        />
        <div ref={containerRef} className="w-full h-[350px]" />
      </CardContent>
    </Card>
  );
}

// Heatmap Plot
function HeatmapPlot({ data }: { data: SurfaceGridResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const zPercent = data.z.map((row) => row.map((v) => v * 100));

      Plotly.default.newPlot(containerRef.current!, [{
        type: 'heatmap',
        x: data.x,
        y: data.y,
        z: zPercent,
        colorscale: surfaceColorscale,
        colorbar: { title: 'IV (%)', titlefont: { color: '#f0f4f8' }, tickfont: { color: '#8b9cb3' } },
        hovertemplate: 'Log-m: %{x:.3f}<br>√T: %{y:.3f}<br>IV: %{z:.2f}%<extra></extra>',
      }], {
        ...plotlyDarkTheme,
        xaxis: { ...plotlyDarkTheme.xaxis, title: data.x_label },
        yaxis: { ...plotlyDarkTheme.yaxis, title: data.y_label },
      }, { responsive: true, displayModeBar: false });
    });

    return () => {
      if (containerRef.current) {
        import('plotly.js-dist-min').then((Plotly) => Plotly.default.purge(containerRef.current!));
      }
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[400px]" />;
}

// Animated Heatmap Section
function AnimatedHeatmapSection({
  gridData,
  expiries,
}: {
  gridData: SurfaceGridResponse | null;
  expiries: number[];
}) {
  const [mode, setMode] = useState<'progressive' | 'slice'>('progressive');
  const totalFrames = gridData ? gridData.y.length : 0;
  
  const controller = useAnimationController({
    totalFrames,
    initialSpeed: 200,
    loop: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !gridData) return;

    import('plotly.js-dist-min').then((Plotly) => {
      let zData: (number | null)[][];
      
      if (mode === 'progressive') {
        // Show rows up to currentIndex
        zData = gridData.z.slice(0, controller.currentIndex + 1).map(row => row.map(v => v * 100));
        // Pad with nulls to maintain shape
        while (zData.length < gridData.y.length) {
          zData.push(new Array(gridData.x.length).fill(null));
        }
      } else {
        // Show single slice
        const row = gridData.z[controller.currentIndex] || gridData.z[0];
        zData = gridData.z.map((_, i) => 
          i === controller.currentIndex ? row.map(v => v * 100) : new Array(gridData.x.length).fill(null)
        );
      }

      Plotly.default.react(containerRef.current!, [{
        type: 'heatmap',
        x: gridData.x,
        y: gridData.y,
        z: zData,
        colorscale: surfaceColorscale,
        colorbar: { title: 'IV (%)', titlefont: { color: '#f0f4f8' }, tickfont: { color: '#8b9cb3' } },
        zmin: Math.min(...gridData.z.flat()) * 100,
        zmax: Math.max(...gridData.z.flat()) * 100,
      }], {
        ...plotlyDarkTheme,
        title: { text: mode === 'progressive' ? `Revealing ${controller.currentIndex + 1}/${totalFrames} slices` : `Slice ${controller.currentIndex + 1}/${totalFrames}`, font: { color: '#f0f4f8', size: 14 } },
        xaxis: { ...plotlyDarkTheme.xaxis, title: gridData.x_label },
        yaxis: { ...plotlyDarkTheme.yaxis, title: gridData.y_label },
      }, { responsive: true, displayModeBar: false });
    });
  }, [gridData, controller.currentIndex, mode, totalFrames]);

  if (!gridData) {
    return <Card className="glass-card"><CardContent className="pt-6"><EmptyPlaceholder message="Fit surface to see animated heatmap" /></CardContent></Card>;
  }

  return (
    <Card className="glass-card">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <AnimationControls
            controller={controller}
            frameLabel={(i) => `√T slice ${i + 1}/${totalFrames}`}
            className="flex-1"
          />
          <div className="flex items-center gap-2 ml-4">
            <Label className="text-sm">Mode:</Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'progressive' | 'slice')}>
              <TabsList className="h-8">
                <TabsTrigger value="progressive" className="text-xs px-2">Progressive</TabsTrigger>
                <TabsTrigger value="slice" className="text-xs px-2">Slice</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div ref={containerRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  );
}

// 3D Surface Plot
function Surface3DPlot({ data }: { data: SurfaceGridResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const zPercent = data.z.map((row) => row.map((v) => v * 100));

      Plotly.default.newPlot(containerRef.current!, [{
        type: 'surface',
        x: data.x,
        y: data.y,
        z: zPercent,
        colorscale: surfaceColorscale,
        colorbar: { title: 'IV (%)', titlefont: { color: '#f0f4f8' }, tickfont: { color: '#8b9cb3' } },
      }], {
        ...plotlyDarkTheme,
        scene: {
          xaxis: { title: data.x_label, backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          yaxis: { title: data.y_label, backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          zaxis: { title: 'IV (%)', backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          bgcolor: 'rgba(16, 20, 30, 0.4)',
        },
      }, { responsive: true });
    });

    return () => {
      if (containerRef.current) {
        import('plotly.js-dist-min').then((Plotly) => Plotly.default.purge(containerRef.current!));
      }
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[450px]" />;
}

// Animated 3D Section
function Animated3DSection({ gridData }: { gridData: SurfaceGridResponse | null }) {
  const [animationType, setAnimationType] = useState<'rotate' | 'reveal'>('rotate');
  const controller = useAnimationController({
    totalFrames: 36, // 36 frames for 360 degree rotation
    initialSpeed: 100,
    loop: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !gridData) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const zPercent = gridData.z.map((row) => row.map((v) => v * 100));
      
      const cameraAngle = animationType === 'rotate' 
        ? (controller.currentIndex * 10) * (Math.PI / 180)
        : 0;

      Plotly.default.react(containerRef.current!, [{
        type: 'surface',
        x: gridData.x,
        y: gridData.y,
        z: zPercent,
        colorscale: surfaceColorscale,
        colorbar: { title: 'IV (%)', titlefont: { color: '#f0f4f8' }, tickfont: { color: '#8b9cb3' } },
      }], {
        ...plotlyDarkTheme,
        scene: {
          xaxis: { title: gridData.x_label, backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          yaxis: { title: gridData.y_label, backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          zaxis: { title: 'IV (%)', backgroundcolor: 'rgba(16, 20, 30, 0.6)', gridcolor: 'rgba(255,255,255,0.1)' },
          bgcolor: 'rgba(16, 20, 30, 0.4)',
          camera: {
            eye: {
              x: 1.5 * Math.cos(cameraAngle),
              y: 1.5 * Math.sin(cameraAngle),
              z: 0.8,
            },
          },
        },
      }, { responsive: true });
    });
  }, [gridData, controller.currentIndex, animationType]);

  if (!gridData) {
    return <Card className="glass-card"><CardContent className="pt-6"><EmptyPlaceholder message="Fit surface to see animated 3D" /></CardContent></Card>;
  }

  return (
    <Card className="glass-card">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-4">
          <AnimationControls
            controller={controller}
            frameLabel={(i) => animationType === 'rotate' ? `Angle: ${i * 10}°` : `Frame ${i + 1}`}
            className="flex-1"
          />
          <Tabs value={animationType} onValueChange={(v) => setAnimationType(v as 'rotate' | 'reveal')}>
            <TabsList className="h-8">
              <TabsTrigger value="rotate" className="text-xs px-2">Rotate</TabsTrigger>
              <TabsTrigger value="reveal" className="text-xs px-2">Reveal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div ref={containerRef} className="w-full h-[450px]" />
      </CardContent>
    </Card>
  );
}

// Parameter Sensitivity Section
function ParamSensitivitySection({
  chainData,
  optionType,
  baseHx,
  baseHy,
}: {
  chainData: any;
  optionType: 'call' | 'put';
  baseHx: number;
  baseHy: number;
}) {
  const [sweepParam, setSweepParam] = useState<'hx' | 'hy'>('hx');
  const [differenceMode, setDifferenceMode] = useState(false);
  const [frames, setFrames] = useState<{ param: number; z: number[][] }[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  
  const hxRange = useMemo(() => {
    const values: number[] = [];
    for (let h = 0.04; h <= 0.4; h += 0.04) values.push(parseFloat(h.toFixed(2)));
    return values;
  }, []);

  const controller = useAnimationController({
    totalFrames: frames.length || 1,
    initialSpeed: 300,
    loop: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute frames would require backend calls - simplified for now
  const computeFrames = useCallback(async () => {
    if (!chainData) return;
    setIsComputing(true);
    
    // For demo, we'll just show placeholder
    // In production, this would call /surface/fit and /surface/grid for each param value
    toast.info('Parameter sensitivity requires multiple backend calls - showing demo');
    
    // Create mock frames
    const mockFrames = hxRange.map((h, i) => ({
      param: h,
      z: Array(20).fill(null).map(() => 
        Array(40).fill(null).map(() => 0.15 + Math.random() * 0.1 + h * 0.1)
      ),
    }));
    
    setFrames(mockFrames);
    setIsComputing(false);
  }, [chainData, hxRange]);

  useEffect(() => {
    if (!containerRef.current || frames.length === 0) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const frame = frames[controller.currentIndex];
      if (!frame) return;

      let zData = frame.z.map(row => row.map(v => v * 100));
      
      if (differenceMode && frames.length > 0) {
        const baseFrame = frames[Math.floor(frames.length / 2)];
        zData = frame.z.map((row, i) => 
          row.map((v, j) => (v - baseFrame.z[i][j]) * 100)
        );
      }

      Plotly.default.react(containerRef.current!, [{
        type: 'heatmap',
        z: zData,
        colorscale: differenceMode 
          ? [[0, '#ef4444'], [0.5, '#1a1f30'], [1, '#22c55e']]
          : surfaceColorscale,
        colorbar: { 
          title: differenceMode ? 'ΔIV (%)' : 'IV (%)', 
          titlefont: { color: '#f0f4f8' }, 
          tickfont: { color: '#8b9cb3' } 
        },
      }], {
        ...plotlyDarkTheme,
        title: { 
          text: `${sweepParam} = ${frame.param.toFixed(2)}${differenceMode ? ' (diff from base)' : ''}`, 
          font: { color: '#f0f4f8', size: 14 } 
        },
      }, { responsive: true, displayModeBar: false });
    });
  }, [frames, controller.currentIndex, differenceMode, sweepParam]);

  return (
    <Card className="glass-card">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label>Sweep:</Label>
            <Tabs value={sweepParam} onValueChange={(v) => setSweepParam(v as 'hx' | 'hy')}>
              <TabsList className="h-8">
                <TabsTrigger value="hx" className="text-xs px-3">hₓ</TabsTrigger>
                <TabsTrigger value="hy" className="text-xs px-3">hᵧ</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch checked={differenceMode} onCheckedChange={setDifferenceMode} />
            <Label className="text-sm">Difference Mode</Label>
          </div>

          <Button onClick={computeFrames} disabled={isComputing || !chainData} size="sm">
            {isComputing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Compute Frames
          </Button>
        </div>

        {frames.length > 0 && (
          <AnimationControls
            controller={controller}
            frameLabel={(i) => `${sweepParam} = ${frames[i]?.param.toFixed(2) || '?'}`}
          />
        )}

        {frames.length > 0 ? (
          <div ref={containerRef} className="w-full h-[400px]" />
        ) : (
          <EmptyPlaceholder message="Click 'Compute Frames' to generate sensitivity animation" />
        )}
      </CardContent>
    </Card>
  );
}

// Diagnostics Section
function DiagnosticsSection({ diagnostics }: { diagnostics: any }) {
  if (!diagnostics) return null;

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Chain Loaded" value={diagnostics.chain_loaded ? 'Yes' : 'No'} active={diagnostics.chain_loaded} />
          <StatCard label="Quotes" value={diagnostics.n_quotes.toString()} active={diagnostics.n_quotes > 0} />
          <StatCard label="Valid IVs" value={diagnostics.n_valid_iv.toString()} active={diagnostics.iv_computed} />
          <StatCard label="Surface Fitted" value={diagnostics.surface_fitted ? 'Yes' : 'No'} active={diagnostics.surface_fitted} />
        </div>
        {diagnostics.surface_bounds && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm">
            <span className="text-muted-foreground">Bounds: </span>
            X: [{diagnostics.surface_bounds.x[0].toFixed(3)}, {diagnostics.surface_bounds.x[1].toFixed(3)}] | 
            Y: [{diagnostics.surface_bounds.y[0].toFixed(3)}, {diagnostics.surface_bounds.y[1].toFixed(3)}]
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={cn('text-xl font-bold', active ? 'text-green-500' : 'text-muted-foreground')}>{value}</div>
    </div>
  );
}

function EmptyPlaceholder({ message }: { message: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      {message}
    </div>
  );
}