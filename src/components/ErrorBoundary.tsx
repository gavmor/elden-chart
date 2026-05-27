import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-full w-full bg-slate-950 items-center justify-center text-slate-200 font-sans p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide mb-2">Graceful Recovery</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                The visualizer encountered an unexpected runtime error (likely due to inconsistent GraphQL types on the public server).
              </p>
            </div>

            {this.state.error && (
              <div className="w-full text-left bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 overflow-x-auto max-h-48 text-xs font-mono text-red-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Error:</span> {this.state.error.message}
                {this.state.errorInfo && (
                  <details className="mt-2 text-slate-500 cursor-pointer">
                    <summary className="hover:text-slate-400">Stack Trace</summary>
                    <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                  </details>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/10 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reload Visualizer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
