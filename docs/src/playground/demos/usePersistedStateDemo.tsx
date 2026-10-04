import React, { useState, useEffect } from 'react';
import { usePersistedState } from '@pareeshy/use-persisted-state';
import { PlaygroundDemoProps } from '../types';

export function UsePersistedStateDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [ttlSeconds, setTtlSeconds] = useState(10); // 10 seconds TTL for fast testing

  const [authKey, setAuthKey, controls] = usePersistedState<string>(
    'playground_auth_session',
    'auth_token_xyz_9981',
    {
      ttlMs: ttlSeconds * 1000,
      version: 1,
      onError: (err) => log('error', `Persisted state error: ${String(err)}`)
    }
  );

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    log('info', `Initialized @pareeshy/use-persisted-state with TTL: ${ttlSeconds}s`);
  }, [resetKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpired(controls.isExpired());
    }, 1000);
    return () => clearInterval(timer);
  }, [controls]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* TTL Slider */}
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
          Auto-Expiry TTL Duration: {ttlSeconds} seconds
        </label>
        <input
          type="range"
          min={5}
          max={60}
          value={ttlSeconds}
          onChange={(e) => setTtlSeconds(Number(e.target.value))}
          style={{ width: 200 }}
        />
      </div>

      {/* Input */}
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
          Persisted Value with TTL & Version Envelope
        </label>
        <input
          type="text"
          value={authKey}
          onChange={(e) => {
            setAuthKey(e.target.value);
            log('info', `Persisted value updated: "${e.target.value}" (Expires in ${ttlSeconds}s)`);
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg)',
            color: 'var(--text-head)'
          }}
        />
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: expired ? 'rgba(239, 68, 68, 0.1)' : 'var(--success-bg)',
            color: expired ? '#ef4444' : 'var(--success)',
            border: `1px solid ${expired ? 'rgba(239, 68, 68, 0.3)' : 'var(--success-border)'}`
          }}
        >
          {expired ? '⌛ EXPIRED' : '✓ ACTIVE / VALID'}
        </span>

        <button
          onClick={() => {
            controls.remove();
            log('warning', 'Removed persisted item and cleared TTL');
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
          🗑️ Invalidate / Remove Key
        </button>
      </div>
    </div>
  );
}
