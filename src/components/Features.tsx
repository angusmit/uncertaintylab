import { motion } from 'framer-motion';
import { 
  LineChart, 
  Brain, 
  Gauge, 
  FlaskConical, 
  Code2, 
  BookOpen 
} from 'lucide-react';

const features = [
  {
    icon: LineChart,
    title: 'Black-Scholes & Beyond',
    description: 'From classical closed-form solutions to advanced stochastic volatility frameworks like Heston and SABR.',
  },
  {
    icon: Brain,
    title: 'Numerical Methods',
    description: 'Finite differences, Monte Carlo simulation, and kernel regression for surface interpolation.',
  },
  {
    icon: Gauge,
    title: 'Model Calibration',
    description: 'Implied volatility inversion, surface fitting diagnostics, and parameter estimation routines.',
  },
  {
    icon: FlaskConical,
    title: 'Reproducible Experiments',
    description: 'Synthetic data generation, controlled experiments, and benchmark comparisons.',
  },
  {
    icon: Code2,
    title: 'Open Source',
    description: 'Clean, documented code with Python backend and React frontend. MIT licensed.',
  },
  {
    icon: BookOpen,
    title: 'Educational Focus',
    description: 'Designed for learning, teaching, and research in mathematical finance.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section id="research" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Research <span className="gradient-text">Capabilities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for computational experiments 
            in derivatives pricing and volatility modelling.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card-hover p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}