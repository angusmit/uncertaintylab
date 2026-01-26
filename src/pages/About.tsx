/**
 * About Page - Uncertainty Lab
 * 
 * Academic-style description of the research platform
 */

import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  GraduationCap, 
  Target, 
  Shield, 
  Code2, 
  BookOpen,
  ExternalLink 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <FlaskConical className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Uncertainty</span> Lab
          </h1>
          <p className="text-xl text-muted-foreground">
            A computational laboratory for mathematical finance
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-invert max-w-none"
        >
          <Card className="glass-card">
            <CardContent className="p-8 space-y-6">
              <p className="text-lg leading-relaxed text-foreground">
                Uncertainty Lab is a personal research platform developed by Angus Ng for the 
                study of volatility surfaces, implied volatility dynamics, and computational 
                methods in quantitative finance.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                The platform serves as both a research tool and a pedagogical resource, 
                providing interactive visualizations of mathematical concepts that are 
                typically encountered only in specialized academic literature or proprietary 
                trading systems.
              </p>

              <div className="border-l-2 border-primary/50 pl-6 py-2 my-8">
                <p className="text-muted-foreground italic">
                  "The goal is not to provide trading signals or financial advice, but to 
                  build intuition about the mathematical structures underlying derivative 
                  markets and to explore numerical methods for their analysis."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Research Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Research Focus
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Volatility Surfaces',
                description: 'Non-parametric estimation using kernel regression, SVI parameterization, and arbitrage-free interpolation methods.',
              },
              {
                title: 'Implied Volatility',
                description: 'Numerical inversion of the Black-Scholes formula, including rational approximations and Newton-Raphson iteration.',
              },
              {
                title: 'Model Risk',
                description: 'Sensitivity analysis across model specifications, calibration uncertainty, and parameter stability.',
              },
              {
                title: 'Roughness & Regularity',
                description: 'Investigation of path roughness in volatility processes and implications for option pricing.',
              },
              {
                title: 'Kernel Methods',
                description: 'Nadaraya-Watson estimation, bandwidth selection, and bias-variance tradeoffs in surface fitting.',
              },
              {
                title: 'Monte Carlo Methods',
                description: 'Variance reduction techniques, convergence analysis, and exotic option pricing.',
              },
            ].map((item, index) => (
              <Card key={index} className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Purpose & Scope */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            Purpose & Scope
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This platform is designed for:
              </p>
              <ul className="space-y-3">
                {[
                  'Research and experimentation with volatility models',
                  'Reproducibility of numerical results and algorithms',
                  'Academic and quantitative development',
                  'Building intuition through interactive visualization',
                  'Testing hypotheses about market microstructure',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            Disclaimer
          </h2>
          <Card className="glass-card border-yellow-500/20">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Uncertainty Lab is a research and educational tool. It does not provide 
                financial advice, trading recommendations, or investment guidance. The 
                models, algorithms, and visualizations presented here are for academic 
                and experimental purposes only. Users should not rely on this platform 
                for actual trading decisions.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-primary" />
            Technical Implementation
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The platform is built with modern web technologies and numerical computing 
                libraries to ensure both interactivity and computational accuracy:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Frontend</h4>
                  <p className="text-muted-foreground">
                    React, TypeScript, Vite, Plotly.js, Recharts, Tailwind CSS
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Backend</h4>
                  <p className="text-muted-foreground">
                    Python, FastAPI, NumPy, SciPy, Pandas
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Numerical Methods</h4>
                  <p className="text-muted-foreground">
                    Newton-Raphson iteration, kernel regression, Monte Carlo simulation
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Deployment</h4>
                  <p className="text-muted-foreground">
                    GitHub Pages (frontend), configurable API backend
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Uncertainty Lab. A personal research platform by Angus Ng.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            For academic and experimental purposes only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}