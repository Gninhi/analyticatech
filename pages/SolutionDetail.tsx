import React from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ScrambleText from '../components/UI/ScrambleText';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';
import { useSolutionDetail } from '../hooks/useContent'; // Hook asynchrone

const SolutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // CMS Integration
  const { data: solution, isLoading } = useSolutionDetail(id || '');

  usePageSEO({ title: solution?.title || "Chargement...", description: solution?.shortDescription });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-analytica-accent" size={48} />
        <div className="text-xs font-mono text-slate-500 animate-pulse uppercase">Chargement de la Solution...</div>
      </div>
    );
  }

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  return (
    <div className="w-full overflow-hidden pt-28 pb-20">

      {/* HERO PRODUCT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <NavLink to="/solutions" className="inline-flex items-center text-xs font-mono text-analytica-accent mb-8 hover:underline">
          <ArrowLeft size={12} className="mr-2" /> CATALOGUE SOLUTIONS
        </NavLink>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full border border-analytica-accent/30 bg-analytica-accent/10 text-analytica-accent text-xs font-mono uppercase tracking-widest">
                PRODUCT V1.0
              </span>
              <span className="text-slate-400 text-xs font-mono">SYS-{String(solution?.id || 'ID').toUpperCase()}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
              {solution.title.toUpperCase()}
            </h1>
            <h2 className="text-2xl font-mono text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
               // {solution.subtitle}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-3xl">
              {solution.fullDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button to="/contact" variant="shiny">DÉPLOYER LA SOLUTION</Button>
              <Button to="/contact" variant="outline">VOIR LA DEMO</Button>
            </div>
          </div>

          {/* KPIs BOX */}
          <div className="lg:w-1/3">
            <Card variant="tech" className="p-8 h-full">
              <AnimatedHeading text="MÉTRIQUES CLÉS" size="5xl" />
              <div className="space-y-8">
                {solution.kpis.map((kpi, i) => (
                  <div key={i}>
                    <div className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{kpi.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">{kpi.label}</div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-white/10 mt-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full bg-analytica-accent"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* TECH SPECS GRID */}
      <section className="bg-slate-50 dark:bg-black/20 py-24 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* STACK */}
            <div>
              <AnimatedHeading text="Stack Technique" size="6xl" />
              <div className="flex flex-wrap gap-3">
                {solution.techStack.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded font-mono text-sm text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div className="lg:col-span-2">
              <AnimatedHeading text="Fonctionnalités" size="6xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solution.features.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-analytica-accent mt-2 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <AnimatedHeading text="Cas d'usage déployés" size="6xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solution.useCases.map((useCase, i) => (
            <Card key={i} variant="tech" className="p-6 text-center hover:border-analytica-accent transition-colors cursor-default">
              <ScrambleText text={useCase} className="font-bold text-slate-700 dark:text-slate-300" />
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default SolutionDetail;