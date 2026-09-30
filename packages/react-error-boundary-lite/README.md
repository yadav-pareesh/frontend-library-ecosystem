# @pareeshy/react-error-boundary-lite

Ultra-lightweight, resilient React Error Boundary component with reset keys, retry handler, and render prop support.

## Installation

```bash
npm install @pareeshy/react-error-boundary-lite
# or
pnpm add @pareeshy/react-error-boundary-lite
```

## Quick Start

```tsx
import React from 'react';
import { ErrorBoundary } from '@pareeshy/react-error-boundary-lite';

export function ProfileView({ userId }: { userId: string }) {
  return (
    <ErrorBoundary
      resetKeys={[userId]} // Automatically resets when userId changes
      fallback={({ error, resetErrorBoundary }) => (
        <div className="error-card">
          <p>Failed to load profile: {error.message}</p>
          <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
      )}
    >
      <UserProfile userId={userId} />
    </ErrorBoundary>
  );
}
```

## API

### `<ErrorBoundary>`

| Prop | Type | Description |
| --- | --- | --- |
| `fallback` | `ReactNode \| ((props: FallbackProps) => ReactNode)` | Custom error UI or render function |
| `resetKeys` | `unknown[]` | Keys that trigger automatic boundary reset on change |
| `onError` | `(error: Error, info: ErrorInfo) => void` | Telemetry error reporter |
| `onReset` | `() => void` | Invoked when boundary resets |

### `useErrorHandler(): (error: unknown) => void`
Allows throwing async/promise errors into the nearest ErrorBoundary during React render loops.

## License

MIT
