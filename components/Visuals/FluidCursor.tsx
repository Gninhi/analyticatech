import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion';

/**
 * TECH FLUID CURSOR
 * Un curseur de précision accompagné d'un anneau "liquide" qui réagit à l'inertie.
 * L'anneau s'étire (scale) en fonction de la vélocité de la souris.
 */
const FluidCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isActive, setIsActive] = useState(false); // New state to control logic execution
  
  // Coordonnées souris brute
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physique du suiveur (L'anneau liquide)
  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 }; 
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Calcul de la vélocité pour la déformation
  const velocityX = useVelocity(springX);
  // velocityY available for future Y-axis transformations
  useVelocity(springY);

  // Transformation de la vélocité en étirement (Scale)
  const scale = useTransform(velocityX, [-1000, 0, 1000], [1.2, 1, 1.2]);
  
  useEffect(() => {
    // Audit Performance: Ne pas exécuter la logique sur les appareils tactiles/mobiles
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsActive(mediaQuery.matches);

    const handleResize = () => setIsActive(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* 1. LE POINTEUR DE PRÉCISION (Le point central) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-analytica-accent rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 2. L'ANNEAU FLUIDE (Le suiveur) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-analytica-accent/50 pointer-events-none z-[99] backdrop-blur-[1px]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicking ? 0.8 : scale, 
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="absolute inset-0 bg-analytica-accent/10 rounded-full blur-[2px]"></div>
      </motion.div>
    </>
  );
};

export default FluidCursor;