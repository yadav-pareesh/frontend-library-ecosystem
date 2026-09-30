import React from 'react';
import { useUndoRedo } from '@pareeshy/use-undo-redo';

export function UndoRedoPlayground() {
  const [text, setText, { undo, redo, canUndo, canRedo, clear, past, future }] = useUndoRedo('Initial text');

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Undo/Redo Playground</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <div>
        <button onClick={undo} disabled={!canUndo} style={{ marginRight: 8 }}>
          Undo ({past.length})
        </button>
        <button onClick={redo} disabled={!canRedo} style={{ marginRight: 8 }}>
          Redo ({future.length})
        </button>
        <button onClick={clear}>Clear History</button>
      </div>
    </div>
  );
}
