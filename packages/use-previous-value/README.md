# @pareeshy/use-previous-value

Lightweight React hook for tracking previous values with custom equality and initial value support.

## Installation

```bash
npm install @pareeshy/use-previous-value
# or
pnpm add @pareeshy/use-previous-value
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { usePreviousValue } from '@pareeshy/use-previous-value';

export function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePreviousValue(count);

  return (
    <div>
      <p>Now: {count}, Before: {prevCount ?? 'None'}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

## API

### `usePreviousValue<T>(value, initialValue?, options?): T | undefined`

### Options

| Option | Type | Description |
| --- | --- | --- |
| `isEqual` | `(prev: T, current: T) => boolean` | Custom comparator to determine if previous value should update |

## License

MIT
