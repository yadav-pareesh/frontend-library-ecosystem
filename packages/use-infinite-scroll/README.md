# @pareesh/use-infinite-scroll

IntersectionObserver-based infinite scrolling hook for React with loadMore, cancellation, and rootMargin options.

## Installation

```bash
npm install @pareesh/use-infinite-scroll
# or
pnpm add @pareesh/use-infinite-scroll
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useInfiniteScroll } from '@pareesh/use-infinite-scroll';

export function ItemFeed() {
  const [items, setItems] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useInfiniteScroll({
    loading,
    hasMore,
    rootMargin: '200px',
    loadMore: async () => {
      setLoading(true);
      const more = await fetchMoreItems();
      setItems((prev) => [...prev, ...more]);
      setLoading(false);
    }
  });

  return (
    <div>
      {items.map((item) => (
        <div key={item} className="item-card">{item}</div>
      ))}
      <div ref={sentinelRef} style={{ height: 20 }} />
      {loading && <p>Loading more...</p>}
    </div>
  );
}
```

## API

### `useInfiniteScroll(options): (element: HTMLElement | null) => void`

Returns a callback ref to attach to the sentinel bottom element.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `loadMore` | `() => void \| Promise<void>` | **required** | Async fetcher function |
| `hasMore` | `boolean` | **required** | Indicates whether more pages exist |
| `loading` | `boolean` | `false` | Prevents multiple concurrent fetches |
| `root` | `Element \| null` | `null` | Scrollable parent (defaults to window) |
| `rootMargin` | `string` | `'100px'` | Pre-fetch distance threshold |
| `threshold` | `number \| number[]` | `0.1` | Intersection ratio |
| `disabled` | `boolean` | `false` | Temporarily disable observer |

## License

MIT
