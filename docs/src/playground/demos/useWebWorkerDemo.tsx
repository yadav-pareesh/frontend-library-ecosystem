import React, { useState, useEffect } from 'react';
import { useWebWorker } from '@pareeshy/use-web-worker';
import { PlaygroundDemoProps } from '../types';

export function UseWebWorkerDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [targetNumber, setTargetNumber] = useState(38);

  // Heavy CPU computation (recursive Fibonacci) run in background worker thread
  const { post, data, loading, error, terminate } = useWebWorker<
    number,
    { fib: number; elapsedMs: number }
  >((n: number) => {
    const start = performance.now();
    function fibonacci(num: number): number {
      if (num <= 1) return num;
      return fibonacci(num - 1) + fibonacci(num - 2);
    }
    const fib = fibonacci(n);
    const elapsedMs = Math.round(performance.now() - start);
    return { fib, elapsedMs };
  });

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-web-worker with background CPU worker');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Description */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
        Calculate heavy CPU tasks (like recursive Fibonacci) entirely in a background Web Worker
        thread. Notice that your browser UI remains 100% fluid and responsive while the computation
        runs!
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Fibonacci Number (N): {targetNumber}
          </label>
          <input
            type="range"
            min={20}
            max={42}
            value={targetNumber}
            onChange={(e) => setTargetNumber(Number(e.target.value))}
            style={{ width: 180 }}
          />
        </div>

        <button
          onClick={async () => {
            log(
              'info',
              `Posted task fibonacci(${targetNumber}) to background Web Worker thread...`
            );
            try {
              const res = await post(targetNumber);
              log(
                'success',
                `Worker completed fib(${targetNumber}) = ${res.fib} in ${res.elapsedMs}ms!`
              );
            } catch (err) {
              log('error', `Worker error or termination: ${String(err)}`);
            }
          }}
          disabled={loading}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Calculating in Worker...' : '🚀 Run in Worker Thread'}
        </button>

        {loading && (
          <button
            onClick={() => {
              terminate();
              log('warning', 'Manually terminated Web Worker execution');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}
          >
            🛑 Terminate Worker
          </button>
        )}
      </div>

      {/* Output Card */}
      <div
        style={{
          padding: 16,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Worker Status
          </span>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: loading ? 'var(--warning)' : 'var(--success)',
              marginTop: 4
            }}
          >
            {loading ? '⏳ Calculating in background...' : '✓ Idle / Ready'}
          </div>
        </div>

        <div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Calculated Result
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--primary)',
              marginTop: 4
            }}
          >
            {data ? data.fib.toLocaleString() : '—'}
          </div>
        </div>

        <div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Execution Time
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-head)',
              marginTop: 4
            }}
          >
            {data ? `${data.elapsedMs} ms` : '—'}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: '0.82rem'
          }}
        >
          Worker Error: {error.message}
        </div>
      )}
    </div>
  );
}
