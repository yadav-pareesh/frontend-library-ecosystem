import React, { useState, useEffect } from 'react';
import {
  createWebStorageAdapter,
  createIndexedDBAdapter,
  createMemoryStorageAdapter,
  StorageAdapter
} from '@pareeshy/browser-storage';
import { PlaygroundDemoProps } from '../types';

export function BrowserStorageDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [backend, setBackend] = useState<'local' | 'session' | 'indexedDB' | 'memory'>('indexedDB');
  const [key, setKey] = useState('user_settings');
  const [val, setVal] = useState('{"notifications":true,"colorScheme":"indigo"}');
  const [retrievedVal, setRetrievedVal] = useState<string | null>(null);
  const [allKeys, setAllKeys] = useState<string[]>([]);

  // Dynamically select adapter based on backend
  const getAdapter = (): StorageAdapter => {
    switch (backend) {
      case 'indexedDB':
        return createIndexedDBAdapter('playground_idb', 'keyval');
      case 'session':
        return createWebStorageAdapter('session', { prefix: 'pg_' });
      case 'memory':
        return createMemoryStorageAdapter();
      case 'local':
      default:
        return createWebStorageAdapter('local', { prefix: 'pg_' });
    }
  };

  const refreshKeys = async () => {
    try {
      const adapter = getAdapter();
      const k = await adapter.keys();
      setAllKeys(k);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshKeys();
    log('info', `Switched @pareeshy/browser-storage backend to [${backend.toUpperCase()}]`);
  }, [backend, resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Backend Selector */}
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
          Select Unified Storage Backend:
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['indexedDB', 'local', 'session', 'memory'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBackend(b)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: backend === b ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
                color: backend === b ? '#fff' : 'var(--text-head)',
                border: '1px solid var(--stripe-border)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {b === 'indexedDB'
                ? '🗄️ IndexedDB (Async/Large)'
                : b === 'local'
                  ? '💾 localStorage'
                  : b === 'session'
                    ? '🗂️ sessionStorage'
                    : '🧠 In-Memory'}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
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
            Storage Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)'
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
            Value Payload
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)'
            }}
          />
        </div>
      </div>

      {/* CRUD Action Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={async () => {
            const adapter = getAdapter();
            await adapter.set(key, val);
            log('success', `[${backend}] adapter.set("${key}", ...)`, { val });
            await refreshKeys();
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Set Item
        </button>

        <button
          onClick={async () => {
            const adapter = getAdapter();
            const res = await adapter.get(key);
            setRetrievedVal(res !== null ? JSON.stringify(res) : '(not found / null)');
            log('info', `[${backend}] adapter.get("${key}") => ${JSON.stringify(res)}`);
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
          Get Item
        </button>

        <button
          onClick={async () => {
            const adapter = getAdapter();
            await adapter.remove(key);
            log('warning', `[${backend}] adapter.remove("${key}")`);
            await refreshKeys();
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Remove Key
        </button>

        <button
          onClick={async () => {
            const adapter = getAdapter();
            await adapter.clear();
            log('error', `[${backend}] adapter.clear() - wiped all stored keys`);
            await refreshKeys();
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>

      {/* Output Viewer */}
      <div
        style={{
          padding: 12,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--code-bg)',
          border: '1px solid var(--code-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ color: 'var(--code-comment)', marginBottom: 6 }}>// Retrieved Value:</div>
        <div style={{ color: 'var(--code-str)' }}>
          {retrievedVal ?? 'Click "Get Item" to retrieve'}
        </div>
        <div style={{ color: 'var(--code-comment)', marginTop: 8, marginBottom: 4 }}>
          // Current Keys in {backend}: ({allKeys.length})
        </div>
        <div style={{ color: 'var(--code-fn)' }}>[{allKeys.map((k) => `"${k}"`).join(', ')}]</div>
      </div>
    </div>
  );
}
