import React, { useState, useEffect } from 'react';
import { safeParse, safeStringifyCircular } from '@pareeshy/safe-json';
import { PlaygroundDemoProps } from '../types';

export function SafeJsonDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [jsonInput, setJsonInput] = useState(
    '{\n  "packageName": "@pareeshy/safe-json",\n  "version": 1,\n  "stable": true\n}'
  );
  const [parseResult, setParseResult] = useState<string>('');

  useEffect(() => {
    log('info', 'Initialized @pareeshy/safe-json with circular ref and error immunity');
    handleParse(jsonInput);
  }, [resetKey]);

  const handleParse = (raw: string) => {
    const res = safeParse(raw, { fallback: 'Default Fallback' });
    if (res.success) {
      setParseResult(JSON.stringify(res.data, null, 2));
      log('success', 'safeParse succeeded!', res.data);
    } else {
      setParseResult(`Error safely caught without crashing: ${res.error.message}`);
      log('error', `safeParse caught invalid JSON: ${res.error.message}`);
    }
  };

  const handleCircularTest = () => {
    const circularObj: any = { name: 'Circular Node' };
    circularObj.self = circularObj; // Circular reference that normally breaks JSON.stringify

    try {
      const output = safeStringifyCircular(circularObj, 2);
      setJsonInput(output);
      setParseResult(output);
      log('success', 'safeStringifyCircular successfully serialized circular reference!', {
        output
      });
    } catch (err) {
      log('error', `Stringify error: ${String(err)}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Action Presets */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            const valid = '{\n  "status": 200,\n  "items": ["React", "TypeScript", "Vite"]\n}';
            setJsonInput(valid);
            handleParse(valid);
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
          Valid JSON
        </button>

        <button
          onClick={() => {
            const broken = '{ "missingQuote: 123, broken... ';
            setJsonInput(broken);
            handleParse(broken);
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
          Malformed JSON (No Crash)
        </button>

        <button
          onClick={handleCircularTest}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--primary-border)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ⚡ Test Circular Reference Object
        </button>
      </div>

      {/* Editor & Output Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14
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
            Input JSON String:
          </label>
          <textarea
            rows={8}
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              handleParse(e.target.value);
            }}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
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
            safeParse(raw, fallback) Output:
          </label>
          <pre
            style={{
              height: 154,
              overflowY: 'auto',
              margin: 0,
              padding: 12,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--code-bg)',
              border: '1px solid var(--code-border)',
              color: 'var(--code-str)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {parseResult}
          </pre>
        </div>
      </div>
    </div>
  );
}
