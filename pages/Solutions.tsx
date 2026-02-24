import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Zap } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';
import { useSolutions } from '../hooks/useContent';
import { Link } from 'react-router-dom';
import { useI18n } from '../components/System/I18nProvider';

const Solutions: React.FC = () => {
  const { t } = useI18n();
  usePageSEO({ title: t('nav.solutions'), description: "IA products for business growth." });

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: solutions, isLoading } = useSolutions();

  // Calculer le nombre total de cartes
  const totalCards = solutions?.length || 0;

  // Calculer la largeur totale du contenu à scroller (en vw)
  const totalContentWidth = 75 + (totalCards * (85 + 8)) + 85;

  // Calculer la distance de scroll horizontal nécessaire
  // On veut que tout le contenu soit visible, donc on scroll de (totalWidth - viewportWidth)
  // Viewport visible = ~100vw, donc scroll = totalContentWidth - 100
  const scrollDistance = Math.max(0, totalContentWidth - 100);

  // Calculer la hauteur optimale pour le scroll - utilisée pour le conteneur
  // La hauteur est définie dynamiquement via style inline dans la section

  // Définir le scroll avec un offset optimisé
  // "start end" = quand le haut du conteneur atteint le bas de l'écran
  // "end start" = quand le bas du conteneur atteint le haut de l'écran
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculer les offsets pour la transformation
  // 0% = au début, le contenu est à sa position initiale
  // On veut que le scroll horizontal commence après un petit délai (10%)
  // et se termine avant la fin (90%) pour laisser voir la dernière carte
  const scrollStartOffset = 0.1; // 10% du scroll vertical
  const scrollEndOffset = 0.9; // 90% du scroll vertical

  // Transformation X: de 0% à -scrollDistance%
  const x = useTransform(
    scrollYProgress,
    [scrollStartOffset, scrollEndOffset],
    ["0%", `-${scrollDistance}vw`]
  );

  // Background avec un mouvement plus subtil
  const backgroundX = useTransform(
    scrollYProgress,
    [scrollStartOffset, scrollEndOffset],
    ["0%", `${scrollDistance * 0.3}vw`]
  );

  return (
    <div className="bg-transparent w-full min-h-screen">
      {/* HERO */}
      <section className="min-h-[35vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto relative z-10 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
            <span className="text-slate-800 dark:text-slate-300 font-medium"> Déployez en jours, pas en mois.</span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-6 md:gap-8 mt-8 pt-6 border-t border-slate-200 dark:border-white/10"
          >
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">6+</div>
              <div className="text-xs md:text-sm text-slate-500 font-mono uppercase tracking-wider">Solutions</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">-80%</div>
              <div className="text-xs md:text-sm text-slate-500 font-mono uppercase tracking-wider">Coût API</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">x50</div>
              <div className="text-xs md:text-sm text-slate-500 font-mono uppercase tracking-wider">Vitesse</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* LOADING */}
      {isLoading && (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-analytica-accent" size={48} />
          <div className="text-xs font-mono text-slate-500 animate-pulse uppercase">{t('common.loading')}</div>
        </div>
      )}

      {/* HORIZONTAL SCROLL SECTION */}
      {!isLoading && solutions && solutions.length > 0 && (
        <section
          ref={containerRef}
          className="relative"
          style={{ height: `${200 + totalCards * 25}vh` }}
        >
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
            {/* Horizontal Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-200/20 z-40">
              <motion.div
                className="h-full bg-analytica-accent origin-left"
                style={{ scaleX: scrollYProgress }}
              />
            </div>

            <motion.div
              style={{ x: backgroundX }}
              className="absolute top-[10%] left-0 text-[25vw] font-display font-bold text-slate-200/20 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
            >
              SOLUTIONS CATALOGUE
            </motion.div>

            {/* Overlays for depth */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />

            <motion.div
              style={{ x }}
              className="flex gap-12 md:gap-16 pl-8 md:pl-24 pr-[50vw] relative z-10 items-center h-full"
            >
              {/* Intro Card */}
              <div className="w-[85vw] md:w-[400px] flex-shrink-0">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-analytica-accent/10 border border-analytica-accent/20"
                  >
                    <Zap size={14} className="text-analytica-accent" />
                    <span className="text-xs font-mono text-analytica-accent uppercase tracking-wider font-bold">Ready to deploy</span>
                  </motion.div>

                  <div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-4">
                      VOTRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-analytica-accent to-orange-500">ARSENAL</span> IA.
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
                      Une suite d'outils industriels conçus pour scalabilité immédiate.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-analytica-accent font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                    <span className="w-12 h-px bg-analytica-accent"></span>
                    Scroll pour explorer
                  </div>
                </div>
              </div>

              {/* Solution Cards */}
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  viewport={{ once: true, margin: "-10%" }}
                  className="flex-shrink-0"
                >
                  <Link to={`/solutions/${solution.id}`} className="block group">
                    <Card
                      variant="tech"
                      className="w-[85vw] md:w-[480px] h-[550px] md:h-[600px] flex flex-col p-8 md:p-10 hover:border-analytica-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-analytica-accent/10 relative overflow-hidden"
                    >
                      {/* Subtil gradient background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-analytica-accent/0 to-analytica-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-analytica-accent/20 to-analytica-accent/5 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-analytica-accent/10">
                          <solution.icon size={32} />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-[10px] font-mono font-bold text-analytica-accent bg-analytica-accent/10 px-3 py-1.5 rounded-full border border-analytica-accent/20 uppercase tracking-widest">
                            PROD-{String(solution?.id || '000').slice(0, 3).toUpperCase()}
                          </div>
                          <div className="mt-2 text-[8px] font-mono text-slate-500 uppercase tracking-tighter opacity-50">Stable Release v1.4</div>
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
                            <span key={i} className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 uppercase">{tech}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-analytica-accent text-sm font-bold group-hover:gap-4 transition-all">
                          <span className="uppercase text-[10px] tracking-[0.2em]">{t('common.details')}</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}

              {/* CTA Card */}
              <div className="w-[85vw] md:w-[500px] flex-shrink-0 flex items-center h-full">
                <Card
                  variant="tech"
                  className="p-12 text-center w-full bg-gradient-to-br from-analytica-accent/10 via-transparent to-transparent border-analytica-accent/30 hover:border-analytica-accent/50 transition-all duration-500 shadow-xl shadow-analytica-accent/5"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-analytica-accent/20 border border-analytica-accent/20 flex items-center justify-center text-analytica-accent">
                    <Sparkles size={32} className="animate-pulse" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white leading-none mb-4">
                    CONFIGURATION <br /><span className="text-analytica-accent">CUSTOM</span>
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 text-base mb-8 max-w-xs mx-auto leading-relaxed">
                    Développement sur mesure pour architectures complexes et besoins métier spécifiques.
                  </p>

                  <Button to="/contact" variant="shiny" className="!px-10 !py-4 text-xs font-bold tracking-widest uppercase mb-12">
                    START PROTOCOL
                  </Button>

                  <div className="flex justify-center gap-8 pt-8 border-t border-slate-200 dark:border-white/5">
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">24H</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-tighter">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">FREE</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-tighter">Analysis</div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!isLoading && (!solutions || solutions.length === 0) && (
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Aucune solution disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Solutions;