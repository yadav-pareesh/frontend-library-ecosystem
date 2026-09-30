import React from 'react';
import { useLocalStorageState } from '@pareeshy/use-local-storage-state';
import { useSessionStorageState } from '@pareeshy/use-session-storage-state';
import { usePersistedState } from '@pareeshy/use-persisted-state';

export function StoragePlayground() {
  const [theme, setTheme] = useLocalStorageState('playground_theme', 'dark');
  const [tabIndex, setTabIndex] = useSessionStorageState('active_tab', 0);
  const [expiringToken, setExpiringToken, { isExpired }] = usePersistedState(
    'expiring_token',
    'guest-123',
    { ttlMs: 1000 * 60 } // 1 minute
  );

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Storage Ecosystem Playground</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Local Storage Theme:</strong> {theme}
        <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} style={{ marginLeft: 8 }}>
          Toggle
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Session Storage Tab:</strong> {tabIndex}
        <button onClick={() => setTabIndex((i) => (i + 1) % 3)} style={{ marginLeft: 8 }}>
          Next Tab
        </button>
      </div>

      <div>
        <strong>Persisted Token:</strong> {expiringToken} (Expired? {isExpired() ? 'Yes' : 'No'})
      </div>
    </div>
  );
}
