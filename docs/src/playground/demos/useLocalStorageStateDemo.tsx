import React, { useState, useEffect } from 'react';
import { useLocalStorageState } from '@pareeshy/use-local-storage-state';
import { PlaygroundDemoProps } from '../types';

interface UserProfile {
  name: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  score: number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Developer',
  theme: 'system',
  notifications: true,
  score: 100
};

export function UseLocalStorageStateDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [profile, setProfile, { remove, error }] = useLocalStorageState<UserProfile>(
    'playground_demo_profile',
    DEFAULT_PROFILE
  );

  const [rawStorageValue, setRawStorageValue] = useState<string>('');

  const syncRaw = () => {
    try {
      setRawStorageValue(window.localStorage.getItem('playground_demo_profile') || '(null)');
    } catch {
      setRawStorageValue('(error reading localStorage)');
    }
  };

  useEffect(() => {
    syncRaw();
    log('info', 'Initialized @pareeshy/use-local-storage-state with key "playground_demo_profile"');
  }, [resetKey]);

  useEffect(() => {
    syncRaw();
  }, [profile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Boolean(error) && (
        <div
          style={{
            padding: 10,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: 6,
            fontSize: '0.82rem'
          }}
        >
          Storage Error: {String(error)}
        </div>
      )}

      {/* Profile Form */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
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
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => {
              const newName = e.target.value;
              setProfile((prev) => ({ ...prev, name: newName }));
              log('info', `Updated profile.name to "${newName}"`);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          />
        </div>

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
            Theme
          </label>
          <select
            value={profile.theme}
            onChange={(e) => {
              const val = e.target.value as any;
              setProfile((prev) => ({ ...prev, theme: val }));
              log('info', `Updated profile.theme to "${val}"`);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

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
            Score Counter: {profile.score}
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => {
                setProfile((prev) => ({ ...prev, score: prev.score + 10 }));
                log('success', `Incremented score to ${profile.score + 10}`);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              +10 Points
            </button>
            <button
              onClick={() => {
                setProfile((prev) => ({ ...prev, score: Math.max(0, prev.score - 10) }));
                log('info', `Decremented score to ${Math.max(0, profile.score - 10)}`);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--stripe-bg-subtle)',
                color: 'var(--text-head)',
                border: '1px solid var(--stripe-border)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              -10 Points
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setProfile(DEFAULT_PROFILE);
            log('warning', 'Reset profile back to default');
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
          🔄 Reset Default
        </button>

        <button
          onClick={() => {
            remove();
            log('error', 'Removed "playground_demo_profile" key from localStorage');
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          🗑️ Remove Key
        </button>

        <button
          onClick={() => {
            // Trigger cross-tab sync event
            window.dispatchEvent(
              new CustomEvent('pareeshy:local-storage-change', {
                detail: {
                  key: 'playground_demo_profile',
                  newValue: JSON.stringify({
                    name: 'Synced User (Other Tab)',
                    theme: 'dark',
                    notifications: false,
                    score: 999
                  })
                }
              })
            );
            log('success', 'Simulated external tab storage update event!');
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--primary-border)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          📡 Simulate Cross-Tab Event
        </button>
      </div>

      {/* Live Raw Output */}
      <div
        style={{
          padding: 12,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--code-bg)',
          border: '1px solid var(--code-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem'
        }}
      >
        <span style={{ color: 'var(--code-comment)', display: 'block', marginBottom: 6 }}>
          // Live window.localStorage.getItem('playground_demo_profile')
        </span>
        <pre style={{ margin: 0, color: 'var(--code-str)', whiteSpace: 'pre-wrap' }}>
          {rawStorageValue}
        </pre>
      </div>
    </div>
  );
}
