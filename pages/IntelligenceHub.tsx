
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Terminal, Workflow, FileText, Lock, Copy, ArrowRight, Layers, Loader2, AlertTriangle, Database } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import LazyImage from '../components/UI/LazyImage';
import { Resource } from '../types/index';
import { usePageSEO } from '../hooks/usePageSEO';
import { useResources } from '../hooks/useContent';
import { useI18n } from '../components/System/I18nProvider';
import { isLiveMode } from '../lib/supabase';

const CATEGORIES: { label: string; value: string | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Prompts', value: 'prompt' },
  { label: 'Workflows', value: 'workflow' },
  { label: 'Analyses', value: 'whitepaper' },
];

const FilterBar = ({ activeCategory, onCategoryChange }: { activeCategory: string, onCategoryChange: (c: string) => void }) => (
  <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
    {CATEGORIES.map((cat) => (
      <button
        key={cat.value}
        onClick={() => onCategoryChange(cat.value)}
        className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
          activeCategory === cat.value
            ? 'bg-analytica-accent text-white border-analytica-accent shadow-lg shadow-analytica-accent/20'
            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30'
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

const ResourceCard: React.FC<{ resource: Resource<string> }> = ({ resource }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const IconType = {
    'prompt': Terminal,
    'workflow': Workflow,
    'whitepaper': FileText,
    'article': Layers
  }[resource.type] || FileText;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="tech" className="h-full flex flex-col p-8 group relative overflow-hidden">
        {resource.isPremium && (
          <div className="absolute top-0 right-0 p-2 z-20">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-2xl flex items-center gap-1.5 shadow-xl">
              <Lock size={12} /> PREMIUM
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
           <div className="w-12 h-12 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-analytica-accent flex items-center justify-center group-hover:bg-analytica-accent group-hover:text-white transition-all duration-500 shadow-inner">
             <IconType size={24} />
           </div>
           <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10">
             {resource.type}
           </span>
        </div>

        <div className="mb-8 flex-1">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-analytica-accent transition-colors">
            {resource.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
            {resource.description}
          </p>

          {resource.type === 'prompt' && (
            <div className="mt-5 p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-500 dark:text-slate-400 overflow-hidden relative group/prompt">
              <button 
                onClick={(e) => { e.preventDefault(); handleCopy(resource.content || ''); }}
                className="absolute top-2 right-2 p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl text-slate-400 hover:text-analytica-accent transition-all shadow-sm"
                title="Copier le prompt"
              >
                {copied ? <span className="text-green-500 font-bold text-[9px]">COPIÉ!</span> : <Copy size={14} />}
              </button>
              <div className="line-clamp-3 pr-8 italic">
                <span className="text-analytica-accent font-bold">$</span> {resource.content}
              </div>
            </div>
          )}

          {(resource.type === 'whitepaper' || resource.type === 'article') && (
            <div className="mt-5 h-28 w-full rounded-2xl overflow-hidden relative border border-slate-200 dark:border-white/10">
              <LazyImage 
                src={resource.thumbnailUrl || ''} 
                alt={resource.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
           <div className="flex gap-2">
             {(resource.category || []).slice(0, 2).map((cat, i) => (
               <span key={i} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200 dark:border-white/10">
                 #{cat}
               </span>
             ))}
           </div>
           
           <span className="flex items-center gap-2 text-[10px] font-bold text-analytica-accent uppercase tracking-widest group-hover:translate-x-1 transition-transform">
             {resource.type === 'workflow' ? 'Get JSON' : resource.type === 'prompt' ? resource.model : 'Lire plus'}
             <ArrowRight size={12} />
           </span>
        </div>
      </Card>
    </motion.div>
  );
};

const IntelligenceHub: React.FC = () => {
  const { t } = useI18n();
  usePageSEO({ title: t('nav.hub'), description: "Bibliothèque de prompts, workflows n8n et ressources stratégiques IA." });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "8%"]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Récupération des données et de l'erreur
  const { data: resources, isLoading, error } = useResources();

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    
    return resources.filter(res => {
      const matchesCategory = activeCategory === 'all' 
        ? true 
        : activeCategory === 'whitepaper' 
          ? (res.type === 'whitepaper' || res.type === 'article')
          : res.type === activeCategory;
      
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, resources]);

  return (
    <div className="w-full overflow-hidden">
      <section className="h-[75vh] flex flex-col justify-center px-4 max-w-7xl mx-auto relative z-10 pt-20">
        <motion.div 
          style={{ x: ghostX }} 
          className="absolute top-[25%] right-[-5%] text-[15vw] font-display font-bold text-slate-200/40 dark:text-white/[0.015] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
        >
          KNOWLEDGE
        </motion.div>
        
        <motion.div style={{ y: titleY }} className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-[2px] bg-analytica-accent"></div>
             <span className="text-analytica-accent font-bold font-mono text-xs tracking-[0.3em] uppercase">Base de Connaissance</span>
          </div>
          
          <AnimatedHeading 
             text="INTELLIGENCE" 
             highlightText="HUB"
             size="9xl"
          />

          <p className="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed border-l-4 border-analytica-accent/30 pl-8 font-medium">
            Accédez à notre bibliothèque de prompts, workflows d'automatisation et analyses stratégiques. 
          </p>

          <div className="mt-12 relative max-w-2xl group">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={22} className="text-slate-400 group-focus-within:text-analytica-accent transition-colors" />
             </div>
             <input 
               type="text" 
               placeholder={t('hub.search')} 
               className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-analytica-accent focus:ring-1 focus:ring-analytica-accent outline-none backdrop-blur-md transition-all shadow-xl shadow-slate-200/50 dark:shadow-none font-medium"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </motion.div>
      </section>

      <section className="pb-40 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 sticky top-24 z-40 py-6 px-4 bg-slate-50/90 dark:bg-[#000510]/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
             <div className="flex items-center gap-6 overflow-hidden">
                <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
             </div>
             <div className="text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
               {isLoading ? "Synchronisation..." : `${filteredResources.length} Ressources`}
             </div>
          </div>

          {error && (
            <div className="p-6 mb-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500">
               <AlertTriangle size={24} />
               <div>
                 <h4 className="font-bold">Erreur de Connexion</h4>
                 <p className="text-sm opacity-80">Impossible de joindre le serveur de données. Vérifiez votre connexion.</p>
               </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
               <Loader2 className="animate-spin text-analytica-accent" size={48} />
               <div className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest animate-pulse">Initialisation du Nexus...</div>
            </div>
          )}

          {!isLoading && !error && (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="text-center py-32">
              <Database size={64} className="mx-auto mb-6 text-slate-400 dark:text-slate-700" strokeWidth={1} />
              <p className="text-lg font-display font-bold text-slate-500 tracking-tight">Aucune ressource trouvée.</p>
              
              {/* DEBUG HELPER POUR LE DEV */}
              {isLiveMode() && (
                 <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-md mx-auto text-amber-600 dark:text-amber-500 text-xs font-mono text-left">
                    <p className="font-bold mb-2 uppercase flex items-center gap-2"><AlertTriangle size={12}/> Admin Debug Hint:</p>
                    <p>Si vous avez des données dans Supabase "resources" mais qu'elles n'apparaissent pas :</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1 opacity-80">
                       <li>Vérifiez que <strong>RLS (Row Level Security)</strong> est désactivé ou qu'une Policy "Public Read" existe.</li>
                       <li>Vérifiez le nom de la table : <strong>resources</strong> (pluriel).</li>
                       <li>Vérifiez la colonne <strong>type</strong> (valeurs attendues: 'prompt', 'workflow', etc).</li>
                    </ul>
                 </div>
              )}
            </div>
          )}

          <div className="mt-32">
            <Card variant="tech" className="p-16 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-analytica-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-none">
                      {t('hub.premium')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-medium">
                      Accédez à l'intégralité de nos bibliothèques d'agents autonomes et aux modèles n8n avancés.
                    </p>
                  </div>
                  <Button to="/contact" variant="shiny" className="whitespace-nowrap h-16 !px-12 text-base">
                     <Lock size={18} className="mr-3" /> ACCÈS PRIVILÉGIÉ
                  </Button>
               </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntelligenceHub;
