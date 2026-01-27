/**
 * Publications Page - Research in Progress
 * 
 * Academic-style listing of current and planned research
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Clock, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PublicationProps {
  title: string;
  authors: string;
  status: 'in-preparation' | 'submitted' | 'published' | 'working-paper';
  abstract?: string;
  year?: number;
  venue?: string;
  link?: string;
  tags?: string[];
}

function Publication({ title, authors, status, abstract, year, link, tags }: PublicationProps) {
  const navigate = useNavigate();
  
  const statusConfig = {
    'in-preparation': { label: 'In Preparation', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    'submitted': { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    'published': { label: 'Published', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    'working-paper': { label: 'Working Paper', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };

  const { label, color } = statusConfig[status];
  const isPublished = status === 'published';

  const handleClick = () => {
    if (isPublished && link) {
      navigate(link);
    }
  };

  const content = (
    <Card className={`glass-card transition-all ${isPublished ? 'hover:border-primary/40 cursor-pointer' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <FileText className="w-4 h-4 text-primary" />
              <Badge variant="outline" className={color}>
                {label}
              </Badge>
              {year && (
                <span className="text-xs text-muted-foreground">
                  {year}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{authors}</p>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-muted/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {abstract && (
              <p className="text-sm text-muted-foreground leading-relaxed">{abstract}</p>
            )}
          </div>
          {isPublished && link && (
            <div className="text-primary">
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isPublished && link) {
    return <div onClick={handleClick} style={{ cursor: 'pointer' }}>{content}</div>;
  }

  return content;
}

export default function PublicationsPage() {
  // Published papers
  const publishedPapers: PublicationProps[] = [
    {
      title: 'Image Restoration by the Inverse Fourier Transform',
      authors: 'Angus Ng',
      status: 'published',
      year: 2025,
      link: '/publications/inverse-fourier-image-restoration',
      tags: ['Fourier Transform', 'Inverse Problems', 'Signal Processing', 'Foundations'],
      abstract: 'This report presents the mathematical foundations of image restoration using the Fourier Transform and its inverse. We introduce the linear shift-invariant degradation model, derive the two-dimensional convolution theorem, and explain how inverse filtering in the frequency domain can recover a degraded image.',
    },
  ];

  // Working papers and drafts
  const workingPapers: PublicationProps[] = [
    {
      title: 'Signature Methods for Stochastic Volatility Calibration',
      authors: 'Angus Ng',
      status: 'in-preparation',
      abstract: 'This work explores the use of rough path signatures as feature extractors for volatility model calibration. We demonstrate how signature-based regression can efficiently capture the stylized facts of implied volatility surfaces while maintaining theoretical consistency with arbitrage-free constraints.',
    },
    {
      title: 'Roughness and Arbitrage in Implied Volatility Surfaces',
      authors: 'Angus Ng',
      status: 'in-preparation',
      abstract: 'We investigate the relationship between path roughness in the underlying price process and the presence of arbitrage opportunities in the implied volatility surface. The analysis uses kernel regression methods to estimate local regularity and identifies regimes where classical arbitrage bounds are most likely to be violated.',
    },
    {
      title: 'Non-Parametric Surface Fitting with Adaptive Bandwidth Selection',
      authors: 'Angus Ng',
      status: 'working-paper',
      abstract: 'A practical guide to kernel regression for implied volatility surfaces, with emphasis on bandwidth selection via cross-validation and the bias-variance tradeoff. We provide open-source implementations and discuss computational considerations for real-time applications.',
    },
    {
      title: 'Monte Carlo Methods for Exotic Option Pricing: A Pedagogical Approach',
      authors: 'Angus Ng',
      status: 'working-paper',
      abstract: 'An educational treatment of Monte Carlo simulation for derivative pricing, covering variance reduction techniques, convergence analysis, and practical implementation details. Includes interactive visualizations and reproducible code examples.',
    },
  ];

  const researchAreas = [
    'Rough path theory and signatures',
    'Stochastic volatility modeling',
    'Surface geometry and arbitrage',
    'Numerical methods for finance',
    'Kernel regression and non-parametric estimation',
    'Model calibration and inverse problems',
  ];

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
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Publications</h1>
          <p className="text-xl text-muted-foreground">
            Research papers and technical reports
          </p>
        </motion.div>

        {/* Research Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Research Interests
              </CardTitle>
              <CardDescription>
                The author is currently working on topics including:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {researchAreas.map((area, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-primary/5 border-primary/20"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Published Papers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Published Papers
          </h2>
          
          <div className="space-y-4">
            {publishedPapers.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Publication {...pub} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Working Papers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Working Papers & Drafts
          </h2>
          
          <div className="space-y-4">
            {workingPapers.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Publication {...pub} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> The working papers listed above are 
                in various stages of preparation and have not yet been peer-reviewed. 
                They represent ongoing research and the conclusions may evolve as the 
                work progresses. For collaboration inquiries or to discuss these topics, 
                please contact the author.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            This page will be updated as research progresses and papers are completed.
          </p>
        </motion.div>
      </div>
    </div>
  );
}