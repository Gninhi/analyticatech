
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Globe, Moon, Sun, Monitor, Accessibility, RotateCcw } from 'lucide-react';
import { useI18n } from '../System/I18nProvider';
import { useTheme } from '../System/ThemeProvider';
import { ThemeMode } from '../../types/index';
import { themeClasses } from '../../lib/theme-classes';

const ProtocolDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, setLocale } = useI18n();
    const { theme, setTheme } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const THEME_OPTIONS = [
        { id: ThemeMode.DARK, label: 'Dark', Icon: Moon },
        { id: ThemeMode.LIGHT, label: 'Light', Icon: Sun },
        { id: 'system' as const, label: 'Sys', Icon: Monitor },
    ];

    const LANG_OPTIONS = [
        { id: 'fr' as const, label: 'Français' },
        { id: 'en' as const, label: 'English' },
    ];

    return (
        <div className="relative" ref={dropdownRef} data-testid="protocol-dropdown">
            {/* TRIGGER */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                data-testid="protocol-trigger"
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`
          flex items-center gap-2.5 h-10 px-[14px] rounded-[12px] border
          transition-all duration-300
          ${isOpen ? themeClasses.control.active : `${themeClasses.control.default} ${themeClasses.control.hover}`}
        `}
            >
                <Settings2
                    size={16}
                    className={isOpen ? 'text-analytica-accent' : 'text-slate-500 dark:text-white/50'}
                />
                <span className={`text-[10px] font-mono font-bold tracking-[0.1em] uppercase ${themeClasses.text.primary}`}>
                    PROTOCOL
                </span>
            </button>

            {/* PANEL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
                        data-testid="protocol-panel"
                        className={`
              absolute right-0 mt-2 w-60 rounded-2xl
              ${themeClasses.surface.panel}
              backdrop-blur-xl
              ${themeClasses.surface.border}
              border
              p-[18px]
              shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              z-50 overflow-hidden
            `}
                    >
                        {/* Accent glow décor — visible uniquement en dark */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-analytica-accent/10 blur-[40px] rounded-full pointer-events-none dark:block hidden" />

                        {/* ── LANGUAGE ── */}
                        <div className="space-y-3 mb-6">
                            <h3 className={`${themeClasses.sectionLabel} flex items-center gap-2`}>
                                <Globe size={10} />
                                System Language
                            </h3>
                            <div className="grid grid-cols-2 gap-2" data-testid="language-options">
                                {LANG_OPTIONS.map(({ id, label }) => {
                                    const isActive = locale === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setLocale(id)}
                                            data-testid={`lang-${id}`}
                                            aria-pressed={isActive}
                                            className={`
                        relative flex items-center justify-center
                        py-2 px-3 rounded-lg text-[11px] font-medium
                        transition-all duration-150 border
                        ${isActive ? themeClasses.option.active : themeClasses.option.inactive}
                      `}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dot-lang"
                                                    className="absolute left-2 w-1 h-1 rounded-full bg-analytica-accent shadow-[0_0_8px_rgba(242,109,61,0.8)]"
                                                />
                                            )}
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── DISPLAY ── */}
                        <div className="space-y-3 mb-6">
                            <h3 className={`${themeClasses.sectionLabel} flex items-center gap-2`}>
                                <Monitor size={10} />
                                Display Mode
                            </h3>
                            <div className="grid grid-cols-3 gap-2" data-testid="theme-options">
                                {THEME_OPTIONS.map(({ id, label, Icon }) => {
                                    const isActive = theme === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setTheme(id)}
                                            data-testid={`theme-${id}`}
                                            aria-pressed={isActive}
                                            className={`
                        flex flex-col items-center gap-1.5 py-2.5 rounded-lg
                        text-[10px] transition-all duration-150 border
                        ${isActive ? themeClasses.option.active : themeClasses.option.inactive}
                      `}
                                        >
                                            <Icon size={12} className={isActive ? 'text-analytica-accent' : ''} />
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── DIVIDER ── */}
                        <div className={`h-px ${themeClasses.surface.divider} mb-4`} />

                        {/* ── UTILS ── */}
                        <div className="space-y-1">
                            <button className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-[11px] transition-colors group ${themeClasses.utilButton}`}>
                                <Accessibility size={12} className="group-hover:text-analytica-accent transition-colors" />
                                Accessibility
                            </button>
                            <button
                                data-testid="reset-preferences"
                                onClick={() => { setTheme('system'); setLocale('fr'); }}
                                className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-[11px] transition-colors group ${themeClasses.utilButton}`}
                            >
                                <RotateCcw size={12} className="group-hover:text-analytica-accent transition-colors" />
                                Reset Preferences
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProtocolDropdown;
