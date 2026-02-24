import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface LogoProps {
  className?: string;
  forceHover?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", forceHover = false }) => {
  const [animationState, setAnimationState] = useState<"visible" | "glitch">("visible");
  const [isInternalHover, setIsInternalHover] = useState(false);

  useEffect(() => {
    let glitchTimeout: ReturnType<typeof setTimeout>;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setAnimationState("glitch");
          glitchTimeout = setTimeout(() => {
            setAnimationState("visible");
          }, 800); // Durée du glitch
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
      if (glitchTimeout) clearTimeout(glitchTimeout);
    };
  }, []);

  // Logique de priorité des animations : Glitch > Hover (Forcé ou Interne) > Visible
  const currentVariant = animationState === 'glitch' 
    ? 'glitch' 
    : (forceHover || isInternalHover ? 'hover' : 'visible');

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      skewX: 0,
      filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
      transition: { duration: 0.5, when: "beforeChildren" } 
    },
    hover: { 
      y: -6, 
      filter: "drop-shadow(0px 8px 12px rgba(0,0,0,0.15))",
      transition: { type: "spring", stiffness: 300, damping: 15 } 
    },
    glitch: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 0],
      skewX: [0, 10, -10, 0],
      filter: [
        "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
        "drop-shadow(2px 0px 0px rgba(242,109,61,0.6)) drop-shadow(-2px 0px 0px rgba(3,49,140,0.6))",
        "drop-shadow(0px 0px 0px rgba(0,0,0,0))"
      ],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 1]
      }
    }
  };

  const mainPathVariants: Variants = {
    hidden: { pathLength: 0, fillOpacity: 0 },
    visible: { 
      pathLength: 1, 
      fillOpacity: 1,
      transition: { 
        pathLength: { duration: 1.2, ease: "easeInOut" },
        fillOpacity: { duration: 0.4, delay: 1 } // Le remplissage arrive après le tracé
      }
    },
    glitch: {
      pathLength: 1,
      fillOpacity: [1, 0.8, 1],
      transition: { duration: 0.2, repeat: 2 }
    }
  };

  const accentPathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0, scaleX: 0.5 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      scaleX: 1,
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" }
    },
    hover: {
      filter: "drop-shadow(0px 0px 5px rgba(242, 109, 61, 0.8))", // Effet néon
      scaleX: 1.1,
      transition: { duration: 0.3 }
    },
    glitch: {
      opacity: [1, 0, 1, 0, 1],
      pathLength: [1, 0.5, 1],
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} overflow-visible`}
      aria-label="Analyticatech Logo"
      initial="hidden"
      animate={currentVariant}
      onMouseEnter={() => setIsInternalHover(true)}
      onMouseLeave={() => setIsInternalHover(false)}
      variants={containerVariants}
    >
      {/* Forme principale "A" */}
      <motion.path 
        d="M50 10 L15 90 H38 L50 60 L62 90 H85 L50 10Z" 
        stroke="currentColor" 
        strokeWidth="3"
        strokeLinejoin="round"
        fill="currentColor"
        variants={mainPathVariants}
      />

      {/* Barre d'accentuation Orange */}
      <motion.path 
        d="M32 72 H68" 
        stroke="#F26D3D" 
        strokeWidth="8" 
        strokeLinecap="round" 
        variants={accentPathVariants}
      />
    </motion.svg>
  );
};

export default Logo;