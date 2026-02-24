
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, MapPin, ShieldCheck, Clock, ArrowRight, Github, Linkedin, Twitter, Server, Cpu, Globe } from 'lucide-react';
import Logo from '../UI/Logo';
import Card from '../UI/Card';
import ScrambleText from '../UI/ScrambleText';
import Button from '../UI/Button';
import { isLiveMode } from '../../lib/supabase';
import { useI18n } from '../System/I18nProvider';

const RealTimeClock = () => {
  const [time, setTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return <div className="flex items-center gap-2 font-mono text-[10px] text-analytica-accent tabular-nums"><Clock size={10} /><span>{time} UTC</span></div>;
};

const StatusIndicator = ({ label, status = "good" }: { label: string, status?: "good" | "warn" | "error" }) => {
  const colors = {
    good: "bg-green-500 shadow-[0_0_8px_#22c55e]",
    warn: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
    error: "bg-red-500 shadow-[0_0_8px_#ef4444]"
  };
  return (
    <div className="flex items-center gap-2 group cursor-help transition-all" title={`System Status: ${status.toUpperCase()}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${colors[status]} animate-pulse`}></div>
      <span className={`group-hover:text-white transition-colors uppercase tracking-widest text-[9px] ${status === 'good' ? 'text-green-500' : 'text-amber-500'}`}>{label}</span>
    </div>
  );
};

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <NavLink 
      to={to} 
      className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-analytica-main dark:hover:text-white transition-all duration-300 py-1"
    >
      <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-analytica-accent" />
      <span>{children}</span>
    </NavLink>
  </li>
);

const Footer: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<{label: string, status: "good" | "warn"}>({ label: "CHECKING...", status: "warn" });
  const { t, setLocale, locale } = useI18n(); // Utilisation du hook

  useEffect(() => {
    const isLive = isLiveMode();
    setDbStatus({
      label: isLive ? t('footer.db_connected') : t('footer.local_mode'),
      status: isLive ? "good" : "warn"
    });
  }, [t]);

  const toggleLang = () => {
    setLocale(locale === 'fr' ? 'en' : 'fr');
  };

  // FOOTER: Semi-transparent Obsidian (bg-[#000000]/90) pour un ancrage visuel fort
  return (
    <footer className="relative pt-24 bg-white/80 dark:bg-[#000000]/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 overflow-hidden z-10 transition-colors">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-analytica-accent/30 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-4 space-y-6 pr-4">
            <NavLink to="/" className="flex items-center gap-3 group w-fit">
              <div className="text-analytica-main dark:text-white"><Logo className="h-10 w-auto" /></div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white leading-none flex gap-[1px]">
                  <ScrambleText text="ANALYTICA" />
                  <span className="text-analytica-accent"><ScrambleText text="TECH" delay={300} /></span>
                </span>
              </div>
            </NavLink>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-l-2 border-analytica-accent/30 pl-4 max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4 pt-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-analytica-accent hover:border-analytica-accent transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1 h-1 bg-analytica-accent rounded-full"></span> Navigation
            </h4>
            <ul className="space-y-1">
              <FooterLink to="/">{t('nav.home')}</FooterLink>
              <FooterLink to="/services">{t('nav.services')}</FooterLink>
              <FooterLink to="/solutions">{t('nav.solutions')}</FooterLink>
              <FooterLink to="/about">{t('nav.about')}</FooterLink>
              <FooterLink to="/legal">Légal & RGPD</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1 h-1 bg-analytica-accent rounded-full"></span> {t('footer.expertise')}
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Business Intelligence', id: 'business-intelligence', code: 'BI-CORE' },
                { label: 'Hyper-Automatisation', id: 'hyper-automatisation', code: 'N8N-AUTO' },
                { label: 'Data Engineering', id: 'data-engineering', code: 'DATA-PIPE' },
                { label: 'Développement Sur-Mesure', id: 'custom-dev', code: 'DEV-CUSTOM' }
              ].map((item) => (
                <li key={item.id}>
                  <NavLink to={`/services/${item.id}`} className="group flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all">
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-analytica-main dark:group-hover:text-white transition-colors">{item.label}</span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-600 group-hover:text-analytica-accent bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{item.code}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col h-full">
             <Card variant="tech" className="h-full flex flex-col p-6 !rounded-2xl !bg-white/60 dark:!bg-white/5 border-slate-200 dark:border-white/10 hover:border-analytica-accent/40 transition-colors group">
               <div className="mb-auto relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">{t('footer.avail')}</span>
                 </div>
                 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('footer.project_init')}</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                   {t('footer.project_desc')}
                 </p>
                 <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
                   <li className="flex items-start gap-3"><MapPin size={16} className="text-analytica-accent shrink-0 mt-0.5"/><span className="text-xs">Paris, 8ème Arr.</span></li>
                   <li className="flex items-center gap-3"><Mail size={16} className="text-analytica-accent shrink-0"/><a href="mailto:contact@analyticatech.fr" className="text-xs hover:text-analytica-main dark:hover:text-white transition-colors">contact@analyticatech.fr</a></li>
                 </ul>
               </div>
               <div className="relative z-10 w-full mt-4">
                 <Button to="/contact" variant="shiny" className="w-full justify-center" icon={true}>
                   {t('footer.start_btn')}
                 </Button>
               </div>
             </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 dark:text-slate-500 font-medium pt-8 border-t border-slate-200 dark:border-white/5">
          <p>&copy; {new Date().getFullYear()} Analyticatech SAS. {t('footer.rights')}</p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1 hover:text-analytica-accent transition-colors cursor-pointer"><ShieldCheck size={12}/> <span>ISO 27001</span></div>
             <button onClick={toggleLang} className="flex items-center gap-1 hover:text-analytica-accent transition-colors cursor-pointer uppercase">
               <Globe size={12}/> <span>FR / EN</span>
             </button>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-slate-50/90 dark:bg-[#000205]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/5 py-2 px-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider z-20 relative">
        <div className="flex gap-6 items-center">
          <StatusIndicator label={dbStatus.label} status={dbStatus.status} />
          <div className="hidden sm:flex items-center gap-2"><Server size={10} /> <span>EU-WEST-3</span></div>
          <div className="hidden sm:flex items-center gap-2"><Cpu size={10} /> <span>LOAD: 12%</span></div>
        </div>
        <div className="flex gap-6 mt-2 sm:mt-0 items-center">
           <RealTimeClock />
           <span className="opacity-40">|</span>
           <span className="opacity-60">BUILD v3.3.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
