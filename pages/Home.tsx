
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Activity, ArrowUpRight, Briefcase, Factory, Scale, ShoppingCart, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ScrambleText from '../components/UI/ScrambleText';
import InfiniteMarquee from '../components/UI/InfiniteMarquee';
import IntegrationFlux from '../components/Visuals/IntegrationFlux'; 
import AnimatedHeading from '../components/UI/AnimatedHeading';
import ScrollingPerformanceTicker from '../components/Visuals/ScrollingPerformanceTicker'; 
import { usePageSEO } from '../hooks/usePageSEO';
import { useTestimonials, useFeaturedCases, useServices } from '../hooks/useContent';
import { useI18n } from '../components/System/I18nProvider';

const ICON_MAP: Record<string, any> = { Briefcase, Factory, ShoppingCart, Scale };

const HeroSection = () => {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "10%"]);

  return (
    // FIX: bg-transparent au lieu de bg-white/black pour laisser voir les particules
    <section className="relative h-screen flex flex-col justify-center px-4 overflow-hidden bg-transparent">
      {/* GHOST TEXT - Ajusté pour le contraste Crystal */}
      <motion.div 
        style={{ x: ghostX }} 
        className="absolute top-[20%] left-[-2%] text-[20vw] font-display font-bold text-slate-200/40 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter mix-blend-overlay"
      >
        DATA EQUITY
      </motion.div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <motion.div style={{ y: titleY }} className="max-w-4xl">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-16 h-[1px] bg-analytica-accent"></div>
             <span className="text-analytica-accent font-mono text-xs tracking-[0.3em] uppercase font-bold">
               <ScrambleText text={t('hero.status')} />
             </span>
          </div>
          
          <AnimatedHeading 
            text={t('hero.title.1')} 
            highlightText={t('hero.title.2')} 
            className="mb-10" 
            size="9xl"
          />
          
          <p className="max-w-2xl text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-2 border-analytica-accent/50 pl-8 ml-2 backdrop-blur-sm rounded-r-lg py-2">
            {t('hero.desc')}
          </p>
          
          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-10">
            <Button to="/contact" variant="shiny" className="h-16 !px-10 text-base shadow-2xl">
              {t('hero.cta')}
            </Button>
            
            <div className="text-xs font-mono text-slate-400 dark:text-slate-500 flex flex-col gap-1.5 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-md border border-slate-200 dark:border-white/5">
              <div className="uppercase tracking-[0.2em]">{t('hero.protocol')}</div>
              <div className="text-green-600 dark:text-green-500 flex items-center gap-2.5 font-bold">
                 <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                </span>
                {t('hero.core_system')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2, repeat: Infinity }} 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-analytica-accent/60"
      >
         <div className="w-[1px] h-14 bg-gradient-to-b from-analytica-accent to-transparent"></div>
         <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

const TrustedBySection = () => {
  const { t } = useI18n();
  return (
    // FIX: Fond semi-transparent au lieu d'opaque pour la continuité
    <section className="py-24 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-analytica-deep/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h3 className="text-xl md:text-2xl font-display font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase opacity-80">
          {t('sections.trusted')}
        </h3>
      </div>
      <InfiniteMarquee />
    </section>
  );
};

const MonolithSection = () => {
  const { t } = useI18n();
  const { data: services } = useServices();
  const CORE_SERVICES = services?.slice(0, 4) || [];

  return (
    // FIX: bg-transparent
    <section className="py-40 px-4 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 relative lg:sticky lg:top-32 h-fit">
            <div className="inline-block px-5 py-2 mb-8 border border-analytica-accent/30 rounded-full bg-analytica-accent/5 backdrop-blur-md">
              <span className="text-analytica-accent font-mono text-[10px] font-bold uppercase tracking-[0.3em]">{t('sections.monolith.protocol')}</span>
            </div>
            <AnimatedHeading 
              text={t('sections.monolith.title')} 
              className="mb-10 leading-[1.05] tracking-tighter" 
              size="7xl"
            />
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 font-medium">
              {t('sections.monolith.desc')}
            </p>
            <Button to="/services" variant="outline" className="!rounded-2xl h-14 !px-8">{t('common.explore')}</Button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {CORE_SERVICES.map((service, i) => (
              <NavLink to={`/services/${service.id}`} key={service.id} className="block group h-full">
                {/* Les cartes gèrent leur propre fond Crystal */}
                <Card variant="tech" delay={i * 0.1} className="p-10 h-full min-h-[350px] hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-analytica-accent border border-slate-200 dark:border-white/10 group-hover:bg-analytica-accent group-hover:text-white transition-all duration-300 shadow-inner">
                          <service.icon size={28} />
                       </div>
                       <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">M-{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white group-hover:text-analytica-accent transition-colors tracking-tight mb-5 leading-tight">{service.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 font-medium line-clamp-3">{service.shortDescription}</p>
                    </div>
                    <div className="mt-auto flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5">
                      <div className="flex flex-wrap gap-3">
                        {service.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">{tag}</span>
                        ))}
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-analytica-accent group-hover:bg-analytica-accent group-hover:text-white transition-all">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                </Card>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UseCasesSection = () => {
  const { t } = useI18n();
  const { data: cases, isLoading } = useFeaturedCases();
  return (
    // FIX: Suppression bg-slate-50/10 pour laisser le fond respirer
    <section className="py-40 relative border-y border-slate-200 dark:border-white/5 bg-transparent">
      {/* Background subtil pour séparer visuellement sans masquer */}
      <div className="absolute inset-0 bg-slate-100/30 dark:bg-black/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24">
          <span className="font-mono text-xs text-analytica-accent uppercase tracking-[0.4em] mb-6 block font-bold pl-1">{t('sections.cases.sub')}</span>
          <h2 className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tighter leading-none">{t('sections.cases')}</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-analytica-accent" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {cases && cases.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Briefcase;
              return (
                <Card key={item.id} variant="tech" className="p-12 group shadow-2xl">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-6 bg-white dark:bg-white/5 rounded-[24px] text-analytica-accent border border-slate-200 dark:border-white/10 group-hover:bg-analytica-accent group-hover:text-white transition-all shadow-inner">
                      <Icon size={32} />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] bg-white dark:bg-white/5 px-5 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                      {item.sector}
                    </div>
                  </div>
                  <h3 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 group-hover:text-analytica-accent transition-colors tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-10 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Activity size={22} className="text-green-600" />
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">{item.result}</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Case ID #{item.id}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const { t } = useI18n();
  const { data: testimonials } = useTestimonials();
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-40 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 text-center lg:text-left">
          <AnimatedHeading 
            text="IMPACT" 
            highlightText={t('sections.impact')} 
            className="mb-6" 
            size="8xl"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {testimonials.map((story, i) => (
            <Card key={story.id} variant="tech" delay={i * 0.1} className="p-12 group">
              <div className="flex items-center gap-6 mb-10">
                <img src={story.avatar} alt={story.name} className="w-16 h-16 rounded-[20px] object-cover border-2 border-slate-200 dark:border-white/10 shadow-lg" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg font-display tracking-tight leading-tight">{story.company}</div>
                  <div className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{story.name}</div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed font-medium mb-12 italic">"{story.content}"</p>
              <div className="mt-auto text-[11px] font-mono text-analytica-accent uppercase tracking-[0.3em] font-bold py-3 border-t border-slate-200 dark:border-white/5">{story.role}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { t } = useI18n();
  usePageSEO({
    title: t('nav.home'),
    description: "Cabinet technologique spécialisé en Intelligence Artificielle, Data Science, Business Intelligence et Automatisation. Transformez vos données en avantage compétitif.",
    breadcrumbs: [
      { name: 'Accueil', url: 'https://analyticatech.com/' }
    ]
  });
  return (
    // FIX: Suppression bg-white/black ici, c'est le layout global qui gère le fond
    <div className="w-full overflow-hidden bg-transparent">
      <HeroSection />
      <TrustedBySection />
      <MonolithSection />
      <IntegrationFlux />
      <UseCasesSection />
      <ScrollingPerformanceTicker />
      <TestimonialsSection />
      <section className="h-[90vh] flex items-center justify-center relative overflow-hidden bg-transparent">
        <div className="relative z-10 text-center max-w-5xl px-4">
          <AnimatedHeading 
            text={t('home.ready_scale')} 
            highlightText={t('home.scale_verb')} 
            className="mb-16 tracking-tighter leading-[0.8]" 
            size="9xl"
          />
          <div className="flex justify-center">
            <Button to="/contact" variant="shiny" className="h-18 !px-16 text-xl shadow-[0_0_60px_rgba(242,109,61,0.25)] hover:scale-105 transition-transform">
              {t('common.start')}
            </Button>
          </div>
        </div>
        
        {/* Background Decorative Text - Opacité ajustée pour Crystal Mode */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none -z-10 overflow-hidden">
           <div className="text-[50vw] font-display font-black leading-none transform -rotate-12 translate-x-1/4">{t('home.tech_bg')}</div>
        </div>
      </section>
    </div>
  );
};
export default Home;
