/**
 * Insights / Recent Publications — Landing Page Section
 * 
 * Reads from the shared publications data source.
 * Automatically shows the 3 most recent papers (published + working).
 * Featured card = first published paper; secondary cards = next two.
 */

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publishedPapers, workingPapers, type PublicationData } from '@/data/publications';

// Take the 3 most recent papers for the landing page
// Priority: published first, then working papers
function getRecentPublications(): PublicationData[] {
  const all = [...publishedPapers, ...workingPapers];
  return all.slice(0, 3);
}

export default function Insights() {
  const navigate = useNavigate();
  const publications = getRecentPublications();

  const handleClick = (pub: PublicationData) => {
    if (pub.status === 'published' && pub.link) {
      navigate(pub.link);
    }
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/publications');
  };

  const featured = publications[0];
  const secondary = publications.slice(1);

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
            href="/publications"
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
          >
            View all publications
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Article */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`glass-card-hover p-8 lg:row-span-2 flex flex-col justify-between group ${
                featured.link ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleClick(featured)}
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-6">
                  {featured.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {featured.abstract}
                </p>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                {featured.date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featured.date}
                  </span>
                )}
                {featured.readTime && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featured.readTime}
                  </span>
                )}
                {featured.status === 'published' && featured.link && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium ml-auto">
                    Read paper <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </motion.article>
          )}

          {/* Secondary Articles */}
          {secondary.map((pub, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`glass-card-hover p-6 group ${pub.link ? 'cursor-pointer' : ''}`}
              onClick={() => handleClick(pub)}
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary mb-4">
                {pub.category}
              </span>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {pub.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {pub.abstract}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {pub.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {pub.date}
                  </span>
                )}
                {pub.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {pub.readTime}
                  </span>
                )}
                {pub.status === 'published' && pub.link && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium ml-auto">
                    Read <ArrowUpRight className="w-3 h-3" />
                  </span>
                )}
                {pub.status !== 'published' && (
                  <span className="text-yellow-400/70 ml-auto text-xs">
                    {pub.status === 'in-preparation' ? 'In preparation' : 'Working paper'}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}