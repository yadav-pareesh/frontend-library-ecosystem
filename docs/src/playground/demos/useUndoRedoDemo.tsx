import React, { useEffect } from 'react';
import { useUndoRedo } from '@pareeshy/use-undo-redo';
import { PlaygroundDemoProps } from '../types';

export function UseUndoRedoDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [text, setText, { undo, redo, canUndo, canRedo, reset, past, future }] =
    useUndoRedo<string>('The quick brown fox jumps over the lazy dog.');

  useEffect(() => {
    reset('The quick brown fox jumps over the lazy dog.');
    log('info', 'Initialized @pareeshy/use-undo-redo');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => {
            undo();
            log('warning', 'Undo action performed', { remainingUndos: past.length - 1 });
          }}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: canUndo ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
            color: canUndo ? '#fff' : 'var(--text-muted)',
            border: '1px solid var(--stripe-border)',
            fontWeight: 700,
            cursor: canUndo ? 'pointer' : 'not-allowed',
            opacity: canUndo ? 1 : 0.5
          }}
        >
          ↩️ Undo ({past.length})
        </button>

        <button
          onClick={() => {
            redo();
            log('info', 'Redo action performed', { remainingRedos: future.length - 1 });
          }}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: canRedo ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
            color: canRedo ? '#fff' : 'var(--text-muted)',
            border: '1px solid var(--stripe-border)',
            fontWeight: 700,
            cursor: canRedo ? 'pointer' : 'not-allowed',
            opacity: canRedo ? 1 : 0.5
          }}
        >
          ↪️ Redo ({future.length})
        </button>

        <button
          onClick={() => {
            reset('The quick brown fox jumps over the lazy dog.');
            log('warning', 'Reset canvas back to initial sentence');
          }}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            cursor: 'pointer'
          }}
        >
          Reset Initial
        </button>
      </div>

      {/* Editor Box */}
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
          Document Canvas
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            log('info', `State changed: "${e.target.value.slice(0, 30)}..."`);
          }}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg)',
            color: 'var(--text-head)',
            fontSize: '0.92rem',
            lineHeight: 1.5
          }}
        />
      </div>

      {/* Quick Word Append Buttons to easily test stack */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: 4 }}>
          Quick Append:
        </span>
        {['🚀 Superfast', '✨ Sleek UI', '📦 Zero Dependency', '🛡️ Type Safe'].map((word) => (
          <button
            key={word}
            onClick={() => {
              const next = text + ' ' + word;
              setText(next);
              log('success', `Appended "${word}"`);
            }}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg-subtle)',
              color: 'var(--text-body)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            + {word}
          </button>
        ))}
      </div>
    </div>
  );
}
