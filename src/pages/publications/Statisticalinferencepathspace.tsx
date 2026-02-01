/**
 * Publication: Statistical Inference on Path Space via Rough Paths and Kernel Methods
 * Author: Angus Ng
 * Version: v1.0 (Preliminary)
 * 
 * Publication #2 in Uncertainty Lab — lecture notes developing a nonparametric
 * framework for two-sample testing on distributions of stochastic processes
 * using signature kernels and MMD.
 * 
 * Uses professional academic typography (research.css)
 */

import { ArrowLeft, BookOpen, Tag, Quote } from 'lucide-react';
import { MathInline } from '@/components/Math';
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '@/styles/research.css';
import { PageTransition, TransitionBackLink } from '@/components/PageTransition';

// =============================================================================
// Theorem Environment Component
// =============================================================================

interface TheoremBoxProps {
  type: 'definition' | 'theorem' | 'lemma' | 'remark' | 'critical';
  number: string;
  title?: string;
  children: React.ReactNode;
}

function TheoremBox({ type, number, title, children }: TheoremBoxProps) {
  const config = {
    definition: { label: 'Definition', className: 'research-definition' },
    theorem: { label: 'Theorem', className: 'research-theorem' },
    lemma: { label: 'Lemma', className: 'research-lemma' },
    remark: { label: 'Remark', className: 'research-remark' },
    critical: { label: 'Remark', className: 'research-critical' },
  };
  const { label, className } = config[type];
  
  return (
    <div className={`research-theorem-box ${className}`}>
      <p className="theorem-title">
        {label} {number}{title && <span> ({title})</span>}
      </p>
      <div className="theorem-content">{children}</div>
    </div>
  );
}

// =============================================================================
// Math Components with Research Styling (no gray background)
// =============================================================================

function MathDisplay({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, {
          displayMode: true,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX error:', error);
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }
  }, [children]);

  return (
    <div className="research-math-block">
      <div ref={ref} className="katex-display-wrapper" />
    </div>
  );
}

function MathBoxed({ children, label }: { children: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, {
          displayMode: true,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX error:', error);
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }
  }, [children]);

  return (
    <div className="research-math-boxed">
      <div ref={ref} className="katex-display-wrapper" />
      {label && <p className="equation-label">({label})</p>}
    </div>
  );
}

// =============================================================================
// Section Components
// =============================================================================

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2>{number}. {title}</h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="subsection">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// =============================================================================
// Main Paper Component
// =============================================================================

export default function StatisticalInferencePathSpace() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tags = ['Rough Paths', 'Signatures', 'Kernel Methods', 'RKHS', 'MMD', 'Two-Sample Testing', 'Stochastic Processes', 'Nonparametric Inference'];

  return (
    <PageTransition revealBg="#ffffff" baseBg="#0B0E14">
      <div className="research-theme">
        <div className="research-content">
          {/* Back Link */}
          <TransitionBackLink to="/publications" className="research-back-link">
            <ArrowLeft size={16} />
            Back to Publications
          </TransitionBackLink>

          {/* Context Note */}
          <div className="research-context-note">
            <p>
              <strong>Note:</strong> These lecture notes serve as a mathematical and conceptual foundation 
              for later work in Uncertainty Lab, including signature-based calibration, kernel two-sample 
              testing on financial time series, and nonparametric inference on volatility dynamics.
            </p>
          </div>

          {/* Paper Header */}
          <header className="research-paper-header">
            <h1>Statistical Inference on Path Space via Rough Paths and Kernel Methods</h1>
            <p className="author">Angus Ng</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="research-badge research-badge-published">Published (Preliminary)</span>
              <span className="research-badge research-badge-version">v1.0</span>
            </div>
            <p className="meta">2026 · Uncertainty Lab · Lecture Notes</p>
          </header>

          {/* Tags */}
          <div className="research-tags">
            {tags.map((tag) => (
              <span key={tag} className="research-tag">
                <Tag size={12} />{tag}
              </span>
            ))}
          </div>

          {/* Abstract */}
          <div className="research-abstract">
            <h2><BookOpen size={18} /> Abstract</h2>
            <p>
              This report develops a mathematically rigorous framework for performing nonparametric 
              statistical inference on distributions of stochastic processes. Classical statistical 
              methods are built around finite-dimensional random variables and are fundamentally 
              inadequate for data that take values in infinite-dimensional path spaces. We introduce 
              the signature transform from rough path theory as a universal geometric representation 
              of sequential data, and combine it with kernel mean embeddings in reproducing kernel 
              Hilbert spaces to construct a Maximum Mean Discrepancy (MMD) statistic on path space. 
              The resulting framework yields a nonparametric, distribution-free two-sample test capable 
              of distinguishing the laws of stochastic processes without parametric model assumptions. 
              We discuss the lead–lag transform as a mechanism for encoding quadratic variation into 
              signature features, present a concrete experimental setting using geometric Brownian 
              motion, and analyse the mathematical, statistical, and computational assumptions 
              underlying the method.
            </p>
          </div>

          {/* ================================================================= */}
          {/* Section 1: Research Motivation */}
          {/* ================================================================= */}
          <Section id="motivation" number="1" title="Research Motivation and Conceptual Landscape">
            <Subsection title="Core Research Question">
              <blockquote className="research-blockquote">
                <p>
                  <em>Given two collections of random sample paths, decide whether they arise from the same 
                  probability distribution on path space.</em>
                </p>
              </blockquote>
              <p>
                This question defines the intellectual scope of the present work. The approach combines 
                kernel-based hypothesis testing [1] with path signatures [6] to construct a nonparametric 
                statistical test on infinite-dimensional path space.
              </p>
            </Subsection>

            <Subsection title="The Finite-Dimensional Foundation of Classical Statistics">
              <p>
                Classical mathematical statistics is fundamentally built around random variables of the form
              </p>
              <MathDisplay>{`X : \\Omega \\to \\mathbb{R}^d,`}</MathDisplay>
              <p>
                or at most finite-dimensional random vectors. The essential objects of classical inference 
                are probability distributions on <MathInline>{`\\mathbb{R}^d`}</MathInline>, moments, likelihoods, 
                estimators, and parametric families indexed by finitely many parameters.
              </p>
              <p>
                However, much of modern scientific data does not conform to this structure. Instead, one 
                routinely observes <em>random objects</em>: time series and stochastic processes, trajectories 
                of dynamical systems, shapes, curves, graphs, and solutions of stochastic differential equations. 
                Mathematically, these objects live in infinite-dimensional spaces.
              </p>
            </Subsection>

            <Subsection title="Why Time Series Are Fundamentally Harder">
              <p>
                A stochastic process is not a vector; it is a random function
              </p>
              <MathDisplay>{`X : [0,T] \\to \\mathbb{R}^d.`}</MathDisplay>
              <p>
                Each data point therefore lives in a function space such as
              </p>
              <MathDisplay>{`C([0,T],\\mathbb{R}^d), \\quad D([0,T],\\mathbb{R}^d), \\quad \\text{or a Sobolev space}.`}</MathDisplay>
              <p>
                This immediately breaks most classical statistical tools. There is no Lebesgue measure on 
                such spaces. The dimension is infinite. The geometry is nonlinear. And temporal order matters: 
                a permutation of the values of a time series produces a fundamentally different object, unlike 
                permutations of entries in a vector.
              </p>
            </Subsection>

            <Subsection title="Fragility of Parametric Modelling">
              <p>
                In quantitative modelling one often assumes parametric models such as geometric Brownian 
                motion, the Ornstein–Uhlenbeck process, the Heston model, or fractional Brownian motion. 
                These models assume that the true data-generating mechanism lies in a low-dimensional 
                parametric family
              </p>
              <MathDisplay>{`\\mathcal{P}_\\theta, \\quad \\theta \\in \\mathbb{R}^k.`}</MathDisplay>
              <p>
                In reality, empirical stochastic dynamics rarely sit in such families. Parametric 
                assumptions impose structural constraints that may be violated in practice, leading to 
                model misspecification and unreliable inference. Hence the central imperative:
              </p>
              <blockquote className="research-blockquote">
                <p><em>We need a nonparametric geometry of stochastic processes.</em></p>
              </blockquote>
              <p>Not a model of the process, but a representation of the law of the process.</p>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 2: Mathematical Objects */}
          {/* ================================================================= */}
          <Section id="objects" number="2" title="Mathematical Objects of Study">
            <Subsection title="Probability Space">
              <p>We work on a standard probability space</p>
              <MathDisplay>{`(\\Omega, \\mathcal{F}, \\mathbb{P}).`}</MathDisplay>
              <p>All random objects in this report are defined on this space.</p>
            </Subsection>

            <Subsection title="Stochastic Processes as Random Elements">
              <TheoremBox type="definition" number="2.1" title="Stochastic Process">
                <p>
                  A stochastic process is a measurable map
                </p>
                <MathDisplay>{`X : \\Omega \\to C([0,T],\\mathbb{R}^d).`}</MathDisplay>
                <p>
                  Thus, mathematically, a process is a random variable taking values in a function 
                  space. Each realisation <MathInline>{`X(\\omega)`}</MathInline> is a continuous path from 
                  the time interval <MathInline>{`[0,T]`}</MathInline> into <MathInline>{`\\mathbb{R}^d`}</MathInline>.
                </p>
              </TheoremBox>
            </Subsection>

            <Subsection title="Brownian Motion and Geometric Brownian Motion">
              <TheoremBox type="definition" number="2.2" title="Brownian Motion">
                <p>
                  Brownian motion <MathInline>{`B_t`}</MathInline> is a continuous-time stochastic process satisfying
                </p>
                <MathDisplay>{`B_0 = 0, \\quad B_t - B_s \\sim \\mathcal{N}(0,\\, t - s).`}</MathDisplay>
              </TheoremBox>
              <p>
                Geometric Brownian Motion (GBM) is the standard model for asset prices. It solves the 
                stochastic differential equation
              </p>
              <MathDisplay>{`dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dB_t,`}</MathDisplay>
              <p>with explicit solution</p>
              <MathDisplay>{`S_t = S_0 \\exp\\!\\left((\\mu - \\tfrac{1}{2}\\sigma^2)t + \\sigma B_t\\right).`}</MathDisplay>
              <p>
                GBM provides the concrete experimental setting in Section 9 of this report.
              </p>
            </Subsection>

            <Subsection title="Inner Products and Feature Maps">
              <p>
                A feature map <MathInline>{`\\phi : \\mathcal{X} \\to \\mathcal{H}`}</MathInline> embeds data 
                into a Hilbert space where geometry is linear. Kernels implicitly define such maps [5], 
                enabling computation in high-dimensional feature spaces without explicit construction of 
                feature vectors.
              </p>
            </Subsection>

            <Subsection title="Laws on Path Space">
              <TheoremBox type="definition" number="2.3" title="Law of a Process">
                <p>The law of a process is the pushforward measure</p>
                <MathDisplay>{`\\mathcal{L}(X) := \\mathbb{P} \\circ X^{-1}.`}</MathDisplay>
                <p>
                  This is a probability measure on the path space <MathInline>{`C([0,T],\\mathbb{R}^d)`}</MathInline>.
                </p>
              </TheoremBox>
              <p>
                The law is the fundamental object of inference: it encodes all distributional information 
                about the process, including its marginals, its dependence structure, and its fine 
                regularity properties.
              </p>
            </Subsection>

            <Subsection title="Weak Convergence">
              <TheoremBox type="definition" number="2.4" title="Weak Convergence of Processes">
                <p>
                  A sequence of processes <MathInline>{`X_n`}</MathInline> converges weakly 
                  to <MathInline>{`X`}</MathInline> if
                </p>
                <MathDisplay>{`\\mathcal{L}(X_n) \\Rightarrow \\mathcal{L}(X),`}</MathDisplay>
                <p>meaning</p>
                <MathDisplay>{`\\mathbb{E}[f(X_n)] \\to \\mathbb{E}[f(X)] \\quad \\text{for all bounded continuous } f.`}</MathDisplay>
              </TheoremBox>
              <p>
                Thus all statistical inference on processes is, at its foundation, inference on 
                probability measures on path space.
              </p>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 3: Two-Sample Testing */}
          {/* ================================================================= */}
          <Section id="testing" number="3" title="The Statistical Problem: Two-Sample Testing on Path Space">
            <Subsection title="The Observational Setting">
              <p>We observe two independent samples of paths:</p>
              <MathDisplay>{`X^{(1)}, \\dots, X^{(n)} \\sim \\mathcal{L}(X),`}</MathDisplay>
              <MathDisplay>{`Y^{(1)}, \\dots, Y^{(m)} \\sim \\mathcal{L}(Y).`}</MathDisplay>
              <p>Each observation is not a number or a vector, but an entire path.</p>
            </Subsection>

            <Subsection title="The Hypothesis Test">
              <TheoremBox type="definition" number="3.1" title="Two-Sample Hypothesis on Path Space">
                <p>The null and alternative hypotheses are</p>
                <MathDisplay>{`H_0 : \\mathcal{L}(X) = \\mathcal{L}(Y),`}</MathDisplay>
                <MathDisplay>{`H_1 : \\mathcal{L}(X) \\neq \\mathcal{L}(Y).`}</MathDisplay>
                <p>This is a test on</p>
                <MathDisplay>{`\\mathcal{P}\\!\\left(C([0,T],\\mathbb{R}^d)\\right),`}</MathDisplay>
                <p>
                  the space of probability measures on an infinite-dimensional function space.
                </p>
              </TheoremBox>
              <p>
                In this setting, there is no density in general, no likelihood ratio, and no sufficient 
                statistic. The classical machinery of parametric hypothesis testing is entirely 
                unavailable. This is a distributional question on path space [6].
              </p>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 4: Kernel Mean Embeddings and MMD */}
          {/* ================================================================= */}
          <Section id="kernels" number="4" title="Kernel Mean Embeddings and MMD">
            <Subsection title="Kernels as Inner Products">
              <TheoremBox type="definition" number="4.1" title="Positive Definite Kernel">
                <p>
                  A kernel is a symmetric positive definite function
                </p>
                <MathDisplay>{`k : \\mathcal{X} \\times \\mathcal{X} \\to \\mathbb{R}`}</MathDisplay>
                <p>
                  such that there exists a Hilbert space <MathInline>{`\\mathcal{H}`}</MathInline> (the 
                  reproducing kernel Hilbert space, or RKHS) and a feature map
                </p>
                <MathDisplay>{`\\phi : \\mathcal{X} \\to \\mathcal{H}`}</MathDisplay>
                <p>satisfying the reproducing property</p>
                <MathBoxed label="1">{`k(x,y) = \\langle \\phi(x), \\phi(y) \\rangle_{\\mathcal{H}}.`}</MathBoxed>
              </TheoremBox>
              <p>
                The kernel implicitly computes inner products in a potentially infinite-dimensional feature 
                space without ever constructing the feature vectors explicitly [5].
              </p>
            </Subsection>

            <Subsection title="Mean Embedding of a Distribution">
              <TheoremBox type="definition" number="4.2" title="Kernel Mean Embedding">
                <p>
                  Given a probability measure <MathInline>{`P \\in \\mathcal{P}(\\mathcal{X})`}</MathInline>, 
                  the kernel mean embedding of <MathInline>{`P`}</MathInline> is
                </p>
                <MathBoxed label="2">{`\\mu_P := \\mathbb{E}_{X \\sim P}[\\phi(X)] \\in \\mathcal{H}.`}</MathBoxed>
              </TheoremBox>
              <p>
                This maps a probability measure—an object of potentially great complexity—to a single 
                element of a Hilbert space. The mean embedding is a sufficient representation of the 
                distribution whenever the kernel is <em>characteristic</em>.
              </p>
            </Subsection>

            <Subsection title="Characteristic Kernels">
              <TheoremBox type="definition" number="4.3" title="Characteristic Kernel">
                <p>
                  A kernel <MathInline>{`k`}</MathInline> is said to be characteristic if the mean embedding 
                  is injective:
                </p>
                <MathDisplay>{`\\mu_P = \\mu_Q \\quad \\Rightarrow \\quad P = Q.`}</MathDisplay>
                <p>
                  When the kernel is characteristic, no distributional information is lost in the 
                  embedding. Distinct distributions are mapped to distinct elements of the RKHS.
                </p>
              </TheoremBox>
            </Subsection>

            <Subsection title="Maximum Mean Discrepancy">
              <TheoremBox type="theorem" number="4.4" title="MMD as a Metric on Laws">
                <p>
                  The Maximum Mean Discrepancy (MMD) between two 
                  distributions <MathInline>{`P`}</MathInline> and <MathInline>{`Q`}</MathInline> is 
                  defined as [1]
                </p>
                <MathBoxed label="3">{`\\mathrm{MMD}(P,Q) := \\|\\mu_P - \\mu_Q\\|_{\\mathcal{H}}.`}</MathBoxed>
                <p>
                  When the kernel is characteristic, <MathInline>{`\\mathrm{MMD}(P,Q) = 0`}</MathInline> if 
                  and only if <MathInline>{`P = Q`}</MathInline>.
                </p>
              </TheoremBox>
              <p>
                The MMD therefore defines a metric on the space of probability measures, and its empirical 
                estimate provides a natural test statistic for the two-sample problem.
              </p>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 5: Why Paths Break Standard Kernels */}
          {/* ================================================================= */}
          <Section id="curse" number="5" title="Why Paths Break Standard Kernels">
            <p>
              The naive approach to applying kernel methods to time series is to discretise each path 
              at <MathInline>{`N`}</MathInline> time points, thereby embedding the path 
              into <MathInline>{`\\mathbb{R}^{Nd}`}</MathInline>, and then to apply a standard kernel such 
              as the Gaussian RBF kernel.
            </p>
            <p>
              This approach fails for fundamental reasons. As the discretisation becomes 
              finer (<MathInline>{`N \\to \\infty`}</MathInline>), the ambient dimension grows without 
              bound. In high-dimensional Euclidean spaces, distances concentrate: all pairwise distances 
              become nearly equal, and the kernel evaluations degenerate toward a constant. The kernel 
              loses its ability to discriminate between distinct distributions.
            </p>

            <TheoremBox type="critical" number="5.1" title="Fundamental Limitation">
              <p>
                A time series is not a vector. It is a curve with memory. Its essential structure lies 
                in the <em>sequential ordering</em> of its values, including the interactions between 
                increments at different times. Vectorisation discards this sequential structure entirely.
              </p>
              <p>
                What is needed is a kernel that is <em>native to path space</em>: one that respects the 
                sequential, geometric nature of the data.
              </p>
            </TheoremBox>
          </Section>

          {/* ================================================================= */}
          {/* Section 6: Rough Paths and the Signature Transform */}
          {/* ================================================================= */}
          <Section id="signatures" number="6" title="Rough Paths and the Signature Transform">
            <Subsection title="Iterated Integrals">
              <p>
                Given a smooth path <MathInline>{`X : [0,T] \\to \\mathbb{R}^d`}</MathInline>, the 
                first-level iterated integral is simply the total increment:
              </p>
              <MathDisplay>{`X^{(1)} = \\int_0^T dX_t.`}</MathDisplay>
              <p>
                The second-level iterated integral captures the order in which coordinates move:
              </p>
              <MathDisplay>{`X^{(2)} = \\int_{0 < t_1 < t_2 < T} dX_{t_1} \\otimes dX_{t_2}.`}</MathDisplay>
              <p>
                This is a <MathInline>{`d \\times d`}</MathInline> matrix encoding the "signed area" 
                swept out by pairs of coordinates. Higher-order iterated integrals continue this 
                construction, capturing increasingly refined information about the shape and dynamics 
                of the path. Iterated integrals form the algebraic foundation of path signatures [2].
              </p>
            </Subsection>

            <Subsection title="The Signature">
              <TheoremBox type="definition" number="6.1" title="Path Signature">
                <p>
                  The signature of a path <MathInline>{`X`}</MathInline> is the infinite sequence of 
                  all iterated integrals:
                </p>
                <MathBoxed label="4">{`S(X) := \\left(1,\\; X^{(1)},\\; X^{(2)},\\; X^{(3)},\\; \\dots\\right).`}</MathBoxed>
                <p>
                  This is an element of the tensor algebra
                </p>
                <MathDisplay>{`T\\!\\left((\\mathbb{R}^d)\\right) = \\bigoplus_{k=0}^{\\infty} (\\mathbb{R}^d)^{\\otimes k}.`}</MathDisplay>
              </TheoremBox>
              <p>
                The signature is a graded algebraic object: 
                its <MathInline>{`k`}</MathInline>-th level lives in the <MathInline>{`k`}</MathInline>-th 
                tensor power of <MathInline>{`\\mathbb{R}^d`}</MathInline> and encodes all 
                order-<MathInline>{`k`}</MathInline> interactions among the coordinates of the path.
              </p>
            </Subsection>

            <Subsection title="Fundamental Theorem (Informal)">
              <TheoremBox type="theorem" number="6.2" title="Uniqueness of Signature">
                <p>
                  For tree-reduced paths (paths with no exact retracing),
                </p>
                <MathDisplay>{`S(X) = S(Y) \\quad \\Rightarrow \\quad X = Y \\text{ up to reparametrisation}.`}</MathDisplay>
              </TheoremBox>
              <p>
                The signature is therefore a <em>universal and faithful coordinate system for curves</em>. 
                It captures all geometric and sequential information about a path, up to the irrelevant 
                degree of freedom of time reparametrisation [2, 3]. This universality is what makes the 
                signature a natural feature map for nonparametric inference on path space.
              </p>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 7: Lead-Lag Transform */}
          {/* ================================================================= */}
          <Section id="leadlag" number="7" title="The Lead–Lag Transform and Quadratic Variation">
            <p>
              A central quantity in stochastic analysis is the <em>quadratic variation</em> of a process. 
              For Brownian motion <MathInline>{`B_t`}</MathInline>, the quadratic variation satisfies
            </p>
            <MathDisplay>{`\\sum_i (B_{t_{i+1}} - B_{t_i})^2 \\to T`}</MathDisplay>
            <p>as the mesh of the partition tends to zero.</p>
            <p>
              However, when a stochastic process is approximated by piecewise linear interpolation—as 
              is necessary for any discrete dataset—the resulting path has zero quadratic variation. 
              Naive piecewise linear embeddings therefore destroy Lévy area and higher-order geometric 
              information that is essential for distinguishing processes with different volatility structures.
            </p>

            <TheoremBox type="remark" number="7.1" title="Lead–Lag Construction">
              <p>
                The <strong>lead–lag transform</strong> resolves this problem [6, 4]. It constructs artificial 
                loops in a doubled coordinate space by pairing the "leading" and "lagging" versions of 
                the path:
              </p>
              <MathDisplay>{`(X_t^{\\text{lead}},\\; X_t^{\\text{lag}})`}</MathDisplay>
              <p>
                This construction converts quadratic variation—an analytic quantity—into 
                signed area, which is a geometric quantity detected by the second-level signature. 
                These artificial loops generate non-zero Lévy area terms, allowing volatility to 
                be detected from discrete data.
              </p>
            </TheoremBox>

            <p>
              Through the lead–lag transform, volatility becomes geometric, and the signature framework 
              can distinguish processes that differ only in their second-order (volatility) structure.
            </p>
          </Section>

          {/* ================================================================= */}
          {/* Section 8: Signature Kernels and Signature-MMD */}
          {/* ================================================================= */}
          <Section id="sigmmd" number="8" title="Signature Kernels and Signature-MMD">
            <p>
              The ingredients developed in the preceding sections combine into a single inference pipeline:
            </p>
            <MathBoxed label="5">{`\\text{Path} \\;\\to\\; \\text{Signature} \\;\\to\\; \\text{Kernel} \\;\\to\\; \\text{Mean Embedding} \\;\\to\\; \\text{MMD}`}</MathBoxed>
            <p>
              Given a collection of paths, one first computes (truncated) signatures to obtain universal 
              geometric features. A kernel is then defined on signature space—for instance, a linear 
              or Gaussian kernel on truncated signature vectors—yielding a <em>signature kernel</em> on 
              path space. The kernel mean embedding maps the distribution of paths into a reproducing 
              kernel Hilbert space, and the MMD between two such embeddings provides a test statistic.
            </p>

            <TheoremBox type="remark" number="8.1" title="Properties of the Signature-MMD Test">
              <p>
                The resulting test is <strong>nonparametric</strong> (no model assumptions on the 
                data-generating process), <strong>universal</strong> (the signature is a faithful 
                representation of paths), and <strong>distribution-free</strong> under the null hypothesis 
                (via permutation or bootstrap calibration).
              </p>
            </TheoremBox>
          </Section>

          {/* ================================================================= */}
          {/* Section 9: Concrete Research Experiment */}
          {/* ================================================================= */}
          <Section id="experiment" number="9" title="Concrete Research Experiment: GBM vs GBM">
            <p>
              As a concrete illustration of the framework, following the experimental design 
              of Alden et al. [6], consider two populations of paths generated 
              by geometric Brownian motion (GBM) with different volatility parameters. The price 
              process under GBM is given by
            </p>
            <MathBoxed label="6">{`S_t = S_0 \\exp\\!\\left(\\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right)t + \\sigma B_t\\right).`}</MathBoxed>
            <p>
              The key observation is that changing the volatility 
              parameter <MathInline>{`\\sigma`}</MathInline> changes the law of the process, but this 
              change may not be detectable through low-order marginal moments alone. For instance, the 
              mean path may be identical under both parameter regimes.
            </p>
            <p>
              However, the quadratic variation of the log-price process 
              is <MathInline>{`\\sigma^2 T`}</MathInline>, and this is encoded in the second-level 
              signature via the lead–lag transform. The signature-MMD test is therefore capable of 
              detecting differences in volatility structure, even when marginal distributions appear similar.
            </p>

            <TheoremBox type="remark" number="9.1" title="Power of Geometric Features">
              <p>
                This experiment demonstrates the power of the geometric approach: by lifting paths 
                into signature space, one gains access to features—such as quadratic variation and 
                higher-order path interactions—that are invisible to pointwise or moment-based methods.
              </p>
            </TheoremBox>

            <Subsection title="Interpretation Guide">
              <TheoremBox type="remark" number="9.2" title="Reading the Test Output">
                <p>
                  The <strong>p-value</strong> estimates the probability that the observed MMD statistic 
                  could arise under <MathInline>{`H_0`}</MathInline> (i.e., assuming both samples share 
                  the same law). A small p-value provides evidence against the null hypothesis [6].
                </p>
                <p>
                  The <strong>power</strong> of the test is the probability of correctly 
                  rejecting <MathInline>{`H_0`}</MathInline> when <MathInline>{`H_1`}</MathInline> is 
                  true [6]. Increasing the sample size or the signature truncation level increases 
                  the sensitivity of the test.
                </p>
              </TheoremBox>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 10: Assumptions and Failure Modes */}
          {/* ================================================================= */}
          <Section id="assumptions" number="10" title="Assumptions and Failure Modes">
            <Subsection title="Mathematical Assumptions">
              <TheoremBox type="remark" number="10.1" title="Mathematical Requirements">
                <p>
                  The theoretical guarantees of the signature-MMD framework rest on several mathematical 
                  assumptions:
                </p>
                <ol style={{ listStyleType: 'lower-roman', marginTop: '0.5rem' }}>
                  <li>
                    Sample paths must be <em>independent</em> draws from the respective laws.
                  </li>
                  <li>
                    The signature must be computed at a finite <em>truncation level</em>, discarding 
                    information beyond a fixed tensor degree.
                  </li>
                  <li>
                    Paths must be <em>tree-reduced</em> (containing no exact retracing) for the 
                    signature to be injective.
                  </li>
                  <li>
                    The kernel used on signature space must be <em>characteristic</em>, ensuring 
                    that the mean embedding is injective on the space of probability measures.
                  </li>
                </ol>
              </TheoremBox>
            </Subsection>

            <Subsection title="Statistical Assumptions">
              <TheoremBox type="remark" number="10.2" title="Statistical Requirements">
                <p>
                  From the statistical perspective, the validity of the test relies on:
                </p>
                <ol style={{ listStyleType: 'lower-roman', marginTop: '0.5rem' }}>
                  <li>
                    The <em>exchangeability</em> of observations under the null hypothesis.
                  </li>
                  <li>
                    The correctness of the <em>bootstrap</em> or permutation procedure used for calibration [1].
                  </li>
                  <li>
                    The control of <em>finite-sample bias</em> in the empirical estimate of MMD.
                  </li>
                </ol>
              </TheoremBox>
            </Subsection>

            <Subsection title="Computational Considerations">
              <TheoremBox type="critical" number="10.3" title="Computational Challenges">
                <p>
                  Computationally, the signature suffers from <strong>exponential growth</strong>: 
                  the dimension of the level-<MathInline>{`k`}</MathInline> signature 
                  in <MathInline>{`\\mathbb{R}^d`}</MathInline> is <MathInline>{`d^k`}</MathInline>, 
                  which grows rapidly with both the truncation level and the ambient dimension. This 
                  introduces challenges of numerical instability in computing high-level iterated 
                  integrals, as well as truncation error from discarding higher-order terms. In 
                  practice, piecewise linear interpolation is used to approximate continuous paths 
                  from discrete data, and the factorial decay of higher-order signature terms 
                  provides a natural regularisation [6].
                </p>
              </TheoremBox>
            </Subsection>
          </Section>

          {/* ================================================================= */}
          {/* Section 11: Conceptual Unification */}
          {/* ================================================================= */}
          <Section id="unification" number="11" title="Conceptual Unification">
            <p>
              The framework developed in these notes achieves a unification of three mathematical 
              traditions:
            </p>
            <ul>
              <li><strong>Rough path theory</strong>, which provides a universal geometric representation of sequential data through the signature transform.</li>
              <li><strong>Kernel mean embeddings</strong>, which provide a principled method for representing probability measures as elements of a Hilbert space.</li>
              <li><strong>Nonparametric statistics</strong>, which provides distribution-free testing methodology without parametric model assumptions.</li>
            </ul>
            <p>
              Together, these form a single, mathematically coherent framework for statistical 
              inference on random functions.
            </p>
            <blockquote className="research-blockquote">
              <p>We no longer ask: <em>What is the correct stochastic model?</em></p>
              <p>We ask instead: <em>What is the geometry of the law of this random function?</em></p>
            </blockquote>
            <p>
              This reframing—from parametric modelling to geometric representation—opens the door to a 
              fundamentally new kind of statistical reasoning on infinite-dimensional data.
            </p>
          </Section>

          {/* ================================================================= */}
          {/* Optional Advanced Box */}
          {/* ================================================================= */}
          <Section id="outlook" number="12" title="Outlook">
            <TheoremBox type="remark" number="12.1" title="Advanced: Universality of the Framework">
              <p>
                Lyons' theory [2] proves that signatures are universal coordinates for controlled 
                dynamical systems: any continuous function of a path that is invariant to time 
                reparametrisation can be expressed as a function of the signature. Kernel mean 
                embeddings provide a complementary universality, making probability measures into 
                elements of a Hilbert space in a way that preserves all distributional information 
                when the kernel is characteristic [1].
              </p>
              <p>
                Together, these two universality results form the mathematical foundation of a 
                principled theory of inference on infinite-dimensional random geometry—one that 
                requires no parametric assumptions, respects the sequential structure of data, and 
                is equipped with rigorous statistical guarantees.
              </p>
            </TheoremBox>
          </Section>

          {/* ================================================================= */}
          {/* References */}
          {/* ================================================================= */}
          <Section id="references" number="13" title="References">
            <div className="research-references">
              <ol>
                <li>A. Gretton, K. M. Borgwardt, M. J. Rasch, B. Schölkopf, A. Smola, <em>A Kernel Two-Sample Test</em>, Journal of Machine Learning Research, 2012.</li>
                <li>T. Lyons, <em>Differential equations driven by rough signals</em>, Revista Matemática Iberoamericana, 1998.</li>
                <li>I. Chevyrev and H. Oberhauser, <em>A Primer on the Signature Method in Machine Learning</em>, arXiv:1801.03241, 2018.</li>
                <li>P. Friz and N. Victoir, <em>Multidimensional Stochastic Processes as Rough Paths</em>, Cambridge University Press, 2010.</li>
                <li>B. Schölkopf and A. Smola, <em>Learning with Kernels</em>, MIT Press, 2002.</li>
                <li>A. Alden et al., <em>Signature Maximum Mean Discrepancy Two-Sample Statistical Tests</em>, 2024.</li>
              </ol>
            </div>
          </Section>

          {/* Citation Block */}
          <div className="research-citation">
            <h3><Quote size={18} /> Cite This Paper</h3>
            <div className="citation-text">
              <p>Angus Ng (2026). <em>Statistical Inference on Path Space via Rough Paths and Kernel Methods</em>.</p>
              <p>Uncertainty Lab Lecture Notes. v1.0 (Preliminary).</p>
              <p className="url">https://angusmit.github.io/uncertaintylab/publications/statistical-inference-path-space</p>
            </div>
          </div>

          {/* Version Footer */}
          <div className="research-version-footer">
            <p><strong>Version History:</strong> v1.0 (Preliminary) — February 2026</p>
            <p><em>Planned versions:</em> v2.0 (Computational implementation), v3.0 (Financial applications with empirical data)</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}