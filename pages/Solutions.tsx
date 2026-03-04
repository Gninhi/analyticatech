import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';
import { useSolutions } from '../hooks/useContent';
import { Link } from 'react-router-dom';
import { useI18n } from '../components/System/I18nProvider';

function throttle<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): T {
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}

const useHorizontalScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  scrollDistance: number,
  enabled: boolean = true
) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInHorizontalZone = useCallback(() => {
    const progress = scrollYProgress.get();
    return enabled && progress > 0 && progress < 1;
  }, [enabled, scrollYProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const handleWheel = throttle((e: WheelEvent) => {
      if (isInHorizontalZone()) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
        setIsScrolling(true);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      }
    }, 16);

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [containerRef, isInHorizontalZone, enabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    let startX = 0;
    let scrollLeft = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (isInHorizontalZone()) {
        isTouching = true;
        startX = e.touches[0].clientX;
        scrollLeft = container.scrollLeft;
        setIsScrolling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouching && isInHorizontalZone()) {
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        container.scrollLeft = scrollLeft + diff;
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef, isInHorizontalZone, enabled]);

  return { scrollYProgress, x, isScrolling };
};

function computeScrollDistance(totalCards: number): number {
  if (typeof window === 'undefined' || totalCards === 0) return 0;

  const vw = window.innerWidth;
  const isDesktop = vw >= 768;

  let totalTrackWidth: number;

  if (isDesktop) {
    const padLeft = 96;
    const padRight = vw * 0.5;
    const introW = 400;
    const cardW = 480;
    const ctaW = 500;
    const gap = 64;

    totalTrackWidth = padLeft + introW + gap + totalCards * (cardW + gap) + ctaW + padRight;
  } else {
    const padLeft = 32;
    const padRight = vw * 0.5;
    const cardW = vw * 0.85;
    const gap = 48;

    totalTrackWidth = padLeft + cardW + gap + totalCards * (cardW + gap) + cardW + padRight;
  }

  return Math.max(0, totalTrackWidth - vw);
}

const Solutions: React.FC = () => {
  const { t } = useI18n();
  const reducedMotion = useReducedMotion();

  usePageSEO({
    title: t('nav.solutions'),
    description: 'IA products for business growth.',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: solutions, isLoading } = useSolutions();

  const [resizeKey, setResizeKey] = useState(0);
  const [cardHeights, setCardHeights] = useState<number[]>([]);

  useEffect(() => {
    const onResize = () => setResizeKey(k => k + 1);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!trackRef.current || reducedMotion) return;

    const cards = trackRef.current.querySelectorAll('[data-solution-card]');
    const heights: number[] = [];

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      heights.push(rect.height);
    });

    if (heights.length > 0) {
      setCardHeights(heights);
    }
  }, [solutions, resizeKey, reducedMotion]);

  const totalCards = solutions?.length ?? 0;
  const maxCardHeight = cardHeights.length > 0 ? Math.max(...cardHeights) : 600;

  const scrollDistance = useMemo(
    () => computeScrollDistance(totalCards),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalCards, resizeKey]
  );

  const { scrollYProgress, x, isScrolling } = useHorizontalScroll(
    containerRef,
    scrollDistance,
    !reducedMotion
  );

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, scrollDistance * 0.2]
  );

  const sectionHeight = reducedMotion
    ? 'auto'
    : scrollDistance > 0
      ? `calc(200vh + ${scrollDistance}px + ${maxCardHeight * totalCards}px)`
      : 'auto';

  return (
    <div className="bg-transparent w-full min-h-screen">
      <section className="min-h-[35vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto relative z-10 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-analytica-accent/10 border border-analytica-accent/20 mb-6"
          >
            <Sparkles size={14} className="text-analytica-accent" />
            <span className="text-analytica-accent font-mono text-xs tracking-[0.15em] uppercase font-medium">
              Catalogue 2025
            </span>
          </motion.div>

          <AnimatedHeading text="SOLUTIONS" highlightText="PACKAGÉES" size="9xl" />

          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Des produits IA clés en main pour accélérer votre transformation digitale.
            <span className="text-slate-800 dark:text-slate-300 font-medium">
              {' '}Déployez en jours, pas en mois.
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-6 md:gap-8 mt-8 pt-6 border-t border-slate-200 dark:border-white/10"
          >
            {[
              { value: '6+',   label: 'Solutions' },
              { value: '-80%', label: 'Coût API'  },
              { value: 'x50',  label: 'Vitesse'   },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {value}
                </div>
                <div className="text-xs md:text-sm text-slate-500 font-mono uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {isLoading && (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-analytica-accent" size={48} />
          <div className="text-xs font-mono text-slate-500 animate-pulse uppercase">
            {t('common.loading')}
          </div>
        </div>
      )}

      {!isLoading && solutions && solutions.length > 0 && (
        <section
          ref={containerRef}
          className="relative"
          style={{
            height: sectionHeight,
          }}
          data-testid="solutions-scroll-container"
          role="region"
          aria-label="Solutions catalog - horizontal scroll"
        >
          <div
            ref={stickyRef}
            className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center ${reducedMotion ? 'relative' : ''}`}
            data-testid="solutions-sticky-viewport"
            style={reducedMotion ? {} : { overflowY: 'hidden' }}
          >
            <div
              className="absolute top-0 left-0 w-full h-[2px] bg-slate-200/20 z-40"
              role="progressbar"
              aria-valuenow={Math.round(smoothProgress.get() * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Scroll progress"
            >
              <motion.div
                className="h-full bg-analytica-accent origin-left"
                style={{ scaleX: smoothProgress }}
              />
            </div>

            <motion.div
              style={reducedMotion ? {} : { x: backgroundX }}
              className="absolute top-[10%] left-0 text-[25vw] font-display font-bold text-slate-200/20 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
              aria-hidden="true"
            >
              SOLUTIONS CATALOGUE
            </motion.div>

            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />

            {reducedMotion ? (
              <div
                ref={trackRef}
                className="flex flex-col gap-12 px-8 md:px-24 py-12 relative z-10"
              >
                <div className="w-full max-w-md">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-analytica-accent/10 border border-analytica-accent/20">
                      <Zap size={14} className="text-analytica-accent" />
                      <span className="text-xs font-mono text-analytica-accent uppercase tracking-wider font-bold">
                        Ready to deploy
                      </span>
                    </div>

                    <div>
                      <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-4">
                        VOTRE{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-analytica-accent to-orange-500">
                          ARSENAL
                        </span>{' '}
                        IA.
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
                        Une suite d'outils industriels conçus pour scalabilité immédiate.
                      </p>
                    </div>
                  </div>
                </div>

                {solutions.map((solution) => (
                  <Link
                    key={solution.id}
                    to={`/solutions/${solution.id}`}
                    className="block group"
                    data-solution-card
                  >
                    <Card
                      variant="tech"
                      className="w-full max-w-xl md:max-w-2xl flex flex-col p-8 md:p-10 hover:border-analytica-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-analytica-accent/10 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-analytica-accent/0 to-analytica-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-analytica-accent/20 to-analytica-accent/5 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-analytica-accent/10">
                          <solution.icon size={32} />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-[10px] font-mono font-bold text-analytica-accent bg-analytica-accent/10 px-3 py-1.5 rounded-full border border-analytica-accent/20 uppercase tracking-widest">
                            PROD-{String(solution?.id ?? '000').slice(0, 3).toUpperCase()}
                          </div>
                          <div className="mt-2 text-[8px] font-mono text-slate-500 uppercase tracking-tighter opacity-50">
                            Stable Release v1.4
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 relative z-10">
                        <div>
                          <p className="text-[10px] font-mono text-analytica-accent uppercase tracking-[0.3em] mb-1">
                            {solution.subtitle}
                          </p>
                          <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white group-hover:text-analytica-accent transition-colors duration-500 leading-none">
                            {solution.title.toUpperCase()}
                          </h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base line-clamp-3">
                          {solution.shortDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-8 p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 relative z-10 group-hover:border-analytica-accent/20 transition-colors">
                        {solution.kpis.slice(0, 2).map((stat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="text-[9px] uppercase text-slate-500 font-bold tracking-widest font-mono opacity-80">
                              {stat.label}
                            </div>
                            <div className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                              {stat.value}
                              <span className="text-xs text-analytica-accent">▲</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-5 border-t border-slate-200/50 dark:border-white/10 relative z-10">
                        <div className="flex gap-2">
                          {solution.techStack.slice(0, 2).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 uppercase"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-analytica-accent text-sm font-bold group-hover:gap-4 transition-all">
                          <span className="uppercase text-[10px] tracking-[0.2em]">
                            {t('common.details')}
                          </span>
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}

                <div className="w-full max-w-md">
                  <Card
                    variant="tech"
                    className="p-12 text-center w-full bg-gradient-to-br from-analytica-accent/10 via-transparent to-transparent border-analytica-accent/30 hover:border-analytica-accent/50 transition-all duration-500 shadow-xl shadow-analytica-accent/5"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-analytica-accent/20 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent">
                      <Sparkles size={32} className="animate-pulse" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white leading-none mb-4">
                      CONFIGURATION <br />
                      <span className="text-analytica-accent">CUSTOM</span>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-base mb-8 max-w-xs mx-auto leading-relaxed">
                      Développement sur mesure pour architectures complexes et besoins métier spécifiques.
                    </p>

                    <Button
                      to="/contact"
                      variant="shiny"
                      className="!px-10 !py-4 text-xs font-bold tracking-widest uppercase mb-12"
                    >
                      START PROTOCOL
                    </Button>

                    <div className="flex justify-center gap-8 pt-8 border-t border-slate-200 dark:border-white/5">
                      {[
                        { value: '24H',  label: 'Response' },
                        { value: 'FREE', label: 'Analysis' },
                      ].map(({ value, label }) => (
                        <div key={label} className="text-center">
                          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {value}
                          </div>
                          <div className="text-[8px] text-slate-500 uppercase tracking-tighter">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <motion.div
                ref={trackRef}
                style={{ x }}
                className="flex gap-12 md:gap-16 pl-8 md:pl-24 pr-[50vw] relative z-10 items-center h-full will-change-transform"
                data-testid="solutions-horizontal-track"
              >
                <div
                  className="w-[85vw] md:w-[400px] flex-shrink-0"
                  data-testid="solutions-intro-card"
                >
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-analytica-accent/10 border border-analytica-accent/20">
                      <Zap size={14} className="text-analytica-accent" />
                      <span className="text-xs font-mono text-analytica-accent uppercase tracking-wider font-bold">
                        Ready to deploy
                      </span>
                    </div>

                    <div>
                      <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-4">
                        VOTRE{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-analytica-accent to-orange-500">
                          ARSENAL
                        </span>{' '}
                        IA.
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
                        Une suite d'outils industriels conçus pour scalabilité immédiate.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-analytica-accent font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                      <span className="w-12 h-px bg-analytica-accent" />
                      Scroll pour explorer
                    </div>
                  </div>
                </div>

                {solutions.map((solution) => (
                  <motion.div
                    key={solution.id}
                    data-solution-card
                    data-testid={`solution-card-${solution.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    className="flex-shrink-0"
                  >
                    <Link to={`/solutions/${solution.id}`} className="block group">
                      <Card
                        variant="tech"
                        className="w-[85vw] md:w-[480px] h-[550px] md:h-[600px] flex flex-col p-8 md:p-10 hover:border-analytica-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-analytica-accent/10 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-analytica-accent/0 to-analytica-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-analytica-accent/20 to-analytica-accent/5 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-analytica-accent/10">
                            <solution.icon size={32} />
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-[10px] font-mono font-bold text-analytica-accent bg-analytica-accent/10 px-3 py-1.5 rounded-full border border-analytica-accent/20 uppercase tracking-widest">
                              PROD-{String(solution?.id ?? '000').slice(0, 3).toUpperCase()}
                            </div>
                            <div className="mt-2 text-[8px] font-mono text-slate-500 uppercase tracking-tighter opacity-50">
                              Stable Release v1.4
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4 relative z-10">
                          <div>
                            <p className="text-[10px] font-mono text-analytica-accent uppercase tracking-[0.3em] mb-1">
                              {solution.subtitle}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white group-hover:text-analytica-accent transition-colors duration-500 leading-none">
                              {solution.title.toUpperCase()}
                            </h3>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base line-clamp-3">
                            {solution.shortDescription}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 my-8 p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 relative z-10 group-hover:border-analytica-accent/20 transition-colors">
                          {solution.kpis.slice(0, 2).map((stat, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="text-[9px] uppercase text-slate-500 font-bold tracking-widest font-mono opacity-80">
                                {stat.label}
                              </div>
                              <div className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                                {stat.value}
                                <span className="text-xs text-analytica-accent">▲</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-5 border-t border-slate-200/50 dark:border-white/10 relative z-10">
                          <div className="flex gap-2">
                            {solution.techStack.slice(0, 2).map((tech, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 uppercase"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-analytica-accent text-sm font-bold group-hover:gap-4 transition-all">
                            <span className="uppercase text-[10px] tracking-[0.2em]">
                              {t('common.details')}
                            </span>
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}

                <div className="w-[85vw] md:w-[500px] flex-shrink-0 flex items-center h-full">
                  <Card
                    variant="tech"
                    className="p-12 text-center w-full bg-gradient-to-br from-analytica-accent/10 via-transparent to-transparent border-analytica-accent/30 hover:border-analytica-accent/50 transition-all duration-500 shadow-xl shadow-analytica-accent/5"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-analytica-accent/20 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent">
                      <Sparkles size={32} className="animate-pulse" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white leading-none mb-4">
                      CONFIGURATION <br />
                      <span className="text-analytica-accent">CUSTOM</span>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-base mb-8 max-w-xs mx-auto leading-relaxed">
                      Développement sur mesure pour architectures complexes et besoins métier spécifiques.
                    </p>

                    <Button
                      to="/contact"
                      variant="shiny"
                      className="!px-10 !py-4 text-xs font-bold tracking-widest uppercase mb-12"
                    >
                      START PROTOCOL
                    </Button>

                    <div className="flex justify-center gap-8 pt-8 border-t border-slate-200 dark:border-white/5">
                      {[
                        { value: '24H',  label: 'Response' },
                        { value: 'FREE', label: 'Analysis' },
                      ].map(({ value, label }) => (
                        <div key={label} className="text-center">
                          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {value}
                          </div>
                          <div className="text-[8px] text-slate-500 uppercase tracking-tighter">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {isScrolling && (
              <div
                className="fixed inset-0 z-30 pointer-events-none"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] transition-opacity" />
              </div>
            )}
          </div>
        </section>
      )}

      {!isLoading && (!solutions || solutions.length === 0) && (
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">
            Aucune solution disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Solutions;
