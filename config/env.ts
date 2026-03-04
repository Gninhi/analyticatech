import { z } from 'zod';

/**
 * CONFIGURATION ENVIRONNEMENT
 * Centralise et valide toutes les variables d'environnement.
 * Toutes les clés sensibles doivent être dans le fichier .env
 */

const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  VITE_DEGRADED_MODE: z.coerce.boolean().default(false),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_POSTHOG_HOST: z.string().url().default('https://eu.i.posthog.com'),
  VITE_TURNSTILE_SITE_KEY: z.string().optional(),
});

// Helper to safely access import.meta.env
interface ImportMetaEnv {
  MODE?: string;
  PROD?: boolean;
  DEV?: boolean;
  VITE_DEGRADED_MODE?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_POSTHOG_KEY?: string;
  VITE_POSTHOG_HOST?: string;
  VITE_TURNSTILE_SITE_KEY?: string;
}

const metaEnv: ImportMetaEnv = (import.meta as unknown as { env: ImportMetaEnv }).env || {};

const _env = {
  MODE: metaEnv.MODE,
  VITE_DEGRADED_MODE: metaEnv.VITE_DEGRADED_MODE,
  VITE_SUPABASE_URL: metaEnv.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: metaEnv.VITE_SUPABASE_ANON_KEY,
  VITE_POSTHOG_KEY: metaEnv.VITE_POSTHOG_KEY,
  VITE_POSTHOG_HOST: metaEnv.VITE_POSTHOG_HOST,
  VITE_TURNSTILE_SITE_KEY:
    (!metaEnv.VITE_TURNSTILE_SITE_KEY || metaEnv.VITE_TURNSTILE_SITE_KEY === 'YOUR_TURNSTILE_SITE_KEY_HERE') && !metaEnv.PROD
      ? '1x00000000000000000000AA'
      : metaEnv.VITE_TURNSTILE_SITE_KEY,
};

const parsedEnv = envSchema.safeParse(_env);

if (!parsedEnv.success) {
  console.warn('⚠️ Configuration environnement partielle :', parsedEnv.error.format());
}

export const config = {
  app: {
    name: 'Analyticatech',
    version: '3.2.1',
    isProduction: metaEnv.PROD,
    isDegraded: parsedEnv.success ? parsedEnv.data.VITE_DEGRADED_MODE : false,
  },
  supabase: {
    url: parsedEnv.success ? (parsedEnv.data.VITE_SUPABASE_URL || '') : '',
    key: parsedEnv.success ? (parsedEnv.data.VITE_SUPABASE_ANON_KEY || '') : '',
  },
  api: {
    timeout: 8000,
  },
  analytics: {
    key: parsedEnv.success ? (parsedEnv.data.VITE_POSTHOG_KEY || '') : '',
    host: parsedEnv.success ? parsedEnv.data.VITE_POSTHOG_HOST : 'https://eu.i.posthog.com',
  },
  turnstile: {
    siteKey: parsedEnv.success ? (parsedEnv.data.VITE_TURNSTILE_SITE_KEY || '') : '',
  }
};