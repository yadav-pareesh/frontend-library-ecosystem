# @pareeshy/use-element-size

High-performance `ResizeObserver`-based DOM element measurement hook for React with SSR safety and zero layout thrashing.

## Installation

```bash
npm install @pareeshy/use-element-size
# or
pnpm add @pareeshy/use-element-size
```

## Quick Start

```tsx
import React from 'react';
import { useElementSize } from '@pareeshy/use-element-size';

export function ResponsiveCard() {
  const [cardRef, { width, height }] = useElementSize<HTMLDivElement>();

  return (
    <div ref={cardRef} style={{ resize: 'both', overflow: 'auto', padding: 16 }}>
      <h3>Measured Element</h3>
      <p>Width: {width}px | Height: {height}px</p>
    </div>
  );
}
```

## API

### `useElementSize<E>(options?): [refCallback, size]`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `box` | `'content-box' \| 'border-box'` | `'content-box'` | Box model measurement target |
| `initialSize` | `{ width: number, height: number }` | `{ width: 0, height: 0 }` | SSR and pre-measurement fallback size |

### Return Value

* `refCallback: (element: E | null) => void` - Callback ref to attach to the target DOM element.
* `size: { width: number, height: number, top?: number, left?: number }` - Current element dimensions.

## License

MIT
