# @pareesh/use-session-storage-state

Reactive, type-safe `sessionStorage` state hook for React with error resilience and SSR safety.

## Installation

```bash
npm install @pareesh/use-session-storage-state
# or
pnpm add @pareesh/use-session-storage-state
```

## Quick Start

```tsx
import React from 'react';
import { useSessionStorageState } from '@pareesh/use-session-storage-state';

export function StepWizard() {
  const [step, setStep, { remove }] = useSessionStorageState<number>('wizard-step', 1);

  return (
    <div>
      <p>Current Step: {step}</p>
      <button onClick={() => setStep((s) => s + 1)}>Next Step</button>
      <button onClick={remove}>Reset Wizard</button>
    </div>
  );
}
```

## API

### `useSessionStorageState<T>(key, defaultValue, options?)`

Returns `[state, setState, controls]`.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `serializer` | `{ stringify: (val: T) => string, parse: (raw: string) => T }` | JSON | Custom serializer/deserializer |
| `onError` | `(error: unknown) => void` | `undefined` | Error handler callback for storage errors |

### Controls

| Property | Type | Description |
| --- | --- | --- |
| `remove()` | `() => void` | Removes the key from sessionStorage and resets state to default |
| `error` | `unknown \| null` | Storage error if encountered |

## SSR & Browser Safety

Safe to use with Next.js, Remix, and standard React SSR environments. Gracefully defaults to initial value on the server.

## License

MIT
