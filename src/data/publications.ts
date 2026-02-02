/**
 * Publications Data — Single Source of Truth
 * 
 * Add new publications here. Both the landing page "Recent Publications"
 * section and the /publications page read from this file.
 * 
 * ORDER MATTERS: newest first. The landing page shows the first 3.
 */

export interface PublicationData {
  /** Paper title */
  title: string;
  /** Author(s) */
  authors: string;
  /** Publication status */
  status: 'published' | 'working-paper' | 'in-preparation' | 'submitted';
  /** Year of publication */
  year?: number;
  /** Short date string for display (e.g. "Feb 2026") */
  date: string;
  /** Estimated reading time */
  readTime: string;
  /** Category tag shown on landing page cards */
  category: string;
  /** Route path (for published papers with a page) */
  link?: string;
  /** Research tags */
  tags?: string[];
  /** Abstract / short description */
  abstract: string;
}

// =============================================================================
// PUBLISHED PAPERS (newest first)
// =============================================================================

export const publishedPapers: PublicationData[] = [
  {
    title: 'Statistical Inference on Path Space via Rough Paths and Kernel Methods',
    authors: 'Angus Ng',
    status: 'published',
    year: 2026,
    date: 'Feb 2026',
    readTime: '25 min',
    category: 'Lecture Notes',
    link: '/publications/statistical-inference-path-space',
    tags: ['Rough Paths', 'Signatures', 'Kernel Methods', 'RKHS', 'MMD', 'Two-Sample Testing'],
    abstract: 'This report develops a mathematically rigorous framework for performing nonparametric statistical inference on distributions of stochastic processes. We introduce the signature transform from rough path theory as a universal geometric representation of sequential data, and combine it with kernel mean embeddings to construct a Maximum Mean Discrepancy statistic on path space.',
  },
  {
    title: 'Image Restoration by the Inverse Fourier Transform',
    authors: 'Angus Ng',
    status: 'published',
    year: 2025,
    date: 'Jan 2025',
    readTime: '18 min',
    category: 'Foundations',
    link: '/publications/inverse-fourier-image-restoration',
    tags: ['Fourier Transform', 'Inverse Problems', 'Signal Processing', 'Foundations'],
    abstract: 'This report presents the mathematical foundations of image restoration using the Fourier Transform and its inverse. We introduce the linear shift-invariant degradation model, derive the two-dimensional convolution theorem, and explain how inverse filtering in the frequency domain can recover a degraded image.',
  },
];

// =============================================================================
// WORKING PAPERS & DRAFTS (newest first)
// =============================================================================

export const workingPapers: PublicationData[] = [
  {
    title: 'Signature Methods for Stochastic Volatility Calibration',
    authors: 'Angus Ng',
    status: 'in-preparation',
    date: '',
    readTime: '',
    category: 'Methodology',
    abstract: 'This work explores the use of rough path signatures as feature extractors for volatility model calibration. We demonstrate how signature-based regression can efficiently capture the stylized facts of implied volatility surfaces while maintaining theoretical consistency with arbitrage-free constraints.',
  },
  {
    title: 'Roughness and Arbitrage in Implied Volatility Surfaces',
    authors: 'Angus Ng',
    status: 'in-preparation',
    date: '',
    readTime: '',
    category: 'Research',
    abstract: 'We investigate the relationship between path roughness in the underlying price process and the presence of arbitrage opportunities in the implied volatility surface. The analysis uses kernel regression methods to estimate local regularity and identifies regimes where classical arbitrage bounds are most likely to be violated.',
  },
  {
    title: 'Non-Parametric Surface Fitting with Adaptive Bandwidth Selection',
    authors: 'Angus Ng',
    status: 'working-paper',
    date: '',
    readTime: '',
    category: 'Methodology',
    abstract: 'A practical guide to kernel regression for implied volatility surfaces, with emphasis on bandwidth selection via cross-validation and the bias-variance tradeoff. We provide open-source implementations and discuss computational considerations for real-time applications.',
  },
  {
    title: 'Monte Carlo Methods for Exotic Option Pricing: A Pedagogical Approach',
    authors: 'Angus Ng',
    status: 'working-paper',
    date: '',
    readTime: '',
    category: 'Tutorial',
    abstract: 'An educational treatment of Monte Carlo simulation for derivative pricing, covering variance reduction techniques, convergence analysis, and practical implementation details. Includes interactive visualizations and reproducible code examples.',
  },
];

// =============================================================================
// CONVENIENCE: All papers combined (published first, then working)
// =============================================================================

export const allPapers: PublicationData[] = [...publishedPapers, ...workingPapers];