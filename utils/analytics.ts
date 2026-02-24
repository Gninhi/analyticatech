import posthog from 'posthog-js';
import { config } from '../config/env';

export const analytics = {
  isInitialized: false,

  init: () => {
    if (analytics.isInitialized) return;
    // On n'initialise que si la clé est disponible (env var)
    if (!config.analytics.key) {
      console.warn('[Analytics] POSTHOG_KEY manquant, analytics désactivé.');
      return;
    }

    // Initialisation en mode "Memory" (pas de cookies par défaut)
    // Cela respecte le RGPD tant que l'utilisateur n'a pas accepté
    posthog.init(config.analytics.key, {
      api_host: config.analytics.host,
      autocapture: false, // On préfère tracker manuellement les événements métier
      capture_pageview: false, // On gère manuellement avec React Router
      persistence: 'memory', // CRITIQUE: Pas de cookies/localStorage avant consentement
      disable_session_recording: true,
    });

    analytics.isInitialized = true;
  },

  /** Active le tracking complet après consentement */
  optIn: () => {
    if (!analytics.isInitialized) analytics.init();
    posthog.set_config({ persistence: 'localStorage+cookie' });
    posthog.set_config({ disable_session_recording: false });
    posthog.capture('$opt_in');
  },

  /** Désactive tout tracking */
  optOut: () => {
    posthog.opt_out_capturing();
    posthog.reset();
  },

  /** Envoi d'un événement métier propre */
  track: (eventName: string, properties?: Record<string, any>) => {
    if (analytics.isInitialized) posthog.capture(eventName, properties);
  },

  /** Identification utilisateur (post-login ou contact form) */
  identify: (distinctId: string, userProperties?: Record<string, any>) => {
    if (analytics.isInitialized) posthog.identify(distinctId, userProperties);
  },

  /** Vue de page (SPA) */
  pageView: (path: string) => {
    if (analytics.isInitialized) posthog.capture('$pageview', { $current_url: path });
  },
};

export default analytics;