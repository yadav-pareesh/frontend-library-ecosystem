# @pareesh/use-local-storage-state

Reactive, type-safe `localStorage` state hook for React with cross-tab synchronization and SSR safety.

## Installation

```bash
npm install @pareesh/use-local-storage-state
# or
pnpm add @pareesh/use-local-storage-state
```

## Quick Start

```tsx
import React from 'react';
import { useLocalStorageState } from '@pareesh/use-local-storage-state';

export function ThemeSelector() {
  const [theme, setTheme, { remove, error }] = useLocalStorageState<'light' | 'dark'>('app-theme', 'light');

  return (
    <div>
      <p>Current Theme: {theme}</p>
      <button onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}>
        Toggle Theme
      </button>
      <button onClick={remove}>Reset to Default</button>
      {error && <span style={{ color: 'red' }}>Storage Error</span>}
    </div>
  );
}
```

## API

### `useLocalStorageState<T>(key, defaultValue, options?)`

Returns `[state, setState, controls]`.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `serializer` | `{ stringify: (val: T) => string, parse: (raw: string) => T }` | JSON | Custom serializer/deserializer |
| `onError` | `(error: unknown) => void` | `undefined` | Error handler callback for quota or permission errors |
| `syncTabs` | `boolean` | `true` | Synchronize state across browser tabs via storage events |

### Controls

| Property | Type | Description |
| --- | --- | --- |
| `remove()` | `() => void` | Removes the key from localStorage and resets state to default |
| `error` | `unknown \| null` | Contains any recent storage error (e.g. quota exceeded) |

## Browser Support & SSR

* Completely SSR-safe: will return `defaultValue` without errors when executed in Node.js / server runtimes.
* Synchronizes across tabs and inside the active tab.

## License

MIT
