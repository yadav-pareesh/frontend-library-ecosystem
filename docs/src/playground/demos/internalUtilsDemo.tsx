import React, { useState, useEffect } from 'react';
import { isBrowser, isDeepEqual, isPromise } from '@pareeshy/internal-utils';
import { PlaygroundDemoProps } from '../types';

export function InternalUtilsDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [objA, setObjA] = useState('{"role":"admin","tags":["react","ts"]}');
  const [objB, setObjB] = useState('{"tags":["react","ts"],"role":"admin"}');

  let deepEqualResult = false;
  let parseError = '';

  try {
    const parsedA = JSON.parse(objA);
    const parsedB = JSON.parse(objB);
    deepEqualResult = isDeepEqual(parsedA, parsedB);
  } catch {
    parseError = 'Invalid JSON input';
  }

  useEffect(() => {
    log('info', 'Initialized @pareeshy/internal-utils (Testing isBrowser, isDeepEqual, isPromise)');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Environment Flags */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            isBrowser
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: isBrowser ? 'var(--success)' : 'var(--warning)',
              marginTop: 2
            }}
          >
            {isBrowser ? 'TRUE (Client DOM)' : 'FALSE (SSR Node)'}
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            isPromise(Promise.resolve())
          </span>
          <div
            style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 2 }}
          >
            {isPromise(Promise.resolve()) ? 'TRUE' : 'FALSE'}
          </div>
        </div>
      </div>

      {/* isDeepEqual Interactive Tester */}
      <div
        style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--stripe-border)',
          backgroundColor: 'var(--stripe-bg-surface)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <strong style={{ fontSize: '0.88rem', color: 'var(--text-head)' }}>
            isDeepEqual(Object A, Object B) Comparator:
          </strong>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              fontWeight: 800,
              fontSize: '0.8rem',
              backgroundColor: parseError
                ? 'rgba(239, 68, 68, 0.1)'
                : deepEqualResult
                  ? 'var(--success-bg)'
                  : 'rgba(217, 119, 6, 0.15)',
              color: parseError ? '#ef4444' : deepEqualResult ? 'var(--success)' : 'var(--warning)',
              border: `1px solid ${parseError ? 'rgba(239, 68, 68, 0.3)' : deepEqualResult ? 'var(--success-border)' : 'rgba(217, 119, 6, 0.3)'}`
            }}
          >
            {parseError
              ? 'JSON SYNTAX ERROR'
              : deepEqualResult
                ? '✓ DEEP EQUAL: TRUE'
                : '✗ DEEP EQUAL: FALSE'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10
          }}
        >
          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 4
              }}
            >
              Object A JSON:
            </label>
            <textarea
              rows={3}
              value={objA}
              onChange={(e) => setObjA(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                padding: 8,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)'
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 4
              }}
            >
              Object B JSON (Order-independent check):
            </label>
            <textarea
              rows={3}
              value={objB}
              onChange={(e) => setObjB(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                padding: 8,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
