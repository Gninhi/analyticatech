import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * PRODUCTION GRADE ERROR BOUNDARY
 * Capture toutes les erreurs de rendu React pour éviter le crash blanc total (#525).
 */
export class ErrorBoundary extends Component<Props, State> {
  // Explicitly declare props to satisfy strict TypeScript environments
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CRITICAL] Uncaught React Error:', error, errorInfo);
    // TODO: Envoyer vers Sentry / Datadog ici
  }

  handleReload = () => {
    window.location.reload();
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#011C40] text-slate-900 dark:text-white p-4 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-white/5 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Service momentanément indisponible</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
              Une erreur technique critique a été détectée. Nos systèmes de sécurité ont isolé le problème.
            </p>

            <div className="space-y-3">
              <button 
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCcw size={18} /> Recharger l'application
              </button>
              
              <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                Code erreur: {error?.name || 'UNKNOWN_ERR'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;