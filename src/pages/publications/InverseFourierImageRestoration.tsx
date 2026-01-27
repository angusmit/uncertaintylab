/**
 * Publication: Image Restoration by the Inverse Fourier Transform
 * Author: Angus Ng
 * Version: v1.0 (Preliminary)
 * 
 * Publication #1 in Uncertainty Lab - foundational paper for volatility
 * surface estimation, kernel smoothing, and inverse problems.
 * 
 * Uses professional academic typography (research.css)
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Tag, Quote, Copy, Check } from 'lucide-react';
import { MathInline } from '@/components/Math';
import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '@/styles/research.css';

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
// Proof Environment
// =============================================================================

function Proof({ children }: { children: React.ReactNode }) {
  return (
    <div className="research-proof">
      <p className="proof-title">Proof.</p>
      <div className="proof-content">{children}</div>
      <p className="proof-qed">∎</p>
    </div>
  );
}

function ProofStep({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <>
      <p className="proof-step">{step}</p>
      {children}
    </>
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
// Code Block Component
// =============================================================================

function CodeBlock({ caption, children }: { caption: string; children: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="research-code-block">
      <div className="research-code-header">
        <p className="code-caption"><span>Listing:</span> {caption}</p>
        <button onClick={handleCopy} title="Copy code">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="research-code-content">
        <pre><code>{children}</code></pre>
      </div>
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

export default function InverseFourierImageRestoration() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tags = ['Fourier Transform', 'Inverse Problems', 'Signal Processing', 'Kernel Methods', 'Foundations'];

  return (
    <div className="research-theme">
      <div className="research-content">
        {/* Back Link */}
        <Link to="/publications" className="research-back-link">
          <ArrowLeft size={16} />
          Back to Publications
        </Link>

        {/* Context Note */}
        <div className="research-context-note">
          <p>
            <strong>Note:</strong> This paper serves as a mathematical and computational foundation 
            for later work in Uncertainty Lab, including volatility surface estimation, kernel 
            smoothing, and inverse problems in mathematical finance.
          </p>
        </div>

        {/* Paper Header */}
        <header className="research-paper-header">
          <h1>Image Restoration by the Inverse Fourier Transform</h1>
          <p className="author">Angus Ng</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="research-badge research-badge-published">Published (Preliminary)</span>
            <span className="research-badge research-badge-version">v1.0</span>
          </div>
          <p className="meta">2025 • Uncertainty Lab</p>
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
            This report presents the mathematical foundations of image restoration using the Fourier 
            Transform and its inverse. We introduce the linear shift-invariant degradation model, 
            derive the two-dimensional convolution theorem, and explain how inverse filtering in the 
            frequency domain can recover a degraded image. The Discrete Fourier Transform (DFT) and 
            its efficient computation via the Fast Fourier Transform (FFT) algorithm are discussed, 
            along with practical filtering techniques including low-pass and high-pass filters. We 
            analyse the limitations of naive inverse filtering, particularly its instability in the 
            presence of noise when the system transfer function has small magnitude, and discuss the 
            inherent limitations of Fourier-based methods for image processing.
          </p>
        </div>

        {/* ================================================================= */}
        {/* Section 1: Introduction */}
        {/* ================================================================= */}
        <Section id="introduction" number="1" title="Introduction">
          <p>
            The objective of image restoration is to recover an original image from a degraded or 
            distorted observation, such as one corrupted by blur or additive noise [1]. Unlike image 
            enhancement, which aims to improve visual quality subjectively, image restoration seeks 
            to reverse the degradation process based on a mathematical model of how the degradation occurred.
          </p>
          
          <p>In image processing, two complementary approaches exist for filtering operations [2]:</p>
          
          <ol style={{ listStyleType: 'lower-roman' }}>
            <li><strong>Spatial domain filtering:</strong> Direct manipulation of pixel values through convolution with a filter kernel.</li>
            <li><strong>Frequency domain filtering:</strong> Transformation to the frequency domain via the Fourier Transform, multiplication with a transfer function, and inverse transformation back to the spatial domain.</li>
          </ol>
          
          <p>
            The connection between these approaches is established by the <em>Convolution Theorem</em>, 
            which states that convolution in the spatial domain corresponds to pointwise multiplication 
            in the frequency domain. This fundamental result not only provides theoretical insight but 
            also enables computationally efficient filtering when combined with the Fast Fourier Transform algorithm.
          </p>

          <p>
            This report is organised as follows. Section 2 introduces the image degradation model. 
            Section 3 presents the two-dimensional Fourier Transform and derives the Convolution Theorem. 
            Section 4 discusses inverse filtering and its instability. Section 5 covers the Discrete 
            Fourier Transform and FFT. Section 6 demonstrates frequency domain filtering techniques. 
            Section 7 analyses the limitations of Fourier-based methods.
          </p>
        </Section>

        {/* ================================================================= */}
        {/* Section 2: The Image Degradation Model */}
        {/* ================================================================= */}
        <Section id="model" number="2" title="The Image Degradation Model">
          <Subsection title="Linear Shift-Invariant Systems">
            <p>
              Following Zisserman [3], we model image degradation using a linear shift-invariant (LSI) 
              system. The observed (degraded) image <MathInline>{`g(x,y)`}</MathInline> is related to 
              the original image <MathInline>{`f(x,y)`}</MathInline> by:
            </p>

            <MathBoxed label="1">{`g(x, y) = f(x, y) * h(x, y) + n(x, y)`}</MathBoxed>

            <p>where:</p>
            
            <ul>
              <li><MathInline>{`f(x, y)`}</MathInline> is the original (undegraded) image we wish to restore,</li>
              <li><MathInline>{`h(x, y)`}</MathInline> is the <strong>point spread function</strong> (PSF), also called the impulse response,</li>
              <li><MathInline>{`n(x, y)`}</MathInline> is additive noise,</li>
              <li><MathInline>{`*`}</MathInline> denotes two-dimensional convolution.</li>
            </ul>

            <p>The convolution operation is defined explicitly as:</p>

            <MathDisplay>{`(f * h)(x, y) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(x', y') \\, h(x - x', y - y') \\, dx' \\, dy'`}</MathDisplay>

            <TheoremBox type="definition" number="2.1" title="Point Spread Function">
              <p>
                The <strong>point spread function</strong> (PSF) describes how an imaging system responds 
                to an ideal point source [4]. If the input is a Dirac delta function <MathInline>{`\\delta(x, y)`}</MathInline>, 
                the output is <MathInline>{`h(x, y)`}</MathInline>. The PSF characterises the blurring introduced 
                by factors such as optical imperfections, motion blur, or defocus.
              </p>
            </TheoremBox>

            <TheoremBox type="remark" number="2.2">
              <p>The degradation model (1) assumes:</p>
              <ol style={{ listStyleType: 'lower-alpha', marginTop: '0.5rem' }}>
                <li><strong>Linearity:</strong> The system response to a sum of inputs equals the sum of individual responses.</li>
                <li><strong>Shift-invariance:</strong> The PSF depends only on relative position <MathInline>{`(x - x', y - y')`}</MathInline>, not on absolute position in the image.</li>
              </ol>
              <p style={{ marginTop: '0.75rem' }}>
                These assumptions provide a tractable mathematical framework, though they may not hold 
                exactly for all imaging systems (e.g., spatially varying blur).
              </p>
            </TheoremBox>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 3: Fourier Transform and Convolution Theorem */}
        {/* ================================================================= */}
        <Section id="fourier" number="3" title="The Fourier Transform and the Convolution Theorem">
          <Subsection title="The Two-Dimensional Fourier Transform">
            <TheoremBox type="definition" number="3.1" title="2-D Continuous Fourier Transform">
              <p>
                For an integrable function <MathInline>{`f(x, y)`}</MathInline>, the <strong>two-dimensional 
                Fourier Transform</strong> is defined as [2]:
              </p>
              <MathDisplay>{`F(u, v) = \\mathcal{F}\\{f\\}(u, v) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(x, y) \\, e^{-i2\\pi(ux + vy)} \\, dx\\,dy`}</MathDisplay>
              <p>where <MathInline>{`(u, v)`}</MathInline> are the <strong>spatial frequency</strong> coordinates.</p>
            </TheoremBox>

            <TheoremBox type="definition" number="3.2" title="Inverse 2-D Fourier Transform">
              <p>
                The <strong>inverse Fourier Transform</strong> recovers <MathInline>{`f(x, y)`}</MathInline> from 
                its frequency representation:
              </p>
              <MathDisplay>{`f(x, y) = \\mathcal{F}^{-1}\\{F\\}(x, y) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} F(u, v) \\, e^{+i2\\pi(ux + vy)} \\, du\\,dv`}</MathDisplay>
            </TheoremBox>

            <p>
              The Fourier Transform decomposes an image into its constituent spatial frequencies. 
              Low frequencies correspond to slowly varying intensity (smooth regions), while high 
              frequencies correspond to rapid intensity changes (edges and fine details).
            </p>
          </Subsection>

          <Subsection title="Derivation of the Convolution Theorem">
            <p>
              The Convolution Theorem establishes a fundamental relationship between convolution in 
              the spatial domain and multiplication in the frequency domain. We first establish that 
              the convolution of two integrable functions is well-defined.
            </p>

            <TheoremBox type="lemma" number="3.3" title="Young's Inequality">
              <p>
                If <MathInline>{`f, h \\in L^1(\\mathbb{R}^2)`}</MathInline>, then <MathInline>{`f * h \\in L^1(\\mathbb{R}^2)`}</MathInline> and
              </p>
              <MathDisplay>{`\\|f * h\\|_1 \\leq \\|f\\|_1 \\|h\\|_1`}</MathDisplay>
            </TheoremBox>

            <TheoremBox type="theorem" number="3.4" title="Convolution Theorem in 2-D">
              <p>
                Let <MathInline>{`f, h \\in L^1(\\mathbb{R}^2)`}</MathInline> with Fourier Transforms <MathInline>{`F(u,v)`}</MathInline> and <MathInline>{`H(u,v)`}</MathInline> respectively. 
                If <MathInline>{`g = f * h`}</MathInline>, then:
              </p>
              <MathBoxed label="2">{`G(u, v) = F(u, v) \\cdot H(u, v)`}</MathBoxed>
              <p>where <MathInline>{`G(u,v) = \\mathcal{F}\\{g\\}(u,v)`}</MathInline>.</p>
            </TheoremBox>

            <Proof>
              <p>
                By Lemma 3.3, the convolution <MathInline>{`g = f * h`}</MathInline> exists and <MathInline>{`g \\in L^1(\\mathbb{R}^2)`}</MathInline>, 
                so the Fourier Transform of <MathInline>{`g`}</MathInline> is well-defined. We compute <MathInline>{`G(u,v) = \\mathcal{F}\\{g\\}(u,v)`}</MathInline>.
              </p>

              <ProofStep step="Step 1: Apply the Fourier Transform definition.">
                <MathDisplay>{`G(u, v) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} g(x, y) \\, e^{-i2\\pi(ux + vy)} \\, dx\\,dy`}</MathDisplay>
                <MathDisplay>{`= \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} \\left( \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(\\xi, \\eta) \\, h(x - \\xi, y - \\eta) \\, d\\xi \\, d\\eta \\right) e^{-i2\\pi(ux + vy)} \\, dx\\,dy`}</MathDisplay>
              </ProofStep>

              <ProofStep step="Step 2: Fubini–Tonelli Justification.">
                <p>Since</p>
                <MathDisplay>{`\\int_{\\mathbb{R}^4} |f(\\xi,\\eta) \\, h(x-\\xi, y-\\eta)| \\, d\\xi\\,d\\eta\\,dx\\,dy = \\|f\\|_1 \\|h\\|_1 < \\infty`}</MathDisplay>
                <p>(by translation invariance of Lebesgue measure), Fubini's theorem applies and the order of integration may be exchanged:</p>
                <MathDisplay>{`G(u, v) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(\\xi, \\eta) \\left( \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} h(x - \\xi, y - \\eta) \\, e^{-i2\\pi(ux + vy)} \\, dx\\,dy \\right) d\\xi\\,d\\eta`}</MathDisplay>
              </ProofStep>

              <ProofStep step="Step 3: Change of variables.">
                <p>
                  In the inner integral, substitute <MathInline>{`\\alpha = x - \\xi`}</MathInline> and <MathInline>{`\\beta = y - \\eta`}</MathInline>, 
                  so that <MathInline>{`x = \\alpha + \\xi`}</MathInline> and <MathInline>{`y = \\beta + \\eta`}</MathInline>. 
                  The Jacobian of this transformation is unity, so <MathInline>{`dx\\,dy = d\\alpha\\,d\\beta`}</MathInline>. The inner integral becomes:
                </p>
                <MathDisplay>{`\\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} h(\\alpha, \\beta) \\, e^{-i2\\pi(u(\\alpha + \\xi) + v(\\beta + \\eta))} \\, d\\alpha\\,d\\beta`}</MathDisplay>
                <MathDisplay>{`= \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} h(\\alpha, \\beta) \\, e^{-i2\\pi(u\\alpha + v\\beta)} \\, d\\alpha\\,d\\beta \\cdot e^{-i2\\pi(u\\xi + v\\eta)}`}</MathDisplay>
                <MathDisplay>{`= H(u, v) \\cdot e^{-i2\\pi(u\\xi + v\\eta)}`}</MathDisplay>
                <p>where <MathInline>{`H(u, v) = \\mathcal{F}\\{h\\}(u, v)`}</MathInline> is the Fourier Transform of <MathInline>{`h`}</MathInline>.</p>
              </ProofStep>

              <ProofStep step="Step 4: Substitute back and simplify.">
                <MathDisplay>{`G(u, v) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(\\xi, \\eta) \\cdot H(u, v) \\cdot e^{-i2\\pi(u\\xi + v\\eta)} \\, d\\xi\\,d\\eta`}</MathDisplay>
                <MathDisplay>{`= H(u, v) \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} f(\\xi, \\eta) \\, e^{-i2\\pi(u\\xi + v\\eta)} \\, d\\xi\\,d\\eta`}</MathDisplay>
                <MathDisplay>{`= H(u, v) \\cdot F(u, v)`}</MathDisplay>
                <p>This completes the proof.</p>
              </ProofStep>
            </Proof>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 4: Inverse Filtering */}
        {/* ================================================================= */}
        <Section id="inverse" number="4" title="Inverse Filtering in the Frequency Domain">
          <Subsection title="Frequency Domain Representation">
            <p>
              Taking the Fourier Transform of the degradation model (1) and applying the Convolution 
              Theorem (2) together with the linearity of the Fourier Transform:
            </p>
            <MathDisplay>{`G(u, v) = F(u, v) \\cdot H(u, v) + N(u, v)`}</MathDisplay>
            <p>where <MathInline>{`N(u, v) = \\mathcal{F}\\{n\\}(u, v)`}</MathInline> is the Fourier Transform of the noise.</p>
          </Subsection>

          <Subsection title="Ideal Inverse Filtering">
            <p>
              In the idealised case where noise is absent (<MathInline>{`N(u, v) = 0`}</MathInline>), 
              we can solve for the original image spectrum:
            </p>
            <MathBoxed label="3">{`F(u, v) = \\frac{G(u, v)}{H(u, v)}`}</MathBoxed>
            <p>provided that <MathInline>{`H(u, v) \\neq 0`}</MathInline>. The restored image is then obtained via the inverse Fourier Transform:</p>
            <MathDisplay>{`\\hat{f}(x, y) = \\mathcal{F}^{-1}\\left\\{ \\frac{G(u, v)}{H(u, v)} \\right\\}`}</MathDisplay>
            <p>
              The function <MathInline>{`H(u, v)`}</MathInline> is called the <strong>optical transfer function</strong> (OTF) 
              or system transfer function [3].
            </p>
          </Subsection>

          <Subsection title="Instability of Naive Inverse Filtering">
            <p>When noise is present, the inverse filter estimate becomes:</p>
            <MathDisplay>{`\\frac{G(u, v)}{H(u, v)} = F(u, v) + \\frac{N(u, v)}{H(u, v)}`}</MathDisplay>
            <p>
              This reveals a critical problem: at frequencies where <MathInline>{`|H(u, v)|`}</MathInline> is 
              small or approaches zero, the noise term <MathInline>{`N(u, v)/H(u, v)`}</MathInline> can become 
              arbitrarily large, even if the noise magnitude <MathInline>{`|N(u, v)|`}</MathInline> is small [3].
            </p>

            <TheoremBox type="critical" number="4.1" title="Noise Amplification Problem">
              <p>
                The naive inverse filter (3) is <strong>ill-conditioned</strong> when <MathInline>{`H(u, v)`}</MathInline> has 
                zeros or near-zeros. Specifically:
              </p>
              <MathDisplay>{`\\left| \\frac{N(u, v)}{H(u, v)} \\right| \\to \\infty \\quad \\text{as} \\quad |H(u, v)| \\to 0`}</MathDisplay>
              <p>
                This causes severe noise amplification that can completely dominate the restored image, 
                making naive inverse filtering impractical for real-world applications where noise is always present.
              </p>
            </TheoremBox>

            <p>
              Many common PSFs have zeros in their frequency response. For example, motion blur and 
              out-of-focus blur both produce transfer functions with zeros at certain frequencies. 
              This makes direct inverse filtering particularly problematic for these types of degradation.
            </p>

            <p>
              To address this instability, regularised restoration methods such as the Wiener filter 
              incorporate prior knowledge about the signal and noise characteristics to balance 
              deconvolution against noise suppression [3].
            </p>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 5: DFT and FFT */}
        {/* ================================================================= */}
        <Section id="discrete" number="5" title="Discrete Fourier Transform and the FFT Algorithm">
          <Subsection title="The Discrete Fourier Transform">
            <p>
              For digital images represented as discrete samples, we use the Discrete Fourier 
              Transform (DFT) [6]. The DFT is the appropriate transform for signals known only 
              at discrete sample points.
            </p>

            <TheoremBox type="definition" number="5.1" title="1-D Discrete Fourier Transform">
              <p>
                For a sequence <MathInline>{`f[n]`}</MathInline> of <MathInline>{`N`}</MathInline> samples 
                where <MathInline>{`n = 0, 1, \\ldots, N-1`}</MathInline>, the <strong>Discrete Fourier Transform</strong> is:
              </p>
              <MathBoxed>{`F[k] = \\sum_{n=0}^{N-1} f[n] \\, e^{-2\\pi i k n / N}, \\quad k = 0, 1, \\ldots, N-1`}</MathBoxed>
            </TheoremBox>

            <TheoremBox type="definition" number="5.2" title="Inverse DFT">
              <p>The <strong>Inverse Discrete Fourier Transform</strong> recovers the original sequence:</p>
              <MathBoxed>{`f[n] = \\frac{1}{N} \\sum_{k=0}^{N-1} F[k] \\, e^{2\\pi i k n / N}, \\quad n = 0, 1, \\ldots, N-1`}</MathBoxed>
            </TheoremBox>

            <TheoremBox type="remark" number="5.3">
              <p>
                The normalisation factor <MathInline>{`1/N`}</MathInline> can alternatively be placed in 
                the forward transform or split as <MathInline>{`1/\\sqrt{N}`}</MathInline> in both transforms. 
                The convention used here follows Roberts [6].
              </p>
            </TheoremBox>

            <p>For two-dimensional images, the 2-D DFT is applied separably along rows and columns:</p>
            <MathDisplay>{`F[k, l] = \\sum_{m=0}^{M-1} \\sum_{n=0}^{N-1} f[m, n] \\, e^{-2\\pi i (km/M + ln/N)}`}</MathDisplay>
            <p>for an <MathInline>{`M \\times N`}</MathInline> image.</p>
          </Subsection>

          <Subsection title="The Fast Fourier Transform">
            <p>
              Direct computation of the DFT requires <MathInline>{`O(N^2)`}</MathInline> complex 
              multiplications and additions for a sequence of length <MathInline>{`N`}</MathInline>. 
              The <strong>Fast Fourier Transform</strong> (FFT) is a class of algorithms that compute 
              the DFT more efficiently [2, 6].
            </p>

            <p>
              The key insight is that the DFT of length <MathInline>{`N`}</MathInline> can be decomposed 
              into smaller DFTs. The most common approach, the Cooley-Tukey algorithm, recursively splits 
              an <MathInline>{`N`}</MathInline>-point DFT into two <MathInline>{`N/2`}</MathInline>-point 
              DFTs—one for even-indexed samples and one for odd-indexed samples:
            </p>
            <MathDisplay>{`F[k] = F_{\\text{even}}[k] + W_N^k \\cdot F_{\\text{odd}}[k]`}</MathDisplay>
            <p>where <MathInline>{`W_N = e^{-2\\pi i/N}`}</MathInline> is the primitive <MathInline>{`N`}</MathInline>-th root of unity.</p>

            <TheoremBox type="remark" number="5.4" title="Computational Complexity">
              <p>
                When <MathInline>{`N`}</MathInline> is a power of 2, the FFT typically achieves <MathInline>{`O(N \\log N)`}</MathInline> complexity, 
                compared to <MathInline>{`O(N^2)`}</MathInline> for direct DFT computation. For a 2-D image of 
                size <MathInline>{`N \\times N`}</MathInline>, this reduces the complexity from <MathInline>{`O(N^4)`}</MathInline> to 
                typically <MathInline>{`O(N^2 \\log N)`}</MathInline>. This dramatic improvement makes frequency domain 
                processing practical for large images [6].
              </p>
            </TheoremBox>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 6: Frequency Domain Filtering */}
        {/* ================================================================= */}
        <Section id="filtering" number="6" title="Frequency Domain Filtering">
          <Subsection title="Low-Pass and High-Pass Filters">
            <p>Frequency domain filters modify the spectrum of an image by attenuating or preserving certain frequency components [9].</p>

            <TheoremBox type="definition" number="6.1" title="Low-Pass Filter">
              <p>
                A <strong>low-pass filter</strong> preserves low spatial frequencies while attenuating 
                high frequencies. Since high frequencies correspond to rapid intensity variations (edges, 
                fine details), low-pass filtering produces a <strong>smoothing</strong> or <strong>blurring</strong> effect.
              </p>
            </TheoremBox>

            <TheoremBox type="definition" number="6.2" title="High-Pass Filter">
              <p>
                A <strong>high-pass filter</strong> preserves high spatial frequencies while attenuating 
                low frequencies. Since low frequencies correspond to slowly varying intensity (smooth regions), 
                high-pass filtering produces an <strong>edge enhancement</strong> or <strong>sharpening</strong> effect.
              </p>
            </TheoremBox>

            <p>An ideal low-pass filter with cutoff frequency <MathInline>{`D_0`}</MathInline> is defined as:</p>
            <MathDisplay>{`H_{\\text{LP}}(u, v) = \\begin{cases} 1, & \\text{if } \\sqrt{u^2 + v^2} \\leq D_0, \\\\ 0, & \\text{otherwise}, \\end{cases}`}</MathDisplay>
            <p>and the complementary ideal high-pass filter is:</p>
            <MathDisplay>{`H_{\\text{HP}}(u, v) = 1 - H_{\\text{LP}}(u, v)`}</MathDisplay>
          </Subsection>

          <Subsection title="Filtering Workflow">
            <p>The standard workflow for frequency domain filtering consists of the following steps [7]:</p>
            <ol>
              <li><strong>Compute the FFT:</strong> Transform the image to the frequency domain.</li>
              <li><strong>Shift the spectrum:</strong> Centre the zero-frequency component using <code>fftshift</code> for convenient filter design.</li>
              <li><strong>Apply the filter:</strong> Multiply the centred spectrum by the filter mask <MathInline>{`H(u,v)`}</MathInline>.</li>
              <li><strong>Inverse shift:</strong> Decentralise using <code>ifftshift</code>.</li>
              <li><strong>Compute the inverse FFT:</strong> Transform back to the spatial domain.</li>
            </ol>
          </Subsection>

          <Subsection title="Python Implementation Example">
            <CodeBlock caption="Frequency domain filtering with FFT">{`import numpy as np
import cv2

def ideal_lowpass_filter(shape, D0):
    """Create an ideal low-pass filter mask."""
    rows, cols = shape
    crow, ccol = rows // 2, cols // 2
    mask = np.zeros((rows, cols), dtype=np.float32)
    for i in range(rows):
        for j in range(cols):
            if np.sqrt((i - crow)**2 + (j - ccol)**2) <= D0:
                mask[i, j] = 1
    return mask

def apply_frequency_filter(image, filter_mask):
    """Apply a frequency domain filter to an image."""
    # Step 1: Compute FFT
    f_transform = np.fft.fft2(image)
    # Step 2: Shift zero-frequency to centre
    f_centered = np.fft.fftshift(f_transform)
    # Step 3: Apply filter
    filtered = f_centered * filter_mask
    # Step 4: Inverse shift
    f_ishift = np.fft.ifftshift(filtered)
    # Step 5: Inverse FFT
    img_restored = np.fft.ifft2(f_ishift)
    return np.abs(img_restored)

# Example usage
img = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)
lp_mask = ideal_lowpass_filter(img.shape, D0=50)
smoothed = apply_frequency_filter(img, lp_mask)`}</CodeBlock>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 7: Limitations */}
        {/* ================================================================= */}
        <Section id="limitations" number="7" title="Limitations of Fourier-Based Methods">
          <p>
            While the Fourier Transform provides a powerful framework for image processing, 
            several limitations must be understood [5, 8].
          </p>

          <Subsection title="Noise Sensitivity in Inverse Filtering">
            <p>
              As discussed in Section 4, naive inverse filtering amplifies noise at frequencies where 
              the system transfer function <MathInline>{`H(u,v)`}</MathInline> has small magnitude. 
              This instability makes direct inverse filtering impractical when noise is present, 
              necessitating regularised approaches.
            </p>
          </Subsection>

          <Subsection title="Global Basis Functions and Spatial Localisation">
            <p>
              The Fourier basis functions (complex exponentials) extend over the entire spatial domain. 
              This has an important consequence: the Fourier Transform reveals <em>which</em> frequencies 
              are present in a signal but provides no information about <em>where</em> those frequencies 
              occur spatially [5].
            </p>
            <p>
              For images with localised features such as edges or transient structures, this means that 
              a single localised discontinuity will affect coefficients across the entire frequency 
              spectrum. The Fourier Transform is therefore less suitable for analysing signals with 
              spatially varying frequency content.
            </p>
          </Subsection>

          <Subsection title="Periodicity Assumption of the DFT">
            <p>
              The DFT implicitly treats the input signal as one period of an infinite periodic sequence. 
              For finite images that are not naturally periodic, this assumption can cause <strong>boundary 
              artefacts</strong>—the left edge of the image is effectively adjacent to the right edge, 
              and similarly for top and bottom.
            </p>
            <p>
              These artefacts manifest as spurious high-frequency components (the Gibbs phenomenon) and 
              can affect filtering results near image boundaries. Common mitigation strategies include 
              zero-padding, windowing, or symmetric extension of the image.
            </p>
          </Subsection>

          <Subsection title="Continuous Fourier Transform and Non-Periodic Signals">
            <p>
              It should be noted that the <em>continuous</em> Fourier Transform does not require 
              periodicity—it is well-defined for any integrable function on <MathInline>{`\\mathbb{R}^2`}</MathInline>. 
              The periodicity issue arises specifically from the discrete sampling and finite extent 
              inherent to the DFT, not from the Fourier Transform concept itself [8].
            </p>
          </Subsection>
        </Section>

        {/* ================================================================= */}
        {/* Section 8: Conclusion */}
        {/* ================================================================= */}
        <Section id="conclusion" number="8" title="Conclusion">
          <p>
            This report has presented the mathematical foundations of image restoration using the 
            Fourier Transform. The key results include:
          </p>
          <ul>
            <li>The linear shift-invariant degradation model: <MathInline>{`g(x,y) = f(x,y) * h(x,y) + n(x,y)`}</MathInline>.</li>
            <li>The Convolution Theorem: convolution in the spatial domain corresponds to multiplication in the frequency domain, i.e., <MathInline>{`G(u,v) = F(u,v) \\cdot H(u,v)`}</MathInline>.</li>
            <li>Inverse filtering: in principle, <MathInline>{`F(u,v) = G(u,v)/H(u,v)`}</MathInline>, but this is unstable when <MathInline>{`H(u,v)`}</MathInline> is small due to noise amplification.</li>
            <li>The FFT algorithm enables efficient computation of the DFT, typically reducing complexity from <MathInline>{`O(N^2)`}</MathInline> to <MathInline>{`O(N \\log N)`}</MathInline>.</li>
          </ul>
          <p>
            Understanding both the power and limitations of Fourier-based methods is essential for 
            effective image restoration and processing.
          </p>
        </Section>

        {/* ================================================================= */}
        {/* References */}
        {/* ================================================================= */}
        <Section id="references" number="9" title="References">
          <div className="research-references">
            <ol>
              <li>K. Acharjya, <em>Image Restoration</em>, Available at: <a href="https://bit.ly/34dendc" target="_blank" rel="noopener noreferrer">https://bit.ly/34dendc</a></li>
              <li>V. Hlaváč, <em>Fourier Transform in 1D and in 2D</em>, Available at: <a href="http://www.robots.ox.ac.uk/~sjrob/Teaching/SP/l7.pdf" target="_blank" rel="noopener noreferrer">http://www.robots.ox.ac.uk/~sjrob/Teaching/SP/l7.pdf</a></li>
              <li>A. Zisserman, <em>Image Restoration</em>, Available at: <a href="http://www.robots.ox.ac.uk/~az/lectures/ia/lect3.pdf" target="_blank" rel="noopener noreferrer">http://www.robots.ox.ac.uk/~az/lectures/ia/lect3.pdf</a></li>
              <li>CosmoStat, <em>PSF Estimation and Image Restoration</em>, Available at: <a href="https://www.cosmostat.org/research-topics/psf/" target="_blank" rel="noopener noreferrer">https://www.cosmostat.org/research-topics/psf/</a></li>
              <li>J. M. Buhmann, <em>Image Processing and Computer Vision</em>, Available at: <a href="http://people.inf.ethz.ch/pomarc/courses/VisualComputing/viscompMP01.pdf" target="_blank" rel="noopener noreferrer">http://people.inf.ethz.ch/pomarc/courses/VisualComputing/viscompMP01.pdf</a></li>
              <li>S. Roberts, <em>The Discrete Fourier Transform</em>, Available at: <a href="http://www.robots.ox.ac.uk/~sjrob/Teaching/SP/l7.pdf" target="_blank" rel="noopener noreferrer">http://www.robots.ox.ac.uk/~sjrob/Teaching/SP/l7.pdf</a></li>
              <li>C. Chen, <em>Digital Image Processing using Fourier Transform in Python</em>, Available at: <a href="https://bit.ly/324Dzj7" target="_blank" rel="noopener noreferrer">https://bit.ly/324Dzj7</a></li>
              <li>Tutorialspoint, <em>Fourier Transforms</em>, Available at: <a href="https://bit.ly/3g7Wtuw" target="_blank" rel="noopener noreferrer">https://bit.ly/3g7Wtuw</a></li>
              <li>T. C. O'Haver, <em>A Pragmatic Introduction to Signal Processing</em>, Available at: <a href="https://terpconnect.umd.edu/~toh/spectrum/Smoothing.html" target="_blank" rel="noopener noreferrer">https://terpconnect.umd.edu/~toh/spectrum/Smoothing.html</a></li>
            </ol>
          </div>
        </Section>

        {/* Citation Block */}
        <div className="research-citation">
          <h3><Quote size={18} /> Cite This Paper</h3>
          <div className="citation-text">
            <p>Angus Ng (2025). <em>Image Restoration by the Inverse Fourier Transform</em>.</p>
            <p>Uncertainty Lab. v1.0 (Preliminary).</p>
            <p className="url">https://angusmit.github.io/uncertaintylab/publications/inverse-fourier-image-restoration</p>
          </div>
        </div>

        {/* Version Footer */}
        <div className="research-version-footer">
          <p><strong>Version History:</strong> v1.0 (Preliminary) — January 2025</p>
          <p><em>Planned versions:</em> v2.0 (Finance-adapted), v3.0 (Rough volatility applications)</p>
        </div>
      </div>
    </div>
  );
}