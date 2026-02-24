import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, Loader2, TrendingUp, ShieldAlert, 
  Clock, Users, Globe, Code2,
  ChevronRight, ArrowRight, Play, FileText, MessageSquare
} from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import LazyImage from '../components/UI/LazyImage';
import { usePageSEO } from '../hooks/usePageSEO';
import { useServiceDetail, useServices } from '../hooks/useContent';
import { useI18n } from '../components/System/I18nProvider';

// Images spécifiques pour chaque service
const SERVICE_IMAGES: Record<string, { hero: string; process: string; impact: string }> = {
  'business-intelligence': {
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    process: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    impact: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop"
  },
  'hyper-automatisation': {
    hero: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
    process: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    impact: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop"
  },
  'data-engineering': {
    hero: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1600&auto=format&fit=crop",
    process: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    impact: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
  },
  'custom-dev': {
    hero: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
    process: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    impact: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
  }
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { data: service, isLoading } = useServiceDetail(id || '');
  const { data: allServices } = useServices();

  usePageSEO({ title: service?.title || t('common.loading'), description: service?.shortDescription });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#020617]">
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
         >
           <Loader2 className="text-analytica-accent" size={48} />
         </motion.div>
         <div className="text-xs font-mono text-slate-500 animate-pulse uppercase">Chargement du protocole...</div>
      </div>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const images = SERVICE_IMAGES[service.id] || SERVICE_IMAGES['business-intelligence'];
  const relatedServices = allServices?.filter(s => s.id !== service.id).slice(0, 3) || [];

  return (
    <div className="w-full overflow-hidden bg-transparent">
      
      {/* HERO SECTION - Full Width with Background Image */}
      <section className="relative min-h-[80vh] flex items-end pb-20 pt-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <LazyImage 
            src={images.hero}
            alt={service.title}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-[#020617] dark:via-[#020617]/80 dark:to-[#020617]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent dark:from-[#020617]/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-8"
          >
            <Link to="/services" className="flex items-center gap-2 hover:text-analytica-accent transition-colors">
              <ArrowLeft size={14} />
              <span>Retour aux services</span>
            </Link>
            <ChevronRight size={14} />
            <span className="text-analytica-accent">{service.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            {/* Left - Title & Description */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-2xl bg-analytica-accent/10 backdrop-blur-xl border border-analytica-accent/20 flex items-center justify-center"
                >
                  <service.icon size={40} className="text-analytica-accent" />
                </motion.div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase w-fit ${
                    service.technicalComplexity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                    service.technicalComplexity === 'Advanced' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-green-500/10 text-green-500 border border-green-500/20'
                  }`}>
                    {service.technicalComplexity} {t('service.complexity')}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Protocol ID: SYS-{service.id.toUpperCase()}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                {service.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
                {service.fullDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button to="/contact" variant="shiny" className="!px-8 !py-4 text-base">
                  <MessageSquare size={18} className="mr-2"/>
                  Demander un devis
                </Button>
                <Button to="#process" variant="outline" className="!px-8 !py-4 text-base">
                  <Play size={18} className="mr-2"/>
                  Voir le processus
                </Button>
              </div>
            </motion.div>

            {/* Right - Key Metrics Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card variant="tech" className="p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-analytica-accent mb-3">
                  <Clock size={18} />
                  <span className="text-xs font-mono uppercase tracking-wider">ROI Timeline</span>
                </div>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{service.roiTimeline || '3-6 mois'}</p>
              </Card>
              
              <Card variant="tech" className="p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-green-500 mb-3">
                  <TrendingUp size={18} />
                  <span className="text-xs font-mono uppercase tracking-wider">Impact Marché</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{service.marketImpact || 'Transformation digitale'}</p>
              </Card>

              <Card variant="tech" className="p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl col-span-2">
                <div className="flex items-center gap-2 text-purple-500 mb-3">
                  <Users size={18} />
                  <span className="text-xs font-mono uppercase tracking-wider">Équipe Dédiée</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Des experts seniors en {service.tags.slice(0, 3).join(', ')} affectés à votre projet.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#011024]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <span className="text-analytica-accent font-mono text-xs uppercase tracking-[0.3em] font-bold mb-2 block">Architecture</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Stack Technique
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-2"><ShieldAlert size={14} className="text-analytica-accent"/> Sécurisé</span>
              <span className="flex items-center gap-2"><Globe size={14} className="text-blue-500"/> Scalable</span>
              <span className="flex items-center gap-2"><Code2 size={14} className="text-green-500"/> Maintenu</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {service.tags.map((tag, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="px-5 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-analytica-accent/50 hover:text-analytica-accent transition-all cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section id="process" className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <LazyImage 
            src={images.process}
            alt="Process"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#020617] dark:to-[#020617]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-analytica-accent font-mono text-xs uppercase tracking-[0.3em] font-bold mb-2 block">{t('service.workflow')}</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('service.engineering')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Notre méthodologie éprouvée pour garantir le succès de votre projet
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-analytica-accent via-slate-200 dark:via-slate-700 to-transparent"></div>

            <div className="space-y-12 md:space-y-0">
              {service.process.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Step Number */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-analytica-accent text-white flex items-center justify-center font-display text-2xl font-bold shadow-lg shadow-analytica-accent/30 z-10">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Content Card */}
                  <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${i % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                    <Card variant="tech" className="p-8 group hover:border-analytica-accent/50 transition-all">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-analytica-accent transition-colors">
                        {step.step}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-[#011024]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-analytica-accent font-mono text-xs font-bold uppercase tracking-widest mb-4 block">
                {t('service.gains')}
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Maximisez votre <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-analytica-accent to-orange-400">Capital Data.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl">
                Des bénéfices concrets et mesurables pour votre entreprise, avec un retour sur investissement rapide.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.benefits.map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-analytica-accent/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Impact Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-analytica-accent/20 to-orange-500/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-[500px] rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                <LazyImage 
                  src={images.impact}
                  alt="Impact"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                    <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest mb-2">Impact mesurable</div>
                    <div className="text-white text-lg font-bold leading-tight">
                      Architecture résiliente conçue pour la performance et l'évolutivité.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      {relatedServices.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <span className="text-analytica-accent font-mono text-xs uppercase tracking-[0.3em] font-bold mb-2 block">Explorer</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  Services connexes
                </h2>
              </div>
              <Link to="/services" className="text-analytica-accent font-mono text-sm hover:underline flex items-center gap-2">
                Voir tous les services <ArrowRight size={16}/>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((related, i) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/services/${related.id}`}>
                    <Card variant="tech" className="p-6 h-full group hover:border-analytica-accent/50 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-analytica-accent/10 flex items-center justify-center text-analytica-accent">
                          <related.icon size={24} />
                        </div>
                        <span className="text-xs font-mono text-slate-400 uppercase">SYS-{related.id.toUpperCase()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-analytica-accent transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {related.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-analytica-accent text-xs font-mono font-bold uppercase tracking-wider">
                        <span>Découvrir</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-analytica-accent/10 via-transparent to-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Prêt à démarrer <span className="text-analytica-accent">{service.title}</span> ?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Contactez nos experts pour discuter de votre projet et obtenir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/contact" variant="shiny" className="!px-10 !py-4 text-base">
                <MessageSquare size={18} className="mr-2"/>
                Demander un devis
              </Button>
              <Button to="/services" variant="outline" className="!px-10 !py-4 text-base">
                <FileText size={18} className="mr-2"/>
                Voir les autres services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;