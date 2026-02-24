
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Button from '../components/UI/Button';
import ScrambleText from '../components/UI/ScrambleText';
import AnimatedHeading from '../components/UI/AnimatedHeading';
import { usePageSEO } from '../hooks/usePageSEO';
import { useI18n } from '../components/System/I18nProvider';

const NotFound: React.FC = () => {
  const { t } = useI18n();
  usePageSEO({ title: "404", description: "Page introuvable." });

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[repeating-linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),repeating-linear-gradient(45deg,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000)] bg-[length:10px_10px]"></div>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
          <AlertTriangle size={80} className="text-red-500 relative z-10 mx-auto" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-6xl md:text-9xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tighter">
          <ScrambleText text="404" className="text-red-500" />
        </h1>

        <div className="space-y-6 mb-12">
          <AnimatedHeading text="PROT_NOT_FOUND" size="6xl" />
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed border-l-2 border-red-500/50 pl-4 text-left font-medium">
             The requested path is invalid or the access is restricted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button to="/" variant="primary" icon={false}>
            <Home size={18} /> {t('nav.home')}
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost" icon={false}>
            <RefreshCcw size={18} /> RESET
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
