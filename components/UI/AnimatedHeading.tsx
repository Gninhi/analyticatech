import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  highlightText?: string;
  className?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ 
  text, 
  highlightText, 
  className = "", 
  level = 'h1',
  size = '9xl'
}) => {
  // Création d'une grille de blocs pour l'effet pixel
  const blocks = Array.from({ length: 12 }); // 12 blocs horizontaux

  // Mapping des tailles Tailwind
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl'
  };

  const Tag = level;
  const textSizeClass = sizeClasses[size];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* TEXTE FINAL */}
      <Tag className={`${textSizeClass} font-display font-bold text-slate-900 dark:text-white leading-[0.9] tracking-tighter relative z-10`}>
        <span className="block">{text}</span>
        {highlightText && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-analytica-accent to-orange-400">
            {highlightText}
          </span>
        )}
      </Tag>

      {/* COUCHE DE BLOCS PIXELS (OVERLAY) - Visible dans les deux modes */}
      <div className="absolute inset-0 z-20 flex flex-wrap pointer-events-none mix-blend-hard-light dark:opacity-100 opacity-0">
        {blocks.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 1 }}
            whileInView={{
              scale: 0,
              opacity: 0,
              borderRadius: "50%" // Se transforme en cercle avant de disparaître
            }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.8,
              ease: "circIn",
              delay: i * 0.05 + 0.2 // Effet de vague
            }}
            className="h-1/2 flex-grow bg-analytica-accent border border-slate-900/10 dark:border-white/10"
            style={{
              minWidth: `${100 / 6}%`, // Environ 6 blocs par ligne
              backgroundColor: i % 3 === 0 ? '#F26D3D' : (i % 2 === 0 ? '#03318C' : '#1e293b')
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedHeading;