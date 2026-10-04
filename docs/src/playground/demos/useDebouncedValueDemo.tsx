import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from '@pareeshy/use-debounced-value';
import { PlaygroundDemoProps } from '../types';

export function UseDebouncedValueDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [text, setText] = useState('');
  const [delay, setDelay] = useState(400);
  const [leading, setLeading] = useState(false);
  const [trailing, setTrailing] = useState(true);

  const [debouncedText, controls] = useDebouncedValue(text, delay, { leading, trailing });

  useEffect(() => {
    setText('');
    log('info', 'Demo initialized: @pareeshy/use-debounced-value');
  }, [resetKey]);

  useEffect(() => {
    if (debouncedText) {
      log('success', `Debounced value emitted: "${debouncedText}"`, { delay });
    }
  }, [debouncedText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
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
            Delay: {delay}ms
          </label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={delay}
            onChange={(e) => {
              setDelay(Number(e.target.value));
              log('info', `Delay changed to ${e.target.value}ms`);
            }}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 18 }}>
          <label
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={leading}
              onChange={(e) => setLeading(e.target.checked)}
            />
            Leading edge
          </label>
          <label
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={trailing}
              onChange={(e) => setTrailing(e.target.checked)}
            />
            Trailing edge
          </label>
        </div>
      </div>

      {/* Input */}
      <div>
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            display: 'block',
            marginBottom: 6
          }}
        >
          Fast Typing Test Input
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            log('info', `Keypress input: "${e.target.value}"`);
          }}
          placeholder="Type rapidly here to test debouncing..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg)',
            color: 'var(--text-head)',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            controls.flush();
            log('warning', 'Flushed debounced queue immediately');
          }}
          disabled={!controls.isPending()}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            fontSize: '0.8rem',
            cursor: controls.isPending() ? 'pointer' : 'not-allowed',
            opacity: controls.isPending() ? 1 : 0.5
          }}
        >
          ⚡ Flush Now
        </button>

        <button
          onClick={() => {
            controls.cancel();
            log('warning', 'Cancelled pending debounce execution');
          }}
          disabled={!controls.isPending()}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            fontSize: '0.8rem',
            cursor: controls.isPending() ? 'pointer' : 'not-allowed',
            opacity: controls.isPending() ? 1 : 0.5
          }}
        >
          🛑 Cancel Pending
        </button>

        <button
          onClick={() => {
            setText('');
            log('info', 'Input cleared');
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
          Clear
        </button>
      </div>

      {/* Output Comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: 14,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)'
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
            Raw Instant Value
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: 'var(--text-head)',
              marginTop: 4
            }}
          >
            {text || <span style={{ opacity: 0.4 }}>Empty</span>}
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
            Debounced Value{' '}
            {controls.isPending() && (
              <span style={{ color: 'var(--primary)', marginLeft: 6 }}>⏳ Pending...</span>
            )}
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              color: 'var(--primary)',
              fontWeight: 600,
              marginTop: 4
            }}
          >
            {debouncedText || <span style={{ opacity: 0.4 }}>Empty</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
