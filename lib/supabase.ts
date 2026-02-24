import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;

// Dev-only logging
const isDev = import.meta.env.DEV;
if (isDev && typeof window !== 'undefined') {
  console.log('[Supabase] Config:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
    key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
  });
}

const isValidConfig = supabaseUrl && supabaseKey && supabaseUrl.startsWith('http');

if (!isValidConfig && isDev) {
  console.warn(
    "[Supabase] Connexion impossible : URL ou Clé manquante.", 
    "Assurez-vous d'avoir rempli le fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY"
  );
  console.warn("[Supabase] Utilisation des données locales de fallback.");
}

export const supabase = isValidConfig
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

export const isLiveMode = (): boolean => {
  return !!supabase && !config.app.isDegraded;
};

/**
 * Transforme un chemin d'image brut en URL publique valide.
 * Gère intelligemment les buckets manquants.
 */
export const getStorageUrl = (path: string | null | undefined): string => {
  // 1. Fallback immédiat
  if (!path) return 'https://images.unsplash.com/photo-1531297461136-82ae88a0b78e?auto=format&fit=crop&w=800&q=80';

  // 2. URLs externes (http, https, data, //)
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('//')) {
    return path;
  }

  // 3. Nettoyage du chemin
  let cleanPath = path.replace(/^\/+/, ''); // Retire le slash initial

  // 4. Heuristique de Bucket :
  // Si le chemin ne contient pas de slash (ex: "mon-image.jpg"), c'est probablement juste un nom de fichier.
  // Supabase a besoin du bucket. On assume le bucket standard "images".
  if (!cleanPath.includes('/')) {
    cleanPath = `images/${cleanPath}`;
  }

  // 5. Construction URL Supabase
  const finalUrl = `${config.supabase.url}/storage/v1/object/public/${cleanPath}`;
  
  return finalUrl;
};