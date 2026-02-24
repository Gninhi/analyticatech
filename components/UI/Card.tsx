
import React, { memo } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noSpotlight?: boolean;
  variant?: 'tech' | 'ghost'; 
  onClick?: () => void;
}

const Card: React.FC<CardProps> = memo(({ 
  children, 
  className = '', 
  delay = 0, 
  noSpotlight = false,
  variant = 'tech',
  onClick
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (noSpotlight || variant === 'ghost') return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const baseStyles = "relative group overflow-hidden transition-all duration-500 h-full flex flex-col transform-gpu";
  
  // STYLE CRYSTAL DARK MODE ENHANCED :
  // Dark: Fond quasi-noir (Gray 950) à 70% d'opacité pour plus de profondeur
  // Light: Fond White à 70%
  const variantStyles = variant === 'tech' ? `
    bg-white/70 dark:bg-[#030712]/70 
    border border-slate-200 dark:border-white/10
    rounded-[24px]
    shadow-premium dark:shadow-premium-dark
    hover:border-analytica-accent/40 dark:hover:border-analytica-accent/40
    hover:shadow-premium-hover dark:hover:shadow-glow
    backdrop-blur-xl
  ` : "bg-transparent border-none shadow-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
      tabIndex={onClick ? 0 : -1}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {/* Texture noise subtile */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
      
      {!noSpotlight && variant === 'tech' && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-500 group-hover:opacity-100 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                500px circle at ${mouseX}px ${mouseY}px,
                rgba(242, 109, 61, ${window.document.documentElement.classList.contains('dark') ? '0.08' : '0.05'}),
                transparent 80%
              )
            `,
          }}
        />
      )}

      {/* Reflet supérieur (Glass edge) plus subtil en dark mode */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent opacity-50 z-20 pointer-events-none"></div>

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}, (prev, next) => {
  return prev.delay === next.delay && prev.className === next.className && prev.variant === next.variant;
});

export default Card;
