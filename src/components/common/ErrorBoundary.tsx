import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Suppress Google Maps API internal cleanup errors that happen during unmounting
    if (error?.message && error.message.includes('getRootNode')) {
      console.warn('Suppressed transient getRootNode error in ErrorBoundary:', error);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error?.message && error.message.includes('getRootNode')) {
      console.warn('Suppressed getRootNode error in componentDidCatch:', error);
      return;
    }
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    localStorage.removeItem('wedding_saved_cluster_id');
    localStorage.removeItem('wedding_saved_invite_code');
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbf5f4] text-[#4a151d] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-wedding border border-blush/30 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle className="w-8 h-8 text-[#4a151d]" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#4a151d] mb-2">
              Si è verificato un errore
            </h2>

            <p className="text-xs sm:text-sm text-[#4a151d]/75 mb-6">
              Ci scusiamo per l'inconveniente. Puoi ricaricare la pagina o ripristinare la sessione per continuare.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-red-50 text-red-800 text-[11px] rounded-xl text-left font-mono overflow-auto max-h-32 border border-red-100">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#4a151d] hover:bg-[#6d1828] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ricarica</span>
              </button>

              <button
                onClick={this.handleResetSession}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#fbf5f4] hover:bg-[#e5edd8] text-[#4a151d] border border-blush/40 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Reset Invito</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
