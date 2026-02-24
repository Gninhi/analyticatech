import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Gestion intelligente du scroll et des ancres.
 * Utilise requestAnimationFrame pour ne pas bloquer le thread principal.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      }
      
      window.scrollTo(0, 0);
      return true;
    };

    // Tentative immédiate + Polling léger (max 5 tentatives)
    if (!handleScroll()) {
      let attempts = 0;
      const maxAttempts = 5;
      const interval = setInterval(() => {
        attempts++;
        if (handleScroll() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;