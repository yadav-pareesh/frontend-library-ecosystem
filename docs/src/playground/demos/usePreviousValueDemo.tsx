import React, { useState, useEffect } from 'react';
import { usePreviousValue } from '@pareeshy/use-previous-value';
import { PlaygroundDemoProps } from '../types';

export function UsePreviousValueDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [count, setCount] = useState(0);
  const prevCount = usePreviousValue(count, 0);

  useEffect(() => {
    setCount(0);
    log('info', 'Initialized @pareeshy/use-previous-value');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => {
            const next = count + 1;
            setCount(next);
            log('info', `Incremented count to ${next} (Previous was ${count})`);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Increment (+1)
        </button>

        <button
          onClick={() => {
            const next = count + 5;
            setCount(next);
            log('info', `Added +5 to count (${next})`);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            border: '1px solid var(--stripe-border)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Add (+5)
        </button>

        <button
          onClick={() => {
            setCount(0);
            log('warning', 'Reset count to 0');
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'transparent',
            color: 'var(--text-head)',
            cursor: 'pointer'
          }}
        >
          Reset (0)
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: 16,
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
            Current Value
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
            {count}
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
            Previous Value
          </span>
          <div
            style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: 4 }}
          >
            {prevCount ?? 'None'}
          </div>
        </div>
      </div>
    </div>
  );
}
