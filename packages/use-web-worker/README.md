# @pareeshy/use-web-worker

Simplify Web Worker usage in React with typed request/response communication, loading and error states, and automatic termination cleanup.

## Installation

```bash
npm install @pareeshy/use-web-worker
# or
pnpm add @pareeshy/use-web-worker
```

## Quick Start

### Using an Inline Pure Function

```tsx
import React, { useState } from 'react';
import { useWebWorker } from '@pareeshy/use-web-worker';

// Expensive prime-checking algorithm offloaded to background thread
function computePrimes(count: number): number[] {
  const primes: number[] = [];
  let candidate = 2;
  while (primes.length < count) {
    let isPrime = true;
    for (let i = 2; i * i <= candidate; i++) {
      if (candidate % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(candidate);
    candidate++;
  }
  return primes;
}

export function PrimeCalculator() {
  const { post, data, loading, error } = useWebWorker<number, number[]>(computePrimes);

  return (
    <div>
      <button onClick={() => post(5000)} disabled={loading}>
        {loading ? 'Computing in Background Thread...' : 'Compute 5000 Primes'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      {data && <p>Found {data.length} primes! Last prime: {data[data.length - 1]}</p>}
    </div>
  );
}
```

## API

### `useWebWorker<TInput, TOutput>(workerOrFn): UseWebWorkerReturn`

Accepts:
* A pure JavaScript function that runs in a background Web Worker blob.
* A worker factory `() => new Worker(new URL('./worker.ts', import.meta.url))`.
* A worker script URL string.

### Return Object

| Property | Type | Description |
| --- | --- | --- |
| `post(input)` | `(input: TInput) => Promise<TOutput>` | Sends data to worker and returns promise for response |
| `data` | `TOutput \| null` | Most recent worker output |
| `loading` | `boolean` | True while worker is executing |
| `error` | `Error \| null` | Worker error if execution throws |
| `terminate()` | `() => void` | Terminate worker process immediately |

## License

MIT
