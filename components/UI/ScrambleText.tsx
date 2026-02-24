
import React, { useState, useEffect, useRef, memo } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnce?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&";

const ScrambleText: React.FC<ScrambleTextProps> = memo(({ 
  text, 
  className = "", 
  delay = 0,
  triggerOnce = true 
}) => {
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const startTimeout = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              if (text[index] === ' ') return ' ';
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setHasAnimated(true);
        }
        
        iteration += 1 / 3;
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isInView, text, delay, hasAnimated]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
});

export default ScrambleText;
