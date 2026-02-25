import * as Sentry from '@sentry/react';

/**
 * SENTRY ERROR TRACKING CONFIGURATION
 * Production-grade error monitoring and performance tracking
 */

export const initSentry = (): void => {
  // Only initialize in production
  if (import.meta.env.DEV) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [],
    
    // Performance monitoring
    tracesSampleRate: 0.1, // Sample 10% of transactions
    
    // Error monitoring
    beforeSend(event) {
      // Don't send errors in development
      if (import.meta.env.DEV) {
        return null;
      }
      
      // Filter out known non-critical errors
      const errorMessage = event.exception?.values?.[0]?.value || '';
      const filteredErrors = [
        'ResizeObserver loop limit exceeded',
        'NetworkError when attempting to fetch resource',
        'Failed to fetch',
      ];
      
      if (filteredErrors.some(msg => errorMessage.includes(msg))) {
        return null;
      }
      
      return event;
    },
    
    // Environment
    environment: import.meta.env.MODE || 'production',
    release: import.meta.env.VITE_APP_VERSION || '3.2.0',
    
    // Privacy
    beforeSendTransaction(event) {
      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(crumb => {
          if (crumb.category === 'xhr' || crumb.category === 'fetch') {
            // Remove URL parameters that might contain sensitive data
            if (crumb.data?.url) {
              crumb.data.url = crumb.data.url.split('?')[0];
            }
          }
          return crumb;
        });
      }
      return event;
    },
  });
};

/**
 * Capture error with additional context
 */
export const captureError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  if (import.meta.env.DEV) {
    console.error('[Sentry Dev]', error, context);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Set user context for error tracking
 */
export const setSentryUser = (
  userId: string,
  email?: string,
  additionalContext?: Record<string, unknown>
): void => {
  Sentry.setUser({
    id: userId,
    email: email || undefined,
    ...additionalContext,
  });
};

/**
 * Clear user context (e.g., on logout)
 */
export const clearSentryUser = (): void => {
  Sentry.setUser(null);
};
