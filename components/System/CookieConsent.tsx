
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAnalytics } from './AnalyticsProvider';

const CONSENT_KEY = 'analytica_consent_v1';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { grantConsent, denyConsent } = useAnalytics();

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    grantConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    denyConsent();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] sm:w-[380px]"
        >
          <div className="bg-white dark:bg-[#010B19] border border-slate-200 dark:border-white/10 rounded-[28px] shadow-2xl p-6 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-analytica-accent/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-analytica-accent/10 dark:bg-analytica-accent/20 rounded-2xl flex items-center justify-center text-analytica-accent border border-analytica-accent/20 shadow-inner">
                  <Cookie size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display tracking-tight leading-none mb-1.5">
                    Confidentialité & Données
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-green-600 dark:text-green-500 font-bold uppercase tracking-wider">
                    <Shield size={10} /> RGPD Compliant
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                Nous utilisons PostHog (hébergement EU) pour améliorer votre expérience via une analyse anonyme. Aucune revente de données.
              </p>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleAccept}
                    className="flex items-center justify-center gap-2 h-11 bg-analytica-accent hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-analytica-accent/20 active:scale-95"
                  >
                    <Check size={14} /> Accepter
                  </button>
                  <button 
                    onClick={handleDecline}
                    className="h-11 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
                  >
                    Refuser
                  </button>
                </div>
                
                <div className="flex justify-center">
                  <NavLink to="/legal" className="text-[10px] font-bold text-slate-400 hover:text-analytica-accent transition-colors underline underline-offset-4 decoration-slate-200 dark:decoration-white/10">
                    En savoir plus sur notre politique
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
