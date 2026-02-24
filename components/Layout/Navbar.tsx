import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Command, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { animateScroll as scroll } from 'react-scroll';
import { ThemeMode } from '../../types/index';
import Logo from '../UI/Logo';
import Button from '../UI/Button';
import { NAV_ITEMS } from '../../data/constants';
import { useI18n } from '../System/I18nProvider';

// --- SCRAMBLE LOGIC ---
const useScramble = (text: string, trigger: boolean) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#&";

  useEffect(() => {
    if (trigger) {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplay(text);
    }
  }, [trigger, text]);

  return display;
};

// Component for Scramble Link
const ScrambleLink = ({ text, isActive, isHovered }: { text: string, isActive: boolean, isHovered: boolean }) => {
  const display = useScramble(text, isHovered || isActive);

  return (
    <span className="relative inline-flex items-center justify-center gap-0.5 text-sm h-5">
      <span className={`font-mono text-analytica-accent transition-opacity duration-300 w-2 text-center select-none ${isActive || isHovered ? 'opacity-100' : 'opacity-0'}`}>[</span>
      <span className="relative z-10 font-mono font-bold tracking-tight whitespace-nowrap min-w-fit text-center">
        {display}
      </span>
      <span className={`font-mono text-analytica-accent transition-opacity duration-300 w-2 text-center select-none ${isActive || isHovered ? 'opacity-100' : 'opacity-0'}`}>]</span>
    </span>
  );
};

// Extracted NavLinkItem component to fix useState in map() violation
const NavLinkItem = ({ item, locale }: { item: typeof NAV_ITEMS[0], locale: 'fr' | 'en' }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = location.pathname === item.path;

  return (
    <NavLink
      to={item.path}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-4 py-2 text-xs transition-all duration-300 rounded-lg flex items-center gap-2 group overflow-hidden ${isActive
        ? 'text-analytica-main dark:text-white'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      {isActive && (
        <motion.span
          layoutId="navbar-active-pill"
          className="absolute inset-0 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg -z-10 shadow-sm"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {!isActive && isHovered && (
        <motion.span
          layoutId="navbar-hover-pill"
          className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-lg -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <span className={`font-mono text-[9px] transition-colors ${isActive
        ? 'text-analytica-accent font-bold'
        : 'text-slate-300 dark:text-slate-600 group-hover:text-analytica-accent font-medium'
        }`}>
        {item.id}
      </span>

      <ScrambleLink text={item.label[locale]} isActive={isActive} isHovered={isHovered} />
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DARK);
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();

  // Initialisation du thème avec persistance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('analytica_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      document.documentElement.classList.add('dark');
      setTheme(ThemeMode.DARK);
    } else {
      document.documentElement.classList.remove('dark');
      setTheme(ThemeMode.LIGHT);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === ThemeMode.DARK) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('analytica_theme', 'light');
      setTheme(ThemeMode.LIGHT);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('analytica_theme', 'dark');
      setTheme(ThemeMode.DARK);
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    setLocale(newLocale);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scroll.scrollToTop({ duration: 800, smooth: 'easeInOutQuart' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled
        ? 'bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl border-slate-200 dark:border-white/5 py-3 shadow-lg'
        : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* --- LOGO AREA --- */}
          <div className="flex-shrink-0 flex items-center pr-4 md:pr-6 border-r border-transparent md:border-slate-200 dark:md:border-white/10">
            <NavLink
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-3 group relative"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <div className="absolute inset-0 bg-analytica-accent/0 group-hover:bg-analytica-accent/20 blur-xl rounded-full transition-all duration-500 scale-0 group-hover:scale-150 pointer-events-none"></div>

              <div className="text-analytica-main dark:text-white transition-colors duration-300 relative z-10">
                <Logo className="h-9 w-auto" forceHover={isLogoHovered} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg md:text-xl tracking-tighter text-slate-900 dark:text-white leading-none flex gap-[1px]">
                  ANALYTICA
                  <span className="text-analytica-accent">TECH</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 tracking-[0.35em] group-hover:text-analytica-accent transition-colors uppercase hidden sm:block">
                  Systems
                </span>
              </div>
            </NavLink>
          </div>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden xl:flex items-center flex-1 justify-end space-x-3">
            <div className="flex items-center bg-white/40 dark:bg-[#000510]/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-xl p-1 mr-4 shadow-sm transition-colors hover:border-slate-300 dark:hover:border-white/20">
              {NAV_ITEMS.map((item) => (
                <NavLinkItem key={item.path} item={item} locale={locale} />
              ))}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-4">

              {/* THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-analytica-accent hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                aria-label="Changer le thème"
              >
                {theme === ThemeMode.DARK ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* LANGUAGE TOGGLE */}
              <button
                onClick={toggleLanguage}
                className="h-10 px-3 flex items-center justify-center rounded-lg text-xs font-mono font-bold text-slate-700 dark:text-slate-400 hover:text-analytica-accent hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                aria-label="Changer la langue"
              >
                <span className={locale === 'fr' ? 'text-analytica-accent' : 'opacity-50'}>FR</span>
                <span className="mx-1 opacity-30">|</span>
                <span className={locale === 'en' ? 'text-analytica-accent' : 'opacity-50'}>EN</span>
              </button>

              <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-white/5 px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 cursor-help min-w-[80px] justify-center" title="Commande (Ctrl+K)">
                <Command size={12} />
                <span>CMD+K</span>
              </div>
            </div>

            <div className="transform origin-right pl-2 pr-2">
              <Button to="/contact" variant="shiny" icon={true} className="!py-2.5 !px-5 text-xs whitespace-nowrap">
                {t('common.audit')}
              </Button>
            </div>
          </div>

          <div className="xl:hidden flex items-center gap-4">
            {/* MOBILE LANG TOGGLE */}
            <button onClick={toggleLanguage} className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {locale.toUpperCase()}
            </button>
            <button onClick={toggleTheme} className="text-slate-700 dark:text-slate-300 p-2">
              {theme === ThemeMode.DARK ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 dark:text-white p-2 border border-slate-200 dark:border-white/10 rounded-lg bg-white/10 backdrop-blur-md active:scale-95 transition-transform"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden fixed top-[70px] left-0 w-full bg-slate-50/95 dark:bg-[#000000]/98 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 overflow-hidden z-40"
          >
            <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern opacity-[0.03]"></div>

            <nav className="relative z-10 px-6 pt-8 pb-8 flex flex-col h-full overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-analytica-accent uppercase tracking-[0.25em] mb-6 opacity-70">
                  <span className="w-2 h-2 bg-analytica-accent rounded-full animate-pulse"></span>
                  Navigation Système
                </div>

                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between py-4 border-b border-slate-200 dark:border-white/5 transition-all ${isActive
                        ? 'pl-4 border-l-2 border-l-analytica-accent bg-analytica-accent/5'
                        : 'hover:pl-4 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-xs ${isActive ? 'text-analytica-accent' : 'text-slate-400'}`}>
                          {item.id}
                        </span>
                        <span className={`text-xl font-display font-bold tracking-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                          {item.label[locale]}
                        </span>
                      </div>
                      {isActive && <ChevronRight size={16} className="text-analytica-accent" />}
                    </NavLink>
                  );
                })}
              </div>

              <div className="mt-auto mb-24 space-y-6 pt-8">
                <div className="p-4 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Statut du Projet</div>
                  <div onClick={() => setIsOpen(false)}>
                    <Button to="/contact" variant="shiny" className="w-full justify-between group">
                      <span>{t('common.start')}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;