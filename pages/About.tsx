import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GitBranch, Cpu, Loader2 } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import LazyImage from '../components/UI/LazyImage';
import { usePageSEO } from '../hooks/usePageSEO';
import { useTeam, useMilestones, useCoreValues } from '../hooks/useContent'; // Hooks dynamiques

const About: React.FC = () => {
  usePageSEO({ title: "L'Agence", description: "Les ingénieurs et architectes derrière Analyticatech." });
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const ghostX = useTransform(scrollY, [0, 500], ["0%", "10%"]);

  // Récupération des données dynamiques
  const { data: team, isLoading: teamLoading } = useTeam();
  const { data: history, isLoading: historyLoading } = useMilestones();
  const { data: values, isLoading: valuesLoading } = useCoreValues();

  const isLoading = teamLoading || historyLoading || valuesLoading;

  return (
    <div className="w-full overflow-hidden">
      <section className="h-[70vh] flex flex-col justify-center px-4 max-w-7xl mx-auto relative z-10 pt-20 overflow-hidden">
        <motion.div style={{ x: ghostX }} className="absolute top-[20%] right-[-5%] text-[18vw] font-display font-bold text-slate-100/50 dark:text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter">SYSTEM CORE</motion.div>

        <motion.div style={{ y: titleY }} className="relative z-10">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-[1px] bg-analytica-accent"></div><span className="text-analytica-accent font-mono text-sm tracking-[0.2em] uppercase">Architecture Interne</span></div>

          <AnimatedHeading
            text="L'ARCHITECTE"
            highlightText="INVISIBLE"
            size="9xl"
          />

        </motion.div>
      </section>

      {isLoading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-analytica-accent" size={48} />
          <div className="text-xs font-mono text-slate-500 animate-pulse">Chargement de la base de données...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

          {/* HISTORY */}
          <section className="mb-40 relative">
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent"></div>
            <div className="space-y-20">
              {history && history.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={item.id} className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <Card variant="tech" className="p-6">
                        <div className="inline-block bg-analytica-accent/10 text-analytica-accent font-mono text-xs px-2 py-1 rounded mb-2">{item.year}</div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display tracking-tight"><span className="text-slate-400 dark:text-slate-500 mr-2">{item.version}</span>{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                      </Card>
                    </div>
                    <div className="absolute left-[11px] md:left-1/2 -translate-x-0 md:-translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 dark:bg-white border-4 border-slate-100 dark:border-[#000510] z-10 shadow-[0_0_15px_rgba(242,109,61,0.5)]"></div>
                    <div className="hidden md:block w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* VALUES */}
          <section className="mb-40">
            <div className="flex items-end justify-between mb-12 border-b border-slate-200 dark:border-white/10 pb-4">
              <AnimatedHeading text="Protocoles" highlightText="Noyau" size="7xl" />
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400"><Cpu size={14} /> <span>CPU: OPTIMIZED</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values && values.map((val) => (
                <Card key={val.id} variant="tech" className="p-6 group hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-900 dark:text-white mb-4 group-hover:text-analytica-accent transition-all">
                    <val.icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{val.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* TEAM */}
          <section className="relative">
            <div className="text-center mb-16">
              <AnimatedHeading text="Opérateurs" highlightText="Système" size="8xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team && team.map((member) => (
                <Card key={member.id} variant="tech" className="group overflow-hidden p-0 h-[400px]">
                  <div className="relative h-2/3 overflow-hidden">
                    <LazyImage
                      src={member.img}
                      alt={member.name}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#011024] dark:to-transparent opacity-90"></div>
                  </div>
                  <div className="absolute bottom-0 w-full p-6 bg-white/90 dark:bg-[#011024]/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-wide">{member.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500'} `}></div>
                    </div>
                    <div className="text-xs font-mono text-analytica-accent mb-1 uppercase">{member.role}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><GitBranch size={10} /> {member.spec}</div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-20 flex justify-center"><Button to="/contact" variant="shiny">REJOINDRE LE RÉSEAU</Button></div>
          </section>
        </div>
      )}
    </div>
  );
};

export default About;