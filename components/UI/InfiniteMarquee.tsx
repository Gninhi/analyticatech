import React from 'react';

const LOGOS = [
  "Microsoft Azure", "Snowflake", "Databricks", "Salesforce", "Google Cloud", 
  "Tableau", "PowerBI", "NVIDIA AI", "OpenAI", "Hubspot", "Oracle", "AWS", "Palantir"
];

const InfiniteMarquee: React.FC = () => {
  return (
    <div className="w-full py-12 overflow-hidden relative border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/40 backdrop-blur-sm z-20">
      
      {/* Masques de dégradé pour adoucir les bords et donner de la profondeur */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#000510] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#000510] to-transparent z-20 pointer-events-none"></div>

      {/* Container qui bouge */}
      <div className="flex w-fit animate-scroll hover:[animation-play-state:paused]">
        {/* On crée deux sets de logos identiques pour la boucle parfaite */}
        {/* Le keyframe 'scroll' translate de 0 à -50%, donc il faut que les deux sets soient identiques */}
        
        {/* SET 1 */}
        <div className="flex gap-16 px-8 items-center">
          {LOGOS.map((logo, i) => (
            <LogoItem key={`s1-${i}`} name={logo} />
          ))}
        </div>

        {/* SET 2 (Duplicate) */}
        <div className="flex gap-16 px-8 items-center">
          {LOGOS.map((logo, i) => (
             <LogoItem key={`s2-${i}`} name={logo} />
          ))}
        </div>
      </div>
    </div>
  );
};

const LogoItem: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-3 group cursor-default select-none transition-opacity duration-300 opacity-50 hover:opacity-100 grayscale hover:grayscale-0">
    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-analytica-accent transition-colors shadow-[0_0_0px_rgba(242,109,61,0)] group-hover:shadow-[0_0_10px_rgba(242,109,61,0.8)]"></div>
    <span className="text-2xl md:text-3xl font-display font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-nowrap tracking-tight">
      {name.toUpperCase()}
    </span>
  </div>
);

export default InfiniteMarquee;