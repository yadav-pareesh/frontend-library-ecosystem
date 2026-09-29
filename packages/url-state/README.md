# @pareesh/url-state

Seamless bidirectional synchronization of React state with browser URL search parameters supporting numbers, booleans, arrays, push/replace history modes, and SSR.

## Installation

```bash
npm install @pareesh/url-state
# or
pnpm add @pareesh/url-state
```

## Quick Start

```tsx
import React from 'react';
import { useUrlState } from '@pareesh/url-state';

export function Pagination() {
  const [page, setPage, { clear }] = useUrlState<number>('page', 1, {
    historyMode: 'push'
  });

  return (
    <div>
      <p>Current Page: {page}</p>
      <button onClick={() => setPage((p) => p + 1)}>Next Page</button>
      <button onClick={clear}>Reset Page</button>
    </div>
  );
}
```

## API

### `useUrlState<T>(paramKey, defaultValue, options?): [state, setState, controls]`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `historyMode` | `'push' \| 'replace'` | `'replace'` | Navigation mode when modifying URL |
| `serialize` | `(value: T) => string` | Built-in | Custom serializer |
| `deserialize` | `(raw: string, fallback: T) => T` | Built-in | Custom deserializer |

## License

MIT
