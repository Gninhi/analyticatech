
import React, { useState, useEffect } from 'react';
import { useTickerMetrics } from '../../hooks/useContent';

// --- SUB-COMPONENTS ---

const LiveValue = ({ baseValue, suffix }: { baseValue: number; suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (baseValue - start) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        startFluctuation();
      }
    };
    requestAnimationFrame(animateCount);

    let interval: ReturnType<typeof setInterval>;
    const startFluctuation = () => {
      interval = setInterval(() => {
        const noise = (Math.random() - 0.5) * (baseValue * 0.02);
        const next = baseValue + noise;
        setDisplayValue(Number(next.toFixed(2)));
      }, 3000);
    };

    return () => clearInterval(interval);
  }, [baseValue]);

  const formatted = displayValue % 1 !== 0 
    ? displayValue.toFixed(displayValue < 10 ? 2 : 1) 
    : Math.round(displayValue).toString();

  return (
    <span className="font-mono tabular-nums tracking-tight">
      {formatted}{suffix}
    </span>
  );
};

const TechSparkline = ({ d, color }: { d: string; color: string }) => {
  // CRITICAL FIX: Safe split logic
  if (!d || typeof d !== 'string') return null;
  const segments = d.trim().split(/\s+/); // Robust splitting
  if (segments.length === 0) return null;
  
  const lastVal = segments[segments.length - 1];
  const lastY = lastVal.includes(',') ? lastVal.split(',')[1] : lastVal;

  return (
    <div className="w-24 h-10 relative overflow-hidden">
      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <path d={d} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.2" />
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" />
        <circle cx="100" cy={lastY} r="2.5" fill={color} className="animate-pulse" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

const FiberOpticLine = ({ position }: { position: 'top' | 'bottom' }) => (
  <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 h-[1px] bg-slate-200 dark:bg-white/5 z-20 overflow-hidden opacity-50`}>
    <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-analytica-accent to-transparent opacity-50 blur-[2px] animate-[shimmer_3s_linear_infinite]"></div>
  </div>
);

const ScrollingPerformanceTicker: React.FC = () => {
  const { data: metrics, isLoading } = useTickerMetrics();

  if (isLoading || !metrics || metrics.length === 0) return null;

  return (
    // FIX: Fond semi-transparent au lieu de solide
    <div className="w-full bg-slate-50/50 dark:bg-[#020617]/50 backdrop-blur-md border-y border-slate-200 dark:border-white/5 relative overflow-hidden py-0 select-none group transition-colors duration-500">
      
      <FiberOpticLine position="top" />
      <FiberOpticLine position="bottom" />

      {/* TICKER CONTAINER */}
      <div className="flex w-max hover:[animation-play-state:paused] animate-scroll">
        {[...metrics, ...metrics].map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="flex items-center gap-6 px-10 py-6 border-r border-slate-200 dark:border-white/5 min-w-[340px] relative transition-colors hover:bg-white/40 dark:hover:bg-white/[0.02]"
          >
            {/* ICON BOX */}
            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm" style={{ color: item.color }}>
              <item.icon size={22} strokeWidth={2} />
            </div>

            {/* METRICS */}
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-display flex items-baseline gap-0.5 tracking-tight">
                  <LiveValue baseValue={item.baseValue} suffix={item.suffix} />
                </div>
                <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10" style={{ color: item.color }}>
                   {item.trend}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-bold">{item.label}</span>
                 <TechSparkline d={item.graph} color={item.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* LABEL LIVE */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-analytica-accent/30 backdrop-blur-md shadow-xl pointer-events-none">
         <span className="relative flex h-2.5 w-2.5">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 dark:bg-red-500"></span>
         </span>
         <span className="text-[9px] font-mono font-bold text-slate-900 dark:text-slate-200 tracking-[0.25em] uppercase">Status: Live</span>
      </div>
    </div>
  );
};

export default ScrollingPerformanceTicker;
