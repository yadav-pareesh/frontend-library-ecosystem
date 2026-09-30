# @pareeshy/use-value-history

Configurable value history hook for React with max capacity, rollback, diff detection, and clear support.

## Installation

```bash
npm install @pareeshy/use-value-history
# or
pnpm add @pareeshy/use-value-history
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useValueHistory } from '@pareeshy/use-value-history';

export function PriceTracker() {
  const [price, setPrice] = useState(100);
  const { current, previous, history, changed, clear } = useValueHistory(price, { maxSize: 10 });

  return (
    <div>
      <p>Current: ${current} (Previous: ${previous ?? 'N/A'})</p>
      <p>Status: {changed ? 'Modified' : 'Unchanged'}</p>
      <ul>
        {history.map((val, idx) => (
          <li key={idx}>Step {idx + 1}: ${val}</li>
        ))}
      </ul>
      <button onClick={() => setPrice((p) => p + 10)}>Increase</button>
      <button onClick={clear}>Reset History</button>
    </div>
  );
}
```

## API

### `useValueHistory<T>(value, options?)`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxSize` | `number` | `20` | Max history elements retained before FIFO eviction |
| `isEqual` | `(a: T, b: T) => boolean` | `Object.is` | Custom equality checker to avoid recording duplicates |

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `current` | `T` | Current value |
| `previous` | `T \| undefined` | Directly preceding value |
| `history` | `T[]` | Chronological list of recorded values |
| `changed` | `boolean` | `true` if value changed since first record or clear |
| `clear()` | `() => void` | Resets history to contain only current value |

## License

MIT
