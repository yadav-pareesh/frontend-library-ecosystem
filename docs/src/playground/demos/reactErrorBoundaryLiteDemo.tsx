import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@pareeshy/react-error-boundary-lite';
import { PlaygroundDemoProps } from '../types';

function ExplodingWidget({ shouldExplode }: { shouldExplode: boolean }) {
  if (shouldExplode) {
    throw new Error('ExplodingWidget detonated! Handled cleanly by <ErrorBoundary>.');
  }
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: 'var(--success-bg)',
        border: '1px solid var(--success-border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--success)',
        fontWeight: 600
      }}
    >
      ✓ Component is healthy and operating normally without errors.
    </div>
  );
}

export function ReactErrorBoundaryLiteDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    setExplode(false);
    log('info', 'Initialized @pareeshy/react-error-boundary-lite');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
        Test error containment using <code>&lt;ErrorBoundary&gt;</code>. Triggering a fatal
        JavaScript render error below will be caught and rendered as a graceful fallback without
        crashing the documentation or playground!
      </p>

      <div>
        <button
          onClick={() => {
            log('error', 'Triggered deliberate component crash in ExplodingWidget');
            setExplode(true);
          }}
          disabled={explode}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: explode ? 'not-allowed' : 'pointer',
            opacity: explode ? 0.6 : 1
          }}
        >
          💥 Throw Fatal Render Error
        </button>
      </div>

      <ErrorBoundary
        resetKeys={[explode]}
        onError={(err) => {
          log('warning', `ErrorBoundary caught error: ${err.message}`);
        }}
        fallback={({ error, resetErrorBoundary }) => (
          <div
            style={{
              padding: 16,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>
              🛡️ Caught by &lt;ErrorBoundary&gt; Fallback:
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-head)',
                marginBottom: 12
              }}
            >
              {error.message}
            </div>
            <button
              onClick={() => {
                setExplode(false);
                resetErrorBoundary();
                log('info', 'Reset error boundary via resetErrorBoundary()');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🔄 Reset Component
            </button>
          </div>
        )}
      >
        <ExplodingWidget shouldExplode={explode} />
      </ErrorBoundary>
    </div>
  );
}
