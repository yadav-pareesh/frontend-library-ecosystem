# @pareesh/use-persisted-state

Generic persisted React state hook supporting `localStorage`, `sessionStorage`, TTL expiration, and schema migrations.

## Installation

```bash
npm install @pareesh/use-persisted-state
# or
pnpm add @pareesh/use-persisted-state
```

## Quick Start

```tsx
import React from 'react';
import { usePersistedState } from '@pareesh/use-persisted-state';

export function SessionTimer() {
  const [session, setSession, { remove }] = usePersistedState(
    'user-session',
    { token: 'abc' },
    {
      ttlMs: 1000 * 60 * 30, // 30 minutes TTL
      version: 2,
      migrate: (legacy: any, oldVersion) => {
        return { token: legacy.token || 'refreshed' };
      }
    }
  );

  return (
    <div>
      <p>Token: {session.token}</p>
      <button onClick={remove}>Expire Session</button>
    </div>
  );
}
```

## API

### `usePersistedState<T>(key, defaultValue, options?)`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `storage` | `'local' \| 'session'` | `'local'` | Web storage backend |
| `ttlMs` | `number` | `undefined` | Automatic expiration time in milliseconds |
| `version` | `number` | `1` | Schema version |
| `migrate` | `(oldValue: unknown, oldVersion: number) => T` | `undefined` | Upgrade function when stored version is less than current |

## License

MIT
