import React, { Component, ErrorInfo, ReactNode, useState } from 'react';

export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: FallbackProps) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const initialState: ErrorBoundaryState = {
  hasError: false,
  error: null
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = initialState;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && this.props.resetKeys) {
      const prevKeys = prevProps.resetKeys || [];
      const currentKeys = this.props.resetKeys;

      const keysChanged =
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key, idx) => !Object.is(key, currentKeys[idx]));

      if (keysChanged) {
        this.reset();
      }
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState(initialState);
  };

  override render(): ReactNode {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback({
          error,
          resetErrorBoundary: this.reset
        });
      }
      if (fallback !== undefined) {
        return fallback;
      }
      return (
        <div role="alert" style={{ padding: 16, border: '1px solid #ef4444', borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#b91c1c' }}>Something went wrong</h4>
          <pre style={{ fontSize: 12, color: '#4b5563', whiteSpace: 'pre-wrap' }}>
            {error.message}
          </pre>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginTop: 12,
              padding: '6px 12px',
              borderRadius: 4,
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook to throw errors during rendering cycle so error boundaries can catch async or callback errors.
 */
export function useErrorHandler(): (error: unknown) => void {
  const [, setError] = useState();
  return (error: unknown) => {
    setError(() => {
      throw error instanceof Error ? error : new Error(String(error));
    });
  };
}
