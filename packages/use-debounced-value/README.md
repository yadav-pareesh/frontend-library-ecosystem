# @pareesh/use-debounced-value

High-performance, SSR-safe React hook for debouncing values and callbacks with leading/trailing execution, cancellation, and flushing.

## Installation

```bash
npm install @pareesh/use-debounced-value
# or
pnpm add @pareesh/use-debounced-value
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useDebouncedValue } from '@pareesh/use-debounced-value';

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, { isPending, cancel, flush }] = useDebouncedValue(query, 300);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type to search..." />
      {isPending() && <span>Typing...</span>}
      <p>Debounced value: {debouncedQuery}</p>
      <button onClick={flush}>Search Immediately</button>
      <button onClick={cancel}>Cancel Pending</button>
    </div>
  );
}
```

## API

### `useDebouncedValue(value, delay, options?)`

Returns a tuple `[debouncedValue, controls]`.

### `useDebouncedCallback(callback, delay, options?)`

Returns a debounced callback function augmented with control methods (`.cancel()`, `.flush()`, `.isPending()`).

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `leading` | `boolean` | `false` | Execute callback on the leading edge of timeout |
| `trailing` | `boolean` | `true` | Execute callback on the trailing edge of timeout |
| `maxWait` | `number` | `undefined` | Maximum time callback is allowed to be delayed |

### Return Value Controls

| Method | Type | Description |
| --- | --- | --- |
| `cancel` | `() => void` | Cancels any pending execution |
| `flush` | `() => void` | Executes pending call immediately and clears timer |
| `isPending` | `() => boolean` | Checks if a debounced execution is scheduled |

## Browser Support & SSR

* Compatible with all modern browsers and Node.js SSR environments.
* Safe against hydration mismatches and unmount memory leaks.

## License

MIT
