import React, { useEffect, useRef, useState } from 'react';
import { config } from '../../config/env';

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  errorCallback?: () => void;
  theme?: 'light' | 'dark';
  language?: string;
}

const Turnstile: React.FC<TurnstileProps> = ({ onSuccess, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const siteKey = config.turnstile.siteKey;
    
    if (!siteKey || siteKey === '' || siteKey === 'YOUR_TURNSTILE_SITE_KEY_HERE') {
      console.log('[Turnstile] Site key not configured, skipping CAPTCHA');
      return;
    }

    const loadScript = () => {
      if (document.querySelector('script[src*="turnstile"]')) {
        setIsReady(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsReady(true);
      script.onerror = () => {
        console.error('[Turnstile] Failed to load script');
        onError?.();
      };
      document.head.appendChild(script);
    };

    loadScript();
  }, [onError]);

  useEffect(() => {
    if (!isReady || !containerRef.current || !config.turnstile.siteKey) return;

    const container = containerRef.current;
    
    if (container.querySelector('.cf-turnstile')) return;

    const widgetId = window.turnstile.render(container, {
      sitekey: config.turnstile.siteKey,
      callback: (token: string) => {
        onSuccess(token);
      },
      errorCallback: () => {
        onError?.();
      },
      theme: 'dark',
      language: 'fr',
    });

    return () => {
      if (widgetId) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isReady, onSuccess, onError]);

  const siteKey = config.turnstile.siteKey;
  
  if (!siteKey || siteKey === '' || siteKey === 'YOUR_TURNSTILE_SITE_KEY_HERE') {
    return null;
  }

  return (
    <div className="flex justify-center py-2">
      <div 
        ref={containerRef} 
        className="cf-turnstile"
        style={{ minHeight: '65px' }}
      />
    </div>
  );
};

export default Turnstile;
