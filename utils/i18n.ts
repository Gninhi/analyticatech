import type { Locale } from '../types';

/**
 * Résout un champ bilingue ou une chaîne brute dans la locale cible.
 * Centralise la logique qui était répétée dans chaque mapper de contentService.
 *
 * @param obj  - Un objet { fr, en } ou une chaîne brute
 * @param locale - La locale cible ('fr' | 'en')
 * @returns    La chaîne dans la locale demandée
 */
export const resolveLocale = (obj: any, locale: Locale): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    // Support robuste pour les objets JSONB Supabase
    return obj[locale] || obj['fr'] || (typeof obj === 'object' ? JSON.stringify(obj) : '');
};

/**
 * Localise un objet en résolvant automatiquement les champs bilingues spécifiés.
 * Remplace la répétition manuelle : `title: f(s.title, locale), desc: f(s.desc, locale)...`
 *
 * @param obj    - L'objet source
 * @param locale - La locale cible
 * @param fields - Les clés à résoudre (ex: ['title', 'description', 'result'])
 * @returns      Un nouvel objet avec les champs traduits
 */
export const localizeFields = <T extends Record<string, any>>(
    obj: T,
    locale: Locale,
    fields: (keyof T)[]
): T =>
    fields.reduce(
        (acc, key) => ({ ...acc, [key]: resolveLocale(obj[key], locale) }),
        { ...obj }
    );

/**
 * Convertit les clés snake_case en camelCase dans un objet.
 * Utile pour normaliser les réponses Supabase.
 *
 * @param obj - L'objet avec des clés potentiellement snake_case
 * @returns   Un nouvel objet avec des clés camelCase
 */
export const snakeToCamel = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
            value,
        ])
    );
};
