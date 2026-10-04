import React, { useState, useEffect } from 'react';
import { useOptimisticAction } from '@pareeshy/use-optimistic-action';
import { PlaygroundDemoProps } from '../types';

interface LikeState {
  count: number;
  hasLiked: boolean;
}

export function UseOptimisticActionDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [shouldFail, setShouldFail] = useState(false);
  const [latencyMs, setLatencyMs] = useState(1200);

  const { state, execute, isPending, error, rollback, reset } = useOptimisticAction<
    LikeState,
    boolean
  >(
    { count: 42, hasLiked: false },
    async (_nextLiked) => {
      // Async server call simulation
      await new Promise((resolve) => setTimeout(resolve, latencyMs));
      if (shouldFail) {
        throw new Error('Server 500: Database lock timeout');
      }
      return;
    },
    {
      update: (current, nextLiked) => ({
        hasLiked: nextLiked,
        count: nextLiked ? current.count + 1 : current.count - 1
      }),
      onSuccess: () => {
        log('success', 'Server accepted like update! Sync confirmed.');
      },
      onError: (err) => {
        log(
          'error',
          `Server rejected like: ${err instanceof Error ? err.message : String(err)}. Rolling back state!`
        );
      }
    }
  );

  useEffect(() => {
    reset();
    log('info', 'Initialized @pareeshy/use-optimistic-action with auto-rollback');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Simulation Controls */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
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
            Server Latency: {latencyMs}ms
          </label>
          <input
            type="range"
            min={400}
            max={3000}
            step={200}
            value={latencyMs}
            onChange={(e) => setLatencyMs(Number(e.target.value))}
            style={{ width: 140 }}
          />
        </div>

        <label
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: shouldFail ? '#ef4444' : 'var(--text-body)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            paddingTop: 14
          }}
        >
          <input
            type="checkbox"
            checked={shouldFail}
            onChange={(e) => {
              setShouldFail(e.target.checked);
              log('warning', `Simulate Server Failure toggled: ${e.target.checked}`);
            }}
          />
          💥 Simulate Server Error (Triggers Automatic Rollback)
        </label>
      </div>

      {/* Interactive Like Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-surface)',
          border: '1px solid var(--stripe-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              const nextLiked = !state.hasLiked;
              log(
                'info',
                `Clicked like button! Optimistically applying state: ${nextLiked ? 'LIKED' : 'UNLIKED'}`
              );
              execute(nextLiked);
            }}
            disabled={isPending}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: state.hasLiked ? '#ef4444' : 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span>{state.hasLiked ? '❤️ Liked' : '🤍 Like'}</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                padding: '2px 8px',
                borderRadius: 10
              }}
            >
              {state.count}
            </span>
          </button>

          {isPending && (
            <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
              ⏳ Syncing with remote API in background...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              rollback();
              log('warning', 'Manual rollback called');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Rollback
          </button>
          <button
            onClick={() => {
              reset();
              log('info', 'Reset state to default');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '0.82rem'
          }}
        >
          <strong>Error encountered:</strong> {error.message} (State safely restored to previous
          count: {state.count})
        </div>
      )}
    </div>
  );
}
