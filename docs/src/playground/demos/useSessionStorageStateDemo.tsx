import React, { useState, useEffect } from 'react';
import { useSessionStorageState } from '@pareeshy/use-session-storage-state';
import { PlaygroundDemoProps } from '../types';

export function UseSessionStorageStateDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [sessionDraft, setSessionDraft, { remove, error }] = useSessionStorageState<string>(
    'playground_session_draft',
    'Initial draft message...'
  );

  const [rawSession, setRawSession] = useState('');

  const sync = () => {
    try {
      setRawSession(window.sessionStorage.getItem('playground_session_draft') || '(null)');
    } catch {
      setRawSession('(error)');
    }
  };

  useEffect(() => {
    sync();
    log(
      'info',
      'Initialized @pareeshy/use-session-storage-state with key "playground_session_draft"'
    );
  }, [resetKey]);

  useEffect(() => {
    sync();
  }, [sessionDraft]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
          SessionStorage Error: {String(error)}
        </div>
      )}

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
          Session Draft Text (Persists until tab is closed)
        </label>
        <textarea
          rows={3}
          value={sessionDraft}
          onChange={(e) => {
            setSessionDraft(e.target.value);
            log('info', `Draft updated (${e.target.value.length} chars)`);
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg)',
            color: 'var(--text-head)',
            fontFamily: 'inherit',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            setSessionDraft('Initial draft message...');
            log('warning', 'Session draft reset to initial');
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
            log('error', 'Removed key from sessionStorage');
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
          🗑️ Clear Key
        </button>
      </div>

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
        <span style={{ color: 'var(--code-comment)', display: 'block', marginBottom: 4 }}>
          // Live window.sessionStorage.getItem('playground_session_draft')
        </span>
        <pre style={{ margin: 0, color: 'var(--code-str)' }}>{rawSession}</pre>
      </div>
    </div>
  );
}
