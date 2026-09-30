# @pareeshy/use-optimistic-action

Reusable optimistic UI workflow hook for React with automatic rollback on error, retry capability, and pending states.

## Installation

```bash
npm install @pareeshy/use-optimistic-action
# or
pnpm add @pareeshy/use-optimistic-action
```

## Quick Start

```tsx
import React from 'react';
import { useOptimisticAction } from '@pareeshy/use-optimistic-action';

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const { state: likes, execute: toggleLike, isPending, error, retry } = useOptimisticAction(
    initialLikes,
    async () => {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    },
    {
      update: (prev) => prev + 1,
      rollback: (prev) => prev
    }
  );

  return (
    <div>
      <button onClick={() => toggleLike(undefined)} disabled={isPending}>
        Likes: {likes}
      </button>
      {error && (
        <div>
          <span>Failed to like.</span>
          <button onClick={retry}>Retry</button>
        </div>
      )}
    </div>
  );
}
```

## API

### `useOptimisticAction(initialState, action, options)`

### Options

| Option | Type | Description |
| --- | --- | --- |
| `update` | `(current: S, payload: P) => S` | Calculates immediate UI state update |
| `rollback` | `(prev: S, payload: P, error: unknown) => S` | Optional custom rollback calculation |
| `onSuccess` | `(result: R, payload: P) => void` | Called on successful async resolution |
| `onError` | `(error: unknown, payload: P) => void` | Called on rejection |

### Return Object

| Property | Type | Description |
| --- | --- | --- |
| `state` | `S` | Current UI state |
| `execute` | `(payload: P) => Promise<boolean>` | Triggers optimistic update and server call |
| `isPending` | `boolean` | Indicates active async execution |
| `error` | `Error \| null` | Error object if last attempt failed |
| `retry` | `() => Promise<boolean>` | Retries the last failed action |
| `rollback` | `() => void` | Manually revert to previous state |
| `reset` | `() => void` | Reset state to initial value |

## License

MIT
