import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LogFunction } from '../types';

interface Props {
  children: ReactNode;
  packageName: string;
  onReset?: () => void;
  log?: LogFunction;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class PlaygroundErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    if (this.props.log) {
      this.props.log(
        'error',
        `Uncaught exception in [${this.props.packageName}]: ${error.message}`
      );
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--text-head)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <h4 style={{ margin: 0, color: '#ef4444', fontSize: '1.05rem', fontWeight: 700 }}>
                Demo Error Isolated ({this.props.packageName})
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                This demo encountered an unexpected error, but the playground was kept running
                safely.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#f87171',
              marginBottom: 16,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap'
            }}
          >
            {this.state.error?.toString()}
          </div>

          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🔄 Reset & Reload Demo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
