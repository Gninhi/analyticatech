import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, MessageSquare } from 'lucide-react';
import { captureError } from '../../lib/sentry';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * PRODUCTION GRADE ERROR BOUNDARY WITH SENTRY INTEGRATION
 * Capture toutes les erreurs de rendu React et les envoie à Sentry
 */
export class ErrorBoundary extends Component<Props, State> {
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorInfo: null, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] React Error:', error);
      console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    }
    
    // Send to Sentry in production
    captureError(error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReport = (): void => {
    const subject = encodeURIComponent(`[AnalyticaTech] Error Report: ${this.state.errorId}`);
    const body = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n\n` +
      `Message: ${this.state.error?.message || 'Unknown'}\n\n` +
      `User Agent: ${navigator.userAgent}\n\n` +
      `URL: ${window.location.href}\n\n` +
      `Timestamp: ${new Date().toISOString()}`
    );
    window.open(`mailto:contact@analyticatech.fr?subject=${subject}&body=${body}`, '_blank');
  };

  public render() {
    const { hasError, error, errorId } = this.state;
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
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
              Une erreur technique critique a été détectée. Nos systèmes de sécurité ont isolé le problème.
            </p>

            {errorId && (
              <div className="mb-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">ID de l'erreur</p>
                <p className="text-sm font-mono text-analytica-accent select-all">{errorId}</p>
                <p className="text-xs text-slate-400 mt-2">Partagez cet ID lors du signalement</p>
              </div>
            )}

            <div className="space-y-3">
              <button 
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-analytica-accent hover:bg-analytica-accent/90 text-white rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCcw size={18} /> Recharger l'application
              </button>
              
              <button 
                onClick={this.handleReport}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all"
              >
                <MessageSquare size={18} /> Signaler l'erreur
              </button>
            </div>

            <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
              Code erreur: {error?.name || 'UNKNOWN_ERR'}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;