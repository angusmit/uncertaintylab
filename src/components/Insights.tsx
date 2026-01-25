import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

const publications = [
  {
    category: 'Methodology',
    title: 'Kernel Regression for Volatility Surface Interpolation',
    excerpt: 'A practical guide to Nadaraya-Watson estimation with bandwidth selection for implied volatility surfaces.',
    date: 'Jan 15, 2024',
    readTime: '8 min',
    featured: true,
  },
  {
    category: 'Numerical',
    title: 'Newton-Raphson vs Brent for IV Inversion',
    excerpt: 'Comparing root-finding algorithms for implied volatility computation: speed, stability, and edge cases.',
    date: 'Jan 10, 2024',
    readTime: '12 min',
    featured: false,
  },
  {
    category: 'Tutorial',
    title: 'Monte Carlo Convergence Diagnostics',
    excerpt: 'Standard errors, confidence intervals, and path-dependency in option price estimation.',
    date: 'Jan 5, 2024',
    readTime: '15 min',
    featured: false,
  },
];

export default function Insights() {
  return (
    <section id="insights" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Recent <span className="gradient-text">Publications</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Technical notes, tutorials, and methodology documentation.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
          >
            View all publications
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card-hover p-8 lg:row-span-2 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-6">
                {publications[0].category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                {publications[0].title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {publications[0].excerpt}
              </p>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {publications[0].date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {publications[0].readTime}
              </span>
            </div>
          </motion.article>

          {/* Secondary Articles */}
          {publications.slice(1).map((pub, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary mb-4">
                {pub.category}
              </span>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {pub.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {pub.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {pub.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {pub.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}