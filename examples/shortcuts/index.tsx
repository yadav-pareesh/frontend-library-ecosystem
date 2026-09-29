import React, { useState } from 'react';
import { useShortcut } from '@pareesh/react-shortcuts';

export function ShortcutsPlayground() {
  const [log, setLog] = useState<string[]>([]);

  const append = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 10));

  useShortcut('mod+s', () => append('Saved (Mod+S pressed)'));
  useShortcut('mod+k', () => append('Opened search command palette (Mod+K pressed)'));
  useShortcut('escape', () => append('Dismissed dialog (Escape pressed)'));
  useShortcut('ctrl+shift+p', () => append('Command palette opened (Ctrl+Shift+P)'));

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Keyboard Shortcuts Playground</h2>
      <p>Try pressing: <code>Cmd/Ctrl+S</code>, <code>Cmd/Ctrl+K</code>, <code>Escape</code>, or <code>Ctrl+Shift+P</code></p>
      <ul>
        {log.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
