/**
 * Pricer Page - Black-Scholes and Monte Carlo option pricing
 * With animated MC convergence visualization
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Calculator, Loader2, Play, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePriceEuropean,
  useMCConvergence,
  EuropeanPriceResponse,
  MCConvergenceResponse,
} from '@/lib/api/hooks';
import { AnimationControls, useAnimationController } from '@/components/animation';
import { cn } from '@/lib/utils';

// Plotly theme
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

export default function PricerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Option Pricer</h1>
        <p className="text-muted-foreground">
          Price options using Black-Scholes or Monte Carlo simulation
        </p>
      </div>

      <EuropeanPricer />
    </div>
  );
}

function EuropeanPricer() {
  const [params, setParams] = useState({
    spot: 100,
    strike: 100,
    expiry: 1.0,
    rate: 0.05,
    div_yield: 0.02,
    vol: 0.2,
    option_type: 'call' as 'call' | 'put',
  });

  const [result, setResult] = useState<EuropeanPriceResponse | null>(null);
  const [convergence, setConvergence] = useState<MCConvergenceResponse | null>(null);

  const priceEuropean = usePriceEuropean();
  const mcConvergence = useMCConvergence();

  const handlePrice = async () => {
    try {
      const res = await priceEuropean.mutateAsync(params);
      setResult(res);
      toast.success('Option priced successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to price option');
    }
  };

  const handleConvergence = async () => {
    try {
      const res = await mcConvergence.mutateAsync({
        ...params,
        max_paths: 100000,
      });
      setConvergence(res);
      toast.success('MC convergence computed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to compute convergence');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top row: Inputs and Results */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Option Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Spot</Label>
                <Input
                  type="number"
                  value={params.spot}
                  onChange={(e) => setParams((p) => ({ ...p, spot: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Strike</Label>
                <Input
                  type="number"
                  value={params.strike}
                  onChange={(e) => setParams((p) => ({ ...p, strike: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry (years)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={params.expiry}
                  onChange={(e) => setParams((p) => ({ ...p, expiry: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Volatility</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.vol}
                  onChange={(e) => setParams((p) => ({ ...p, vol: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Rate</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.rate}
                  onChange={(e) => setParams((p) => ({ ...p, rate: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Dividend</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={params.div_yield}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, div_yield: parseFloat(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Option Type</Label>
              <Select
                value={params.option_type}
                onValueChange={(v) => setParams((p) => ({ ...p, option_type: v as 'call' | 'put' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="put">Put</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-4">
              <Button onClick={handlePrice} disabled={priceEuropean.isPending} className="w-full">
                {priceEuropean.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Price (Black-Scholes)
              </Button>

              <Button
                variant="outline"
                onClick={handleConvergence}
                disabled={mcConvergence.isPending}
                className="w-full"
              >
                {mcConvergence.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4 mr-2" />
                )}
                Compute MC Convergence
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pricing Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Price */}
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-sm text-muted-foreground">Option Price</div>
                  <div className="text-3xl font-bold text-primary">${result.price.toFixed(4)}</div>
                </div>

                {/* Greeks */}
                <div className="grid grid-cols-2 gap-3">
                  <GreekCard label="Delta" value={result.delta} format="percent" />
                  <GreekCard label="Gamma" value={result.gamma} format="number" />
                  <GreekCard label="Theta" value={result.theta} format="number" />
                  <GreekCard label="Vega" value={result.vega} format="number" />
                  <GreekCard label="Rho" value={result.rho} format="number" />
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Price an option to see results
              </div>
            )}
          </CardContent>
        </Card>

        {/* Static Convergence Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>MC Convergence (Static)</CardTitle>
          </CardHeader>
          <CardContent>
            {mcConvergence.isPending ? (
              <Skeleton className="h-[250px]" />
            ) : convergence ? (
              <StaticConvergencePlot data={convergence} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Run MC simulation to see convergence
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Animated Convergence Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Animated MC Convergence
          </CardTitle>
        </CardHeader>
        <CardContent>
          {convergence ? (
            <AnimatedConvergenceSection data={convergence} />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Run MC simulation above to see animated convergence
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GreekCard({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: 'percent' | 'number';
}) {
  const formatted = format === 'percent' ? `${(value * 100).toFixed(2)}%` : value.toFixed(4);
  const isPositive = value >= 0;

  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div
        className={cn(
          'text-lg font-mono font-medium',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}
      >
        {formatted}
      </div>
    </div>
  );
}

// Static convergence plot (shows all data)
function StaticConvergencePlot({ data }: { data: MCConvergenceResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const ciUpper = data.prices.map((p, i) => p + 1.96 * data.std_errors[i]);
      const ciLower = data.prices.map((p, i) => p - 1.96 * data.std_errors[i]);

      Plotly.default.newPlot(
        containerRef.current!,
        [
          {
            type: 'scatter',
            mode: 'lines+markers',
            name: 'MC Price',
            x: data.path_counts,
            y: data.prices,
            line: { color: '#00e6e6', width: 2 },
            marker: { size: 6 },
          },
          {
            type: 'scatter',
            mode: 'lines',
            name: '95% CI',
            x: [...data.path_counts, ...data.path_counts.slice().reverse()],
            y: [...ciUpper, ...ciLower.slice().reverse()],
            fill: 'toself',
            fillcolor: 'rgba(0, 230, 230, 0.1)',
            line: { color: 'transparent' },
            showlegend: false,
          },
        ],
        {
          ...plotlyDarkTheme,
          xaxis: { ...plotlyDarkTheme.xaxis, title: 'Paths', type: 'log' },
          yaxis: { ...plotlyDarkTheme.yaxis, title: 'Price' },
          shapes: [
            {
              type: 'line',
              x0: Math.min(...data.path_counts),
              x1: Math.max(...data.path_counts),
              y0: data.bs_price,
              y1: data.bs_price,
              line: { color: '#22c55e', dash: 'dash', width: 1 },
            },
          ],
          annotations: [
            {
              x: Math.max(...data.path_counts),
              y: data.bs_price,
              text: `BS: ${data.bs_price.toFixed(4)}`,
              showarrow: false,
              font: { color: '#22c55e', size: 10 },
              xanchor: 'right',
            },
          ],
          showlegend: false,
        },
        { responsive: true, displayModeBar: false }
      );
    });

    return () => {
      if (containerRef.current) {
        import('plotly.js-dist-min').then((Plotly) => Plotly.default.purge(containerRef.current!));
      }
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[250px]" />;
}

// Animated convergence section
function AnimatedConvergenceSection({ data }: { data: MCConvergenceResponse }) {
  const controller = useAnimationController({
    totalFrames: data.path_counts.length,
    initialSpeed: 300,
    loop: false, // Don't loop - stop at end
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Current visible data (up to currentIndex)
  const visibleData = useMemo(() => {
    const idx = controller.currentIndex + 1;
    return {
      path_counts: data.path_counts.slice(0, idx),
      prices: data.prices.slice(0, idx),
      std_errors: data.std_errors.slice(0, idx),
      bs_price: data.bs_price,
    };
  }, [data, controller.currentIndex]);

  // Current stats
  const currentPrice = data.prices[controller.currentIndex];
  const currentStdErr = data.std_errors[controller.currentIndex];
  const currentPaths = data.path_counts[controller.currentIndex];
  const errorFromBS = Math.abs(currentPrice - data.bs_price);

  useEffect(() => {
    if (!containerRef.current) return;

    import('plotly.js-dist-min').then((Plotly) => {
      const ciUpper = visibleData.prices.map((p, i) => p + 1.96 * visibleData.std_errors[i]);
      const ciLower = visibleData.prices.map((p, i) => p - 1.96 * visibleData.std_errors[i]);

      // Y-axis range based on full data for consistency
      const allPrices = [...data.prices, data.bs_price];
      const yMin = Math.min(...allPrices) - 0.5;
      const yMax = Math.max(...allPrices) + 0.5;

      Plotly.default.react(
        containerRef.current!,
        [
          // Confidence interval band
          {
            type: 'scatter',
            mode: 'lines',
            x: [...visibleData.path_counts, ...visibleData.path_counts.slice().reverse()],
            y: [...ciUpper, ...ciLower.slice().reverse()],
            fill: 'toself',
            fillcolor: 'rgba(0, 230, 230, 0.15)',
            line: { color: 'transparent' },
            showlegend: false,
            hoverinfo: 'skip',
          },
          // MC price line
          {
            type: 'scatter',
            mode: 'lines+markers',
            name: 'MC Price',
            x: visibleData.path_counts,
            y: visibleData.prices,
            line: { color: '#00e6e6', width: 3 },
            marker: { size: 8, color: '#00e6e6' },
          },
          // Current point highlight
          {
            type: 'scatter',
            mode: 'markers',
            x: [currentPaths],
            y: [currentPrice],
            marker: { size: 14, color: '#8c50ff', line: { color: '#fff', width: 2 } },
            showlegend: false,
            hoverinfo: 'skip',
          },
        ],
        {
          ...plotlyDarkTheme,
          title: {
            text: `Paths: ${currentPaths.toLocaleString()} | Price: $${currentPrice.toFixed(4)} | SE: ${currentStdErr.toFixed(4)}`,
            font: { color: '#f0f4f8', size: 14 },
          },
          xaxis: {
            ...plotlyDarkTheme.xaxis,
            title: 'Number of Paths',
            type: 'log',
            range: [Math.log10(data.path_counts[0] * 0.8), Math.log10(data.path_counts[data.path_counts.length - 1] * 1.2)],
          },
          yaxis: {
            ...plotlyDarkTheme.yaxis,
            title: 'Price',
            range: [yMin, yMax],
          },
          shapes: [
            {
              type: 'line',
              x0: data.path_counts[0],
              x1: data.path_counts[data.path_counts.length - 1],
              y0: data.bs_price,
              y1: data.bs_price,
              line: { color: '#22c55e', dash: 'dash', width: 2 },
            },
          ],
          annotations: [
            {
              x: data.path_counts[data.path_counts.length - 1],
              y: data.bs_price,
              text: `BS: $${data.bs_price.toFixed(4)}`,
              showarrow: false,
              font: { color: '#22c55e', size: 12 },
              xanchor: 'right',
              yanchor: 'bottom',
            },
          ],
          showlegend: false,
        },
        { responsive: true, displayModeBar: false }
      );
    });
  }, [visibleData, currentPaths, currentPrice, currentStdErr, data]);

  return (
    <div className="space-y-4">
      {/* Animation controls */}
      <AnimationControls
        controller={controller}
        frameLabel={(i) => `${data.path_counts[i]?.toLocaleString() || '?'} paths`}
        showResetButton
      />

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <div className="text-xs text-muted-foreground">Paths</div>
          <div className="text-lg font-mono font-bold text-primary">
            {currentPaths.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <div className="text-xs text-muted-foreground">MC Price</div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            ${currentPrice.toFixed(4)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <div className="text-xs text-muted-foreground">Std Error</div>
          <div className="text-lg font-mono font-bold text-yellow-400">
            {currentStdErr.toFixed(4)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <div className="text-xs text-muted-foreground">Error vs BS</div>
          <div className={cn(
            'text-lg font-mono font-bold',
            errorFromBS < 0.01 ? 'text-green-500' : errorFromBS < 0.05 ? 'text-yellow-500' : 'text-red-500'
          )}>
            {errorFromBS.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="w-full h-[350px]" />
    </div>
  );
}