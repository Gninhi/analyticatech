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
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Initialisation au montage - rendue plus robuste
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Vérification du consentement existant d'abord
        let initialConsent = false;
        if (typeof localStorage !== 'undefined') {
          const storedConsent = localStorage.getItem(CONSENT_KEY);
          if (storedConsent === 'granted') {
            initialConsent = true;
          }
        }

        // Initialisation différée pour éviter les blocages
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          analytics.init();
          if (initialConsent) {
            setHasConsent(true);
            analytics.optIn();
          }
        } catch (initError) {
          console.warn('[AnalyticsProvider] Analytics initialization failed, continuing without tracking:', initError);
        } finally {
          setIsInitialized(true);
        }
      } catch (error) {
        console.warn('[AnalyticsProvider] Setup error, continuing without analytics:', error);
        setIsInitialized(true);
      }
    };
    
    initializeAnalytics();
  }, []);

  // 2. Tracking des changements de page (SPA)
  useEffect(() => {
    if (analytics.isInitialized) {
      analytics.pageView(location.pathname);
    }
  }, [location]);

  // 3. Gestion du consentement
  const grantConsent = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONSENT_KEY, 'granted');
      }
      setHasConsent(true);
      if (analytics.isInitialized) {
        analytics.optIn();
        analytics.track('consent_granted');
      }
    } catch (error) {
      console.warn('[AnalyticsProvider] Consent grant failed:', error);
    }
  };

  const denyConsent = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONSENT_KEY, 'denied');
      }
      setHasConsent(false);
      if (analytics.isInitialized) {
        analytics.optOut();
      }
    } catch (error) {
      console.warn('[AnalyticsProvider] Consent denial failed:', error);
    }
  };

  const trackEvent = (name: string, props?: any) => {
    try {
      if (analytics.isInitialized) {
        analytics.track(name, props);
      }
    } catch (error) {
      console.warn('[AnalyticsProvider] Event tracking failed:', error);
    }
  };

  // Ne rendre les enfants que lorsque l'initialisation est terminée
  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <AnalyticsContext.Provider value={{ trackEvent, grantConsent, denyConsent, hasConsent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};