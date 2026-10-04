import React, { useState, useEffect } from 'react';
import { useShortcut } from '@pareeshy/react-shortcuts';
import { PlaygroundDemoProps } from '../types';

export function ReactShortcutsDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [saveCount, setSaveCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastPressed, setLastPressed] = useState<string>('None yet');

  // Register shortcuts: Mod+S and Alt+R
  useShortcut('mod+s', () => {
    setSaveCount((c) => c + 1);
    setLastPressed('Mod + S');
    log('success', 'Keyboard shortcut triggered: [Mod + S] (Save document)');
  });

  useShortcut('alt+r', () => {
    setRefreshCount((c) => c + 1);
    setLastPressed('Alt + R');
    log('warning', 'Keyboard shortcut triggered: [Alt + R] (Reload simulation)');
  });

  useEffect(() => {
    setSaveCount(0);
    setRefreshCount(0);
    setLastPressed('None yet');
    log('info', 'Initialized @pareeshy/react-shortcuts (Listening for Mod+S and Alt+R)');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
        Press shortcuts anywhere on this page (outside text inputs). <code>Mod</code> automatically
        maps to <kbd>⌘ Command</kbd> on macOS and <kbd>Ctrl</kbd> on Windows/Linux!
      </p>

      {/* Shortcut Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
        <div
          style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--primary)',
                fontSize: '0.9rem'
              }}
            >
              <kbd>Mod</kbd> + <kbd>S</kbd>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Action: Save</span>
          </div>
          <div
            style={{ marginTop: 8, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-head)' }}
          >
            Triggered {saveCount} times
          </div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--warning)',
                fontSize: '0.9rem'
              }}
            >
              <kbd>Alt</kbd> + <kbd>R</kbd>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Action: Reload</span>
          </div>
          <div
            style={{ marginTop: 8, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-head)' }}
          >
            Triggered {refreshCount} times
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--code-bg)',
          border: '1px solid var(--code-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}
      >
        <span style={{ color: 'var(--code-comment)' }}>// Last Shortcut Detected: </span>
        <strong style={{ color: 'var(--code-fn)' }}>{lastPressed}</strong>
      </div>
    </div>
  );
}
