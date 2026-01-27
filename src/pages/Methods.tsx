/**
 * Methods Page - Scientific backbone of Uncertainty Lab
 * 
 * Explains how the platform computes what you see
 * Uses KaTeX for professional mathematical typesetting
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Calculator, 
  LineChart, 
  BarChart3, 
  AlertTriangle, 
  Dices,
  Sliders,
  FileSearch,
  TrendingUp,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MathBlock, MathInline } from '@/components/Math';

interface MethodSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  status?: 'implemented' | 'partial' | 'planned';
}

function MethodSection({ icon, title, description, details, status = 'implemented' }: MethodSectionProps) {
  const statusColors = {
    implemented: 'bg-green-500/10 text-green-400 border-green-500/20',
    partial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const statusLabels = {
    implemented: 'Implemented',
    partial: 'In Progress',
    planned: 'Planned',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <CardTitle className="text-xl mt-4">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MethodsPage() {
  const methods: MethodSectionProps[] = [
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: 'Data Ingestion',
      description: 'CSV parsing, cleaning, and arbitrage filtering',
      details: [
        'Flexible column mapping for strike, bid, ask, expiry, and option type',
        'Strike suffix parsing (e.g., "62.5C" → strike=62.5, type=call)',
        'Multi-file merging for term structure construction',
        'Automatic expiry inference from filenames',
        'Synthetic bid/ask spread generation when real spreads unavailable',
        'No-arbitrage bounds checking against intrinsic value',
      ],
      status: 'implemented',
    },
    {
      icon: <Calculator className="w-6 h-6 text-primary" />,
      title: 'Implied Volatility Inversion',
      description: 'Numerical extraction of IV from market prices',
      details: [
        'Newton-Raphson iteration with analytical vega',
        'Brenner-Subrahmanyam rational approximation for initial guess',
        'Bounded search domain [0.01, 3.0] with bisection fallback',
        'Convergence tolerance of 1e-8 for price matching',
        'Safe handling of deep ITM/OTM options',
        'Vectorized computation over entire option chains',
      ],
      status: 'implemented',
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: 'Kernel Surface Fitting',
      description: 'Non-parametric volatility surface estimation',
      details: [
        'Nadaraya-Watson kernel regression in (log-moneyness, √T) space',
        'Gaussian kernel with separate bandwidths hₓ and hᵧ',
        'Adaptive bandwidth selection based on data density',
        'Leave-one-out cross-validation for bandwidth tuning',
        'Support for anisotropic smoothing (different x and y scales)',
      ],
      status: 'implemented',
    },
    {
      icon: <Sliders className="w-6 h-6 text-primary" />,
      title: 'Bias-Variance Tradeoff',
      description: 'Smoothing parameter selection and diagnostics',
      details: [
        'Interactive hₓ and hᵧ sliders with real-time surface updates',
        'RMSE computation for fit quality assessment',
        'Visual comparison of under-smoothed vs over-smoothed surfaces',
        'Cross-validation error curves (planned)',
        'Optimal bandwidth selection via GCV criterion (planned)',
      ],
      status: 'partial',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      title: 'Arbitrage Diagnostics',
      description: 'Detection of static arbitrage violations',
      details: [
        'Calendar spread arbitrage: IV should not decrease with maturity',
        'Butterfly spread arbitrage: convexity in strike space',
        'Intrinsic value bounds: options must exceed payoff value',
        'Price monotonicity checks across strikes',
        'Diagnostic reporting with violation counts and locations',
      ],
      status: 'partial',
    },
    {
      icon: <Dices className="w-6 h-6 text-primary" />,
      title: 'Monte Carlo Pricing',
      description: 'Simulation-based option valuation',
      details: [
        'Geometric Brownian motion path generation',
        'European option pricing with convergence analysis',
        'Asian option pricing (arithmetic average)',
        'Barrier option pricing (up/down, in/out)',
        'Standard error estimation and confidence intervals',
        'Path count vs accuracy visualization',
      ],
      status: 'implemented',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Roughness Analysis',
      description: 'Regularity estimation in volatility paths',
      details: [
        'Hurst exponent estimation (planned)',
        'Signature-based roughness metrics (planned)',
        'Comparison with rough Heston benchmarks (planned)',
        'Microstructure noise filtering (planned)',
      ],
      status: 'planned',
    },
    {
      icon: <FileSearch className="w-6 h-6 text-primary" />,
      title: 'Model Calibration',
      description: 'Parametric model fitting to market data',
      details: [
        'SVI parameterization (a, b, ρ, m, σ)',
        'SABR model calibration (planned)',
        'Heston model calibration (planned)',
        'Objective function: weighted RMSE in IV space',
        'Constraint enforcement for arbitrage-free parameters',
      ],
      status: 'partial',
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
          <h1 className="text-4xl font-bold">Methods</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            How Uncertainty Lab computes what you see
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mt-4">
            This page documents the computational methods, algorithms, and numerical 
            techniques used throughout the platform. Each component is designed for 
            transparency, reproducibility, and educational value.
          </p>
        </motion.div>

        {/* Methods Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {methods.map((method, index) => (
            <MethodSection key={index} {...method} />
          ))}
        </div>

        {/* Foundational Mathematics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Foundational Mathematics
              </CardTitle>
              <CardDescription>
                Research papers that provide the theoretical foundation for Uncertainty Lab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                to="/publications/inverse-fourier-image-restoration"
                className="block p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Image Restoration by the Inverse Fourier Transform
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This paper introduces Fourier-domain inversion, convolution theorems, kernel filtering, 
                      and instability analysis that directly motivate volatility surface reconstruction and 
                      calibration in Uncertainty Lab. It establishes the mathematical framework for understanding 
                      inverse problems, regularisation, and the bias-variance tradeoff.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Angus Ng (2025) • Uncertainty Lab • v1.0 (Preliminary)
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mathematical Notation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Mathematical Foundations</CardTitle>
              <CardDescription>
                Key equations and formulations used in Uncertainty Lab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Black-Scholes */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Black-Scholes Formula</h4>
                <MathBlock>
                  {`C(S,K,T,r,q,\\sigma) = S e^{-qT} N(d_1) - K e^{-rT} N(d_2)`}
                </MathBlock>
                <p className="text-sm text-muted-foreground mb-2">where:</p>
                <MathBlock>
                  {`d_1 = \\frac{\\ln(S/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}`}
                </MathBlock>
                <p className="text-xs text-muted-foreground mt-2">
                  <MathInline>{`N(\\cdot)`}</MathInline> is the standard normal CDF, <MathInline>{`S`}</MathInline> is spot price, 
                  <MathInline>{`K`}</MathInline> is strike, <MathInline>{`T`}</MathInline> is time to expiry, 
                  <MathInline>{`r`}</MathInline> is risk-free rate, <MathInline>{`q`}</MathInline> is dividend yield, 
                  and <MathInline>{`\\sigma`}</MathInline> is volatility.
                </p>
              </div>

              {/* Kernel Regression */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Kernel Regression Estimator</h4>
                <MathBlock>
                  {`\\hat{\\sigma}(x,y) = \\frac{\\sum_i K_h(x - x_i, y - y_i) \\cdot \\sigma_i}{\\sum_i K_h(x - x_i, y - y_i)}`}
                </MathBlock>
                <p className="text-xs text-muted-foreground mt-2">
                  Nadaraya-Watson estimator with Gaussian kernel <MathInline>{`K_h`}</MathInline> and bandwidth <MathInline>{`h`}</MathInline>.
                  Here <MathInline>{`x = \\ln(K/F)`}</MathInline> is log-moneyness and <MathInline>{`y = \\sqrt{T}`}</MathInline> is the square root of time to maturity.
                </p>
              </div>

              {/* SVI */}
              <div>
                <h4 className="font-medium text-foreground mb-3">SVI Parameterization</h4>
                <MathBlock>
                  {`w(k) = a + b \\left( \\rho(k - m) + \\sqrt{(k - m)^2 + \\sigma^2} \\right)`}
                </MathBlock>
                <p className="text-sm text-muted-foreground mb-2">where:</p>
                <MathBlock>
                  {`k = \\ln(K/F)`}
                </MathBlock>
                <p className="text-xs text-muted-foreground mt-2">
                  <MathInline>{`w(k)`}</MathInline> is total implied variance, <MathInline>{`a`}</MathInline> controls overall variance level,
                  <MathInline>{`b`}</MathInline> controls the wings, <MathInline>{`\\rho`}</MathInline> is the correlation (skew),
                  <MathInline>{`m`}</MathInline> shifts the smile, and <MathInline>{`\\sigma`}</MathInline> controls ATM curvature.
                </p>
              </div>

              {/* Greeks */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Option Greeks</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/20">
                    <p className="text-sm font-medium mb-2">Delta</p>
                    <MathBlock>{`\\Delta = \\frac{\\partial C}{\\partial S} = e^{-qT} N(d_1)`}</MathBlock>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20">
                    <p className="text-sm font-medium mb-2">Gamma</p>
                    <MathBlock>{`\\Gamma = \\frac{\\partial^2 C}{\\partial S^2} = \\frac{e^{-qT} N'(d_1)}{S \\sigma \\sqrt{T}}`}</MathBlock>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20">
                    <p className="text-sm font-medium mb-2">Vega</p>
                    <MathBlock>{`\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} = S e^{-qT} N'(d_1) \\sqrt{T}`}</MathBlock>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20">
                    <p className="text-sm font-medium mb-2">Theta</p>
                    <MathBlock>{`\\Theta = -\\frac{\\partial C}{\\partial T}`}</MathBlock>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* References */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            For detailed mathematical derivations and proofs, see the referenced 
            literature in the Publications section.
          </p>
        </motion.div>
      </div>
    </div>
  );
}