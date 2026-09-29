# @pareesh/use-page-visibility

Simple reactive API for document visibility state with SSR safety and change callbacks.

## Installation

```bash
npm install @pareesh/use-page-visibility
# or
pnpm add @pareesh/use-page-visibility
```

## Quick Start

```tsx
import React, { useEffect } from 'react';
import { usePageVisibility } from '@pareesh/use-page-visibility';

export function VideoPlayer() {
  const isVisible = usePageVisibility((visible) => {
    console.log('Document visibility toggled:', visible);
  });

  return (
    <div>
      <p>Page is currently: {isVisible ? 'Active' : 'Background / Hidden'}</p>
      {!isVisible && <span>Video paused automatically</span>}
    </div>
  );
}
```

## API

### `usePageVisibility(onChange?): boolean`

Returns a boolean indicating whether the tab is currently active/visible.

### `useDocumentVisibility(onChange?): DocumentVisibilityState`

Returns `'visible' | 'hidden'`.

## SSR Support

Defaults cleanly to `true` / `'visible'` on the server to prevent hydration divergence.

## License

MIT
