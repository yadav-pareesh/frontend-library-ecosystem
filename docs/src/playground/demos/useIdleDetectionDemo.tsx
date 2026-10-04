import React, { useState, useEffect } from 'react';
import { useIdleDetection } from '@pareeshy/use-idle-detection';
import { PlaygroundDemoProps } from '../types';

export function UseIdleDetectionDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [timeoutMs, setTimeoutMs] = useState(3000); // 3 seconds for quick testing
  const [idleEvents, setIdleEvents] = useState<string[]>([]);

  const { isIdle, lastActive, reset, pause, resume } = useIdleDetection({
    timeout: timeoutMs,
    onIdle: () => {
      setIdleEvents((prev) => [
        `💤 User transitioned to IDLE at ${new Date().toLocaleTimeString()}`,
        ...prev
      ]);
      log('warning', 'User became IDLE due to inactivity');
    },
    onActive: () => {
      setIdleEvents((prev) => [
        `⚡ User became ACTIVE at ${new Date().toLocaleTimeString()}`,
        ...prev
      ]);
      log('success', 'User activity detected! Resumed active status.');
    }
  });

  useEffect(() => {
    log('info', `Initialized @pareeshy/use-idle-detection with ${timeoutMs}ms timeout`);
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* State Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isIdle ? 'var(--warning-bg)' : 'var(--success-bg)',
          border: `1px solid ${isIdle ? 'rgba(217, 119, 6, 0.3)' : 'var(--success-border)'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.8rem' }}>{isIdle ? '💤' : '⚡'}</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                color: isIdle ? 'var(--warning)' : 'var(--success)'
              }}
            >
              {isIdle ? 'USER IS IDLE' : 'USER IS ACTIVE'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Last activity recorded: {new Date(lastActive).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              reset();
              log('info', 'Manually reset idle timer');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Reset Timer
          </button>
          <button
            onClick={() => {
              pause();
              log('warning', 'Paused idle tracking');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Pause
          </button>
          <button
            onClick={() => {
              resume();
              log('info', 'Resumed idle tracking');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Resume
          </button>
        </div>
      </div>

      {/* Timeout Slider */}
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
          Idle Inactivity Threshold: {timeoutMs / 1000}s ({timeoutMs}ms)
        </label>
        <input
          type="range"
          min={1000}
          max={10000}
          step={500}
          value={timeoutMs}
          onChange={(e) => setTimeoutMs(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 300 }}
        />
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Move your mouse or press any key to reset the timer. Stop interacting for{' '}
          {timeoutMs / 1000}s to trigger idle state.
        </p>
      </div>

      {/* Recent Activity Log */}
      <div
        style={{
          border: '1px solid var(--stripe-border)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          backgroundColor: 'var(--stripe-bg-subtle)'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}
        >
          Transition History
        </span>
        <div
          style={{
            marginTop: 8,
            fontSize: '0.82rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          {idleEvents.length === 0 ? (
            <span style={{ color: 'var(--text-muted)' }}>
              No transitions yet. Stop typing or moving to trigger idle.
            </span>
          ) : (
            idleEvents.slice(0, 5).map((evt, idx) => (
              <div key={idx} style={{ color: 'var(--text-body)' }}>
                {evt}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
