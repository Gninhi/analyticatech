import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, Workflow, BarChart3, Cloud, Cpu, Activity } from 'lucide-react';

// Configuration des outils (La Stack)
// Palette harmonisée : Orange (Accent) & Bleu (Main) pour la cohérence
const TOOLS = [
  { id: 'snowflake', name: 'Data Lake', icon: Database, x: 15, y: 20, color: '#38bdf8' }, // Sky Blue
  { id: 'n8n', name: 'Workflows', icon: Workflow, x: 30, y: 5, color: '#F26D3D' }, // Analytica Orange
  { id: 'salesforce', name: 'CRM Data', icon: Cloud, x: 70, y: 5, color: '#F26D3D' }, // Analytica Orange
  { id: 'powerbi', name: 'Analytics', icon: BarChart3, x: 85, y: 20, color: '#facc15' } // Yellow
];

const IntegrationFlux: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Point central (Le Core Analytica)
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height - 120; // Positionné vers le bas pour laisser de la place aux câbles

  return (
    <div ref={containerRef} className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-transparent">
      
      {/* --- SVG LAYER FOR CABLES --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#03318C" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#F26D3D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F26D3D" stopOpacity="1" />
          </linearGradient>
        </defs>

        {dimensions.width > 0 && TOOLS.map((tool, i) => {
          const targetX = (tool.x / 100) * dimensions.width;
          const targetY = (tool.y / 100) * dimensions.height;

          // Courbe de Bézier : Satellite -> Core (Top Center of Core Box)
          // On vise le haut de la boite centrale (centerY - 50px environ)
          const coreTopY = centerY - 50;
          
          const cp1X = targetX;
          const cp1Y = targetY + 150; // Descend d'abord
          const cp2X = centerX;
          const cp2Y = coreTopY - 100; // Arrive par le haut

          const pathD = `M ${targetX} ${targetY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${centerX} ${coreTopY}`;

          return (
            <g key={tool.id}>
              {/* Câble inactif (Structure) */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#1e293b" // Slate 800
                strokeWidth="1" 
                strokeDasharray="4 4"
                opacity="0.4"
              />

              {/* Flux d'énergie (Pulse Rapide) */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={`url(#cableGradient)`} // Gradient dynamique
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0], // Le flux traverse tout le câble
                  opacity: [0, 1, 0],
                  strokeDashoffset: [0, -50] 
                }}
                transition={{
                  duration: 2.5, // Rapide pour simuler la vitesse de traitement
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4, // Séquençage
                  repeatDelay: 0.2
                }}
                filter="url(#glow-line)"
              />
              
              {/* Particule de données (Paquet) - Animation via motion.div wrapper */}
              <motion.circle
                r="4"
                fill="white"
              >
                <animateMotion
                  dur="2.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                  fill="freeze"
                  path={pathD}
                />
              </motion.circle>
            </g>
          );
        })}
      </svg>

      {/* --- HTML LAYER FOR ICONS --- */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* THE CORE (Analytica Hub - Réceptacle) */}
        <div 
           className="absolute left-1/2 -translate-x-1/2 z-20"
           style={{ top: centerY - 60 }} // Centré sur le point d'arrivée
        >
           {/* Anneaux rotatifs externes (Data Gravity) */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-analytica-accent/10 animate-[spin_20s_linear_infinite]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-analytica-accent/20 animate-[spin_10s_linear_infinite_reverse]"></div>

           {/* Container Principal du Core */}
           <div className="relative w-28 h-28 rounded-3xl bg-slate-900/90 dark:bg-[#000510]/90 border border-analytica-accent/30 overflow-hidden shadow-[0_0_80px_rgba(242,109,61,0.15)] flex items-center justify-center backdrop-blur-xl">
              
              {/* LIQUID FILL EFFECT (Vague qui monte) */}
              <motion.div 
                 className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-analytica-accent via-[#FF8F5E] to-transparent opacity-80 z-0"
                 animate={{ 
                   height: ["30%", "60%", "40%", "80%", "50%"], // Simulation de remplissage chaotique
                   filter: ["hue-rotate(0deg)", "hue-rotate(15deg)", "hue-rotate(0deg)"] // Changement subtil de couleur
                 }}
                 transition={{ 
                   duration: 4, 
                   repeat: Infinity, 
                   ease: "easeInOut",
                   times: [0, 0.2, 0.5, 0.8, 1]
                 }}
              />
              
              {/* Vague secondaire (Effet 3D) */}
              <motion.div 
                className="absolute bottom-0 left-[-50%] right-[-50%] h-full bg-analytica-accent/20 rounded-[40%]"
                animate={{ transform: ["rotate(0deg) translateY(60%)", "rotate(360deg) translateY(60%)"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              {/* Surface du liquide (Ligne brillante) */}
              <motion.div 
                className="absolute left-0 right-0 h-[1px] bg-white opacity-60 blur-[1px] z-10"
                style={{ bottom: "50%" }}
                animate={{ bottom: ["30%", "60%", "40%", "80%", "50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] }}
              />

              {/* Icone CPU au premier plan */}
              <div className="relative z-20 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex flex-col items-center">
                <Cpu size={40} className="mb-1" />
                <span className="text-[8px] font-mono font-bold tracking-widest text-white/80">CORE</span>
              </div>

              {/* Scanline Effect (Retro Tech) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_3px] pointer-events-none z-30 opacity-50"></div>
           </div>
           
           {/* Badge Status */}
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
             <Activity size={12} className="text-green-500 animate-pulse" />
             <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest whitespace-nowrap">
               Processing Data
             </span>
           </div>
        </div>

        {/* THE SATELLITES (Sources de données) */}
        {TOOLS.map((tool, i) => (
          <div
            key={tool.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${tool.x}%`, top: `${tool.y}%` }}
          >
             <motion.div
               whileHover={{ scale: 1.1 }}
               initial={{ y: 0 }}
               animate={{ y: [0, -10, 0] }} // Float animation
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
               className="relative group"
             >
               {/* Carte outil */}
               <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900/80 dark:bg-[#010B19]/80 rounded-2xl border border-slate-700 dark:border-white/10 flex flex-col items-center justify-center gap-2 backdrop-blur-md shadow-lg relative overflow-hidden">
                  
                  {/* Effet de scan au passage de la donnée */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
                    animate={{ translateY: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, repeatDelay: 0.2, ease: "linear" }}
                  />

                  {/* Icone */}
                  <tool.icon size={24} style={{ color: tool.color }} className="relative z-10" />
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase relative z-10">{tool.name}</span>
               </div>

               {/* Indicateur d'émission */}
               <motion.div 
                 className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                 animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                 transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, repeatDelay: 0.2 }}
               >
                 <div className="w-2 h-2 rounded-full bg-analytica-accent blur-[2px]"></div>
               </motion.div>
             </motion.div>
          </div>
        ))}

      </div>

      {/* --- BACKGROUND DECORATION --- */}
      {/* Halo subtil derrière le core */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-analytica-accent/5 blur-[100px] pointer-events-none rounded-full"></div>
    </div>
  );
};

export default IntegrationFlux;