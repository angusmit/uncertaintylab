import { FlaskConical, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Research: [
    { label: 'Explore', href: '/explore' },
    { label: 'Methods', href: '/methods' },
    { label: 'Publications', href: '/publications' },
    { label: 'About', href: '/about' },
  ],
  Tools: [
    { label: 'Data Import', href: '/app/data' },
    { label: 'Vol Surface', href: '/app/surface' },
    { label: 'Pricer', href: '/app/pricer' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-border/50">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-semibold">
                <span className="gradient-text">Uncertainty</span>
                <span> Lab</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              A computational laboratory for mathematical finance. 
              Research tools for volatility surfaces, implied volatility, 
              and uncertainty modelling.
            </p>
            <p className="text-xs text-muted-foreground italic mb-6">
              For academic and research purposes only. Not financial advice.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/angusmit/uncertaintylab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:research@uncertaintylab.io"
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Uncertainty Lab. A personal research platform by Angus.
          </p>
          <p className="text-xs text-muted-foreground">
            Computational laboratory for mathematical finance
          </p>
        </div>
      </div>
    </footer>
  );
}