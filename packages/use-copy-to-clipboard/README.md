# @pareesh/use-copy-to-clipboard

Robust React hook for copying text to clipboard with modern Clipboard API, fallback support, copied state, and configurable timeout.

## Installation

```bash
npm install @pareesh/use-copy-to-clipboard
# or
pnpm add @pareesh/use-copy-to-clipboard
```

## Quick Start

```tsx
import React from 'react';
import { useCopyToClipboard } from '@pareesh/use-copy-to-clipboard';

export function ShareCode({ snippet }: { snippet: string }) {
  const { copy, copied, error } = useCopyToClipboard({ resetTimeout: 2500 });

  return (
    <div>
      <pre>{snippet}</pre>
      <button onClick={() => copy(snippet)}>
        {copied ? 'Copied to clipboard!' : 'Copy Code'}
      </button>
      {error && <p style={{ color: 'red' }}>Failed: {error.message}</p>}
    </div>
  );
}
```

## API

### `useCopyToClipboard(options?): UseCopyToClipboardReturn`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `resetTimeout` | `number` | `2000` | Delay in ms before `copied` resets to `false` |

### Return Object

| Property | Type | Description |
| --- | --- | --- |
| `copy(text)` | `(text: string) => Promise<boolean>` | Performs copy operation |
| `copied` | `boolean` | `true` if text was copied within the timeout |
| `error` | `Error \| null` | Error object if clipboard access fails |
| `reset()` | `() => void` | Manually clears `copied` and `error` state |

## License

MIT
