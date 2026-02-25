import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../../utils/analytics';

interface AnalyticsContextType {
  trackEvent: (name: string, props?: Record<string, unknown>) => void;
  grantConsent: () => void;
  denyConsent: () => void;
  hasConsent: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  grantConsent: () => {},
  denyConsent: () => {},
  hasConsent: false
});

export const useAnalytics = () => useContext(AnalyticsContext);

const CONSENT_KEY = 'analytica_consent_v1';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [hasConsent, setHasConsent] = useState(false);

  // 1. Initialisation au montage
  useEffect(() => {
    // On initialise PostHog (en mode mémoire/anonyme par défaut)
    analytics.init();

    // Vérification du consentement existant
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent === 'granted') {
      setHasConsent(true);
      analytics.optIn();
    }
  }, []);

  // 2. Tracking des changements de page (SPA)
  useEffect(() => {
    if (analytics.isInitialized) {
      analytics.pageView(location.pathname);
    }
  }, [location]);

  // 3. Gestion du consentement
  const grantConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setHasConsent(true);
    analytics.optIn();
    analytics.track('consent_granted');
  };

  const denyConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setHasConsent(false);
    analytics.optOut();
  };

  const trackEvent = (name: string, props?: any) => {
    analytics.track(name, props);
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, grantConsent, denyConsent, hasConsent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};