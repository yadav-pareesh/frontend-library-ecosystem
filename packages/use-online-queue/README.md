# @pareesh/use-online-queue

Offline-first persistent action queue for React with automatic retry, idempotency deduplication, and network-aware background processing.

## Installation

```bash
npm install @pareesh/use-online-queue
# or
pnpm add @pareesh/use-online-queue
```

## Quick Start

```tsx
import React from 'react';
import { useOnlineQueue } from '@pareesh/use-online-queue';

interface PostData {
  title: string;
  body: string;
}

export function PostCreator() {
  const { enqueue, items, isProcessing, isOnline } = useOnlineQueue<PostData>({
    storageKey: 'pending-posts',
    onProcess: async (item) => {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
    }
  });

  return (
    <div>
      <p>Network Status: {isOnline ? 'Online' : 'Offline'}</p>
      <p>Pending queue items: {items.length}</p>
      {isProcessing && <p>Processing queue...</p>}
      <button
        onClick={() =>
          enqueue({ title: 'New Note', body: 'Queued sync note' })
        }
      >
        Submit Post
      </button>
    </div>
  );
}
```

## API

### `useOnlineQueue<T>(options)`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `onProcess` | `(item: QueueItem<T>) => Promise<void>` | **required** | Async worker for each queued action |
| `storageKey` | `string` | `undefined` | localStorage key for cross-session offline persistence |
| `maxRetries` | `number` | `3` | Maximum retry attempts per item before discard |
| `retryDelayMs` | `number` | `1000` | Base retry backoff delay |
| `backoffMultiplier` | `number` | `2` | Exponential backoff factor |
| `autoProcess` | `boolean` | `true` | Process automatically when connection restores |

### Return Object

| Property | Type | Description |
| --- | --- | --- |
| `items` | `QueueItem<T>[]` | Currently queued items |
| `isProcessing` | `boolean` | Whether an item is actively processing |
| `isOnline` | `boolean` | Online/offline status |
| `enqueue(payload, id?)` | `(payload: T, id?: string) => string` | Enqueues action with deduplication ID |
| `remove(id)` | `(id: string) => void` | Removes specific item by ID |
| `clear()` | `() => void` | Clears all queued items |
| `processQueue()` | `() => Promise<void>` | Manually trigger queue processing |

## License

MIT
