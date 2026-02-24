import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Terminal, Clock, Users, BarChart3, Shield, Loader2, ChevronRight, Sparkles, LayoutGrid } from 'lucide-react';
import { Service } from '../types/index';
import { useServices } from '../hooks/useContent';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import LazyImage from '../components/UI/LazyImage';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';
import { Link } from 'react-router-dom';

// --- IMAGES ---
const SERVICE_IMAGES: Record<string, string> = {
  'business-intelligence': "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", 
  'hyper-automatisation': "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
  'data-engineering': "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
  'custom-dev': "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
};

// --- SHARED STYLES ---
const complexityStyles = {
  Critical: 'bg-red-500/10 text-red-500 border border-red-500/20',
  Advanced: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  Standard: 'bg-green-500/10 text-green-500 border border-green-500/20'
};

const COMPLEXITY_LABELS: Record<string, string> = {
  Critical: 'Critique',
  Advanced: 'Avancé',
  Standard: 'Standard'
};

// --- SERVICE CARD ---
interface ServiceCardProps {
  service: Service<string>;
  index: number;
  totalServices: number;
  scrollYProgress: MotionValue<number>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, totalServices, scrollYProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Calcul dynamique des ranges pour chaque carte
  // Première carte visible immédiatement, dernière carte reste visible
  const startRange = index === 0 ? 0 : index / totalServices;
  const endRange = index === totalServices - 1 ? 1 : (index + 1) / totalServices;
  
  const scale = useTransform(
    scrollYProgress,
    [startRange, endRange],
    [1, index === totalServices - 1 ? 1 : 0.95]
  );
  
  const y = useTransform(
    scrollYProgress,
    [startRange, endRange],
    [0, index === totalServices - 1 ? 0 : -30]
  );

  return (
    <div 
      ref={cardRef}
      className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-8"
    >
      <motion.div 
        style={{ scale, y }}
        className="w-full max-w-7xl relative group"
      >
        {/* Border Glow */}
        <div className="absolute -inset-[2px] rounded-[28px] overflow-hidden z-0 pointer-events-none">
          <div 
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#F26D3D_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[spin_6s_linear_infinite]" 
            style={{ filter: 'blur(8px)' }}
          />
        </div>

        <Card 
          variant="tech" 
          noSpotlight 
          className="min-h-[70vh] md:min-h-[550px] flex flex-col lg:flex-row overflow-hidden !border-transparent !rounded-3xl shadow-2xl relative z-10 bg-white/95 dark:bg-[#020617]/90 backdrop-blur-xl"
        >
          {/* VISUAL SECTION */}
          <div className="lg:w-[40%] relative overflow-hidden">
            <div className="absolute inset-0">
              <LazyImage 
                src={SERVICE_IMAGES[service.id] || SERVICE_IMAGES['business-intelligence']} 
                alt={service.title}
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover opacity-40 dark:opacity-30 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/95 dark:to-[#020617]/95" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/50 dark:from-[#020617]/80 dark:to-transparent" />
            </div>

            {/* Number Badge */}
            <div className="absolute top-6 left-6 z-20">
              <div className="w-14 h-14 rounded-2xl bg-analytica-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <span className="font-display text-xl text-white font-bold">0{index + 1}</span>
              </div>
            </div>

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-analytica-accent/20 blur-3xl scale-150" />
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <service.icon size={56} className="text-analytica-accent" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="uppercase tracking-wider">Progression</span>
                <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-analytica-accent to-orange-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${((index + 1) / totalServices) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span>{index + 1}/{totalServices}</span>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="lg:w-[60%] flex flex-col p-6 md:p-8">
            {/* Header Tags */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-analytica-accent/10 border border-analytica-accent/20 text-[10px] font-mono font-bold text-analytica-accent uppercase">
                  Consulting Expert
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${complexityStyles[service.technicalComplexity as keyof typeof complexityStyles] || complexityStyles.Standard}`}>
                  {COMPLEXITY_LABELS[service.technicalComplexity as string] || service.technicalComplexity}
                </span>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase">Disponible</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-analytica-accent transition-colors">
              {service.title}
            </h2>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-5">
              {service.shortDescription}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-analytica-accent mb-1">
                  <Clock size={12} />
                  <span className="text-[9px] font-mono uppercase">ROI</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{service.roiTimeline || '3-6 mois'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-green-500 mb-1">
                  <BarChart3 size={12} />
                  <span className="text-[9px] font-mono uppercase">Impact</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{service.marketImpact?.substring(0, 15) || 'Élevé'}...</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-purple-500 mb-1">
                  <Users size={12} />
                  <span className="text-[9px] font-mono uppercase">Équipe</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Experts</span>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={12} className="text-analytica-accent" />
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Stack Technique</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.slice(0, 5).map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                    {tag}
                  </span>
                ))}
                {service.tags.length > 5 && (
                  <span className="px-2 py-1 rounded bg-analytica-accent/10 text-analytica-accent text-[10px] font-mono">
                    +{service.tags.length - 5}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex gap-3 text-[9px] font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1"><Shield size={10} className="text-green-500"/> Sécurisé</span>
                <span className="flex items-center gap-1"><LayoutGrid size={10} className="text-blue-500"/> Scalable</span>
                <span className="flex items-center gap-1"><Sparkles size={10} className="text-purple-500"/> IA-Ready</span>
              </div>
              
              <div className="flex gap-1 sm:ml-auto">
                <Link 
                  to={`/services/${service.id}`}
                  className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  <span>Détails</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
<Button to="/contact" variant="shiny" className="!py-2 !px-4 text-xs">
  Démarrer
</Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Services: React.FC = () => {
  usePageSEO({ title: "Nos Services", description: "Expertise conseil en BI, Automatisation et Data Engineering." });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "-10%"]);

  const { data: services, isLoading } = useServices();

  return (
    <div className="bg-transparent w-full">
      {/* HERO */}
      <section className="h-[70vh] flex flex-col justify-center px-4 max-w-7xl mx-auto relative z-10 pt-20 overflow-hidden">
        <motion.div style={{ x: ghostX }} className="absolute top-[20%] right-[-10%] text-[20vw] font-display font-bold text-slate-200/50 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter">CONSULTING</motion.div>
        
        <motion.div style={{ y: titleY }} className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-[1px] bg-analytica-accent"></div>
             <span className="text-analytica-accent font-mono text-sm tracking-[0.2em] uppercase">Savoir-Faire</span>
          </div>
          
          <AnimatedHeading text="SERVICES" highlightText="EXPERTS" size="9xl" />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
          >
            Transformez vos données en avantage compétitif avec nos expertises en Business Intelligence, 
            Automatisation et Data Engineering.
          </motion.p>
        </motion.div>
      </section>

      {/* CARDS CONTAINER */}
      <div ref={containerRef} className="relative" style={{ height: services ? `${(services.length + 0.3) * 100}vh` : '100vh' }}>
        {isLoading && (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-analytica-accent" size={48} />
             <div className="text-xs font-mono text-slate-500 animate-pulse uppercase">Chargement...</div>
          </div>
        )}

        {!isLoading && services?.map((service, i) => (
          <ServiceCard 
            key={service.id} 
            index={i} 
            service={service}
            totalServices={services.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* CTA */}
      {!isLoading && services && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Prêt à <span className="text-analytica-accent">transformer</span> vos données ?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Nos experts sont prêts à analyser vos besoins.
            </p>
<Button to="/contact" variant="shiny" className="!px-8 !py-3">
  Demander un audit gratuit
</Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Services;