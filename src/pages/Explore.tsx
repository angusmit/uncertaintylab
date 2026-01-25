/**
 * Explore Page - Sandbox for uncertainty experiments
 * 
 * Entry point for synthetic data, parameter sweeps, and toy experiments
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Beaker, 
  Sliders, 
  AlertTriangle, 
  Waves,
  ArrowRight,
  Database,
  LineChart,
  Calculator,
  FlaskConical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExperimentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  status: 'available' | 'coming-soon';
}

function ExperimentCard({ icon, title, description, tags, link, status }: ExperimentCardProps) {
  const isAvailable = status === 'available';

  const content = (
    <Card className={`glass-card h-full transition-all duration-300 ${isAvailable ? 'hover:border-primary/50 cursor-pointer' : 'opacity-70'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          {!isAvailable && (
            <Badge variant="outline" className="bg-muted/50">
              Coming Soon
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-4">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {isAvailable && (
          <div className="flex items-center text-sm text-primary">
            <span>Start experiment</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isAvailable && link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}

export default function ExplorePage() {
  const experiments: ExperimentCardProps[] = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'Synthetic Chain Generator',
      description: 'Generate arbitrage-free option chains with customizable skew, smile, and term structure using SVI parameterization.',
      tags: ['SVI', 'Term Structure', 'Skew'],
      link: '/app/data',
      status: 'available',
    },
    {
      icon: <Sliders className="w-6 h-6 text-primary" />,
      title: 'Bandwidth Sweep',
      description: 'Explore the bias-variance tradeoff by varying kernel bandwidths hₓ and hᵧ and observing surface smoothness.',
      tags: ['Kernel Regression', 'Smoothing', 'RMSE'],
      link: '/app/surface',
      status: 'available',
    },
    {
      icon: <Calculator className="w-6 h-6 text-primary" />,
      title: 'Monte Carlo Lab',
      description: 'Study convergence behavior of Monte Carlo pricing across path counts, with European, Asian, and barrier options.',
      tags: ['Monte Carlo', 'Convergence', 'Exotics'],
      link: '/app/pricer',
      status: 'available',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      title: 'Arbitrage Scenarios',
      description: 'Explore what happens when market data violates no-arbitrage bounds. Visualize calendar spreads and butterfly violations.',
      tags: ['Arbitrage', 'Bounds', 'Diagnostics'],
      status: 'coming-soon',
    },
    {
      icon: <Waves className="w-6 h-6 text-primary" />,
      title: 'Noise Experiments',
      description: 'Add controlled noise to option prices and observe the effect on IV inversion and surface fitting.',
      tags: ['Noise', 'Robustness', 'Filtering'],
      status: 'coming-soon',
    },
    {
      icon: <Beaker className="w-6 h-6 text-primary" />,
      title: 'Model Zoo',
      description: 'Compare surfaces from different parametric models: SVI, SABR, Heston, and non-parametric kernel estimates.',
      tags: ['Model Comparison', 'Calibration', 'Fit Quality'],
      status: 'coming-soon',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FlaskConical className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Explore</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A sandbox to explore uncertainty across models and data
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mt-4">
            These experiments are designed to build intuition about volatility surfaces, 
            numerical methods, and the behavior of pricing models under various conditions.
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Start: Full Workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate data → Compute IVs → Fit surface → Price options
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/app/data" className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Data
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/app/surface" className="flex items-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Surface
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/app/pricer" className="flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Pricer
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Experiments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Experiments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <ExperimentCard {...experiment} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
              <CardDescription>
                Planned additions to the Explore sandbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Preset surfaces with known pathologies (e.g., inverted smile, flat term structure)',
                  'Interactive noise injection with adjustable SNR',
                  'Calendar and butterfly arbitrage detection and visualization',
                  'Model comparison dashboard with fit metrics',
                  'Parameter sensitivity analysis (Greeks surfaces)',
                  'Historical data replay from market snapshots',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}