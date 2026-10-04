import React, { useState, useEffect } from 'react';
import { useCopyToClipboard } from '@pareeshy/use-copy-to-clipboard';
import { PlaygroundDemoProps } from '../types';

export function UseCopyToClipboardDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [text, setText] = useState('npm install @pareeshy/use-debounced-value');
  const [resetDelay, setResetDelay] = useState(2500);

  const { copy, copied, error, reset } = useCopyToClipboard({ resetTimeout: resetDelay });

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-copy-to-clipboard with fallback support');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <div
          style={{
            padding: 10,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: 6,
            fontSize: '0.82rem'
          }}
        >
          Copy Error: {error.message}
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
          Text to Copy
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.9rem'
            }}
          />
          <button
            onClick={async () => {
              const success = await copy(text);
              if (success) {
                log('success', `Copied to clipboard: "${text}"`, { length: text.length });
              } else {
                log('error', 'Clipboard copy failed or permission denied');
              }
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: copied ? 'var(--success)' : 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background-color 0.2s ease'
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Text'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Reset Timeout: {resetDelay}ms
        </label>
        <input
          type="range"
          min={1000}
          max={5000}
          step={500}
          value={resetDelay}
          onChange={(e) => setResetDelay(Number(e.target.value))}
          style={{ width: 140 }}
        />
        {copied && (
          <button
            onClick={() => {
              reset();
              log('info', 'Manually reset copied state');
            }}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: 4,
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Reset State Now
          </button>
        )}
      </div>

      {/* Paste Tester Input */}
      <div>
        <label
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: 4
          }}
        >
          Verification (Paste here with <kbd>Ctrl+V</kbd> or <kbd>⌘V</kbd> to test):
        </label>
        <input
          type="text"
          placeholder="Paste copied text here to verify..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            fontSize: '0.85rem'
          }}
        />
      </div>
    </div>
  );
}
