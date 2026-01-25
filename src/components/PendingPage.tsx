/**
 * PendingPage - Placeholder for sections under development
 * 
 * A reusable component for pages that are not yet implemented,
 * styled in an academic research tone.
 */

import { motion } from 'framer-motion';
import { FlaskConical, Beaker, Microscope, BookOpen, Construction } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PendingPageProps {
  title: string;
  description?: string;
  roadmap?: string[];
  icon?: 'flask' | 'beaker' | 'microscope' | 'book' | 'construction';
}

const icons = {
  flask: FlaskConical,
  beaker: Beaker,
  microscope: Microscope,
  book: BookOpen,
  construction: Construction,
};

export default function PendingPage({
  title,
  description = 'This section is under active research and development.',
  roadmap,
  icon = 'flask',
}: PendingPageProps) {
  const Icon = icons[icon];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="glass-card text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base mt-2">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              This component of Uncertainty Lab is currently being developed as part of ongoing 
              research into computational methods for mathematical finance. The implementation 
              follows rigorous numerical and statistical standards to ensure reproducibility 
              and scientific validity.
            </p>

            {roadmap && roadmap.length > 0 && (
              <div className="text-left">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Development Roadmap
                </h4>
                <ul className="space-y-2">
                  {roadmap.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                For inquiries about this research, please contact the author.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}