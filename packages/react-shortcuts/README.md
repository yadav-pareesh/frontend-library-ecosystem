# @pareeshy/react-shortcuts

Ergonomic keyboard shortcut manager for React with Mac/Windows 'mod' normalization, scoping, and form input isolation.

## Installation

```bash
npm install @pareeshy/react-shortcuts
# or
pnpm add @pareeshy/react-shortcuts
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useShortcut } from '@pareeshy/react-shortcuts';

export function Editor() {
  const [saved, setSaved] = useState(false);

  // 'mod' automatically maps to Command on macOS and Control on Windows/Linux
  useShortcut('mod+s', (e) => {
    console.log('Saved document!');
    setSaved(true);
  });

  useShortcut('escape', () => {
    console.log('Dismissed modal');
  });

  return <div>Press Cmd+S (or Ctrl+S) to save.</div>;
}
```

## API

### `useShortcut(combination, handler, options?)`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Turn hotkey on/off |
| `preventDefault` | `boolean` | `true` | Prevent default browser action |
| `stopPropagation` | `boolean` | `false` | Stop bubbling to parent elements |
| `ignoreInputs` | `boolean` | `true` | Suppress when focused in inputs/textareas |
| `target` | `HTMLElement \| Window` | `window` | Specific element scope |

## License

MIT
