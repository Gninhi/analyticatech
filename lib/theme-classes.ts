/**
 * Classes Tailwind centralisées pour la gestion du thème.
 * Utilise UNIQUEMENT les tokens existants de tailwind.config.js.
 * À importer dans tout composant nécessitant des variantes light/dark.
 */

export const themeClasses = {
    // Surfaces
    surface: {
        overlay: 'bg-white/80 dark:bg-[#000510]/96',
        panel: 'bg-white dark:bg-[#000510]',
        subtle: 'bg-slate-50 dark:bg-white/5',
        border: 'border-slate-200 dark:border-white/10',
        borderSubtle: 'border-slate-100 dark:border-white/5',
        divider: 'bg-slate-200 dark:bg-white/5',
    },

    // Textes
    text: {
        primary: 'text-slate-900 dark:text-white',
        secondary: 'text-slate-600 dark:text-slate-400',
        muted: 'text-slate-400 dark:text-white/30',
        accent: 'text-analytica-accent',
        nav: {
            active: 'text-analytica-main dark:text-white',
            inactive: 'text-slate-500 dark:text-slate-400',
        },
    },

    // Boutons interactifs (non CTA)
    control: {
        default: [
            'border-slate-300 dark:border-white/10',
            'text-slate-600 dark:text-white/70',
            'bg-transparent',
        ].join(' '),
        active: [
            'border-analytica-accent',
            'bg-analytica-accent/10',
            'text-analytica-main dark:text-white',
        ].join(' '),
        hover: [
            'hover:border-analytica-accent',
            'hover:bg-analytica-accent/5',
            'hover:text-slate-900 dark:hover:text-white',
        ].join(' '),
    },

    // Options de sélection (langue, thème)
    option: {
        active: [
            'border-analytica-accent/30',
            'bg-analytica-accent/5',
            'text-analytica-accent',
            'font-bold',
        ].join(' '),
        inactive: [
            'border-slate-200 dark:border-white/5',
            'bg-slate-50 dark:bg-white/5',
            'text-slate-500 dark:text-white/50',
            'hover:text-slate-900 dark:hover:text-white',
            'hover:bg-slate-100 dark:hover:bg-white/10',
        ].join(' '),
    },

    // Labels de section (headings dans dropdown, etc.)
    sectionLabel: 'text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-white/30',

    // Boutons utilitaires (texte seul)
    utilButton: [
        'text-slate-500 dark:text-white/40',
        'hover:text-slate-900 dark:hover:text-white',
        'hover:bg-slate-100 dark:hover:bg-white/5',
    ].join(' '),

    // Navbar pill
    navPill: {
        container: 'bg-white/40 dark:bg-[#000510]/40 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
        active: 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm',
        hover: 'bg-slate-100 dark:bg-white/5',
    },
} as const;
