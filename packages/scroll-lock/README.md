# @pareesh/scroll-lock

Reliable scroll locking library and React hook with scrollbar shift compensation, nested locks support, and clean restoration.

## Installation

```bash
npm install @pareesh/scroll-lock
# or
pnpm add @pareesh/scroll-lock
```

## Quick Start

### React Hook

```tsx
import React, { useState } from 'react';
import { useScrollLock } from '@pareesh/scroll-lock';

export function Modal({ isOpen, onClose }) {
  // Automatically locks body scroll when open and unlocks on close/unmount
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="backdrop">
      <div className="dialog">
        <h2>Modal Content</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### Vanilla JS / Imperative API

```ts
import { lockScroll } from '@pareesh/scroll-lock';

const unlock = lockScroll();

// Later when closing modal:
unlock();
```

## Features

* **Scrollbar compensation**: automatically adjusts body `paddingRight` by scrollbar width to prevent content jumping.
* **Nested overlays**: supports reference-counted locks so closing a child modal does not prematurely unlock the parent dialog.
* **SSR-safe**: gracefully no-ops in server runtimes.

## License

MIT
