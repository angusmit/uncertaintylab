/**
 * ResearchLayout - Light-themed wrapper for research/publication pages
 * 
 * This component applies the professional academic typography and color
 * system to publication and methods pages while keeping the main app
 * dark-themed.
 */

import { ReactNode } from 'react';
import '@/styles/research.css';

interface ResearchLayoutProps {
  children: ReactNode;
}

export function ResearchLayout({ children }: ResearchLayoutProps) {
  return (
    <div className="research-theme">
      <div className="research-content">
        {children}
      </div>
    </div>
  );
}

export default ResearchLayout;