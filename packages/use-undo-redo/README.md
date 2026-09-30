# @pareeshy/use-undo-redo

Generic undo/redo state manager hook for React with past/future stacks, capacity limits, and zero unnecessary cloning.

## Installation

```bash
npm install @pareeshy/use-undo-redo
# or
pnpm add @pareeshy/use-undo-redo
```

## Quick Start

```tsx
import React from 'react';
import { useUndoRedo } from '@pareeshy/use-undo-redo';

export function CanvasEditor() {
  const [color, setColor, { undo, redo, canUndo, canRedo }] = useUndoRedo('#ffffff');

  return (
    <div>
      <div style={{ width: 100, height: 100, backgroundColor: color }} />
      <button onClick={() => setColor('#ff0000')}>Red</button>
      <button onClick={() => setColor('#00ff00')}>Green</button>
      <button onClick={() => setColor('#0000ff')}>Blue</button>

      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

## API

### `useUndoRedo<T>(initialValue, options?): [present, setPresent, controls]`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxHistory` | `number` | `50` | Maximum history states maintained |

### Controls

| Property | Type | Description |
| --- | --- | --- |
| `undo()` | `() => void` | Restores previous state |
| `redo()` | `() => void` | Replays next future state |
| `canUndo` | `boolean` | `true` if past states are available |
| `canRedo` | `boolean` | `true` if future states are available |
| `clear()` | `() => void` | Empties both past and future histories |
| `reset(val)` | `(val: T) => void` | Replaces history with new base value |
| `past` | `T[]` | Array of previous states |
| `future` | `T[]` | Array of future states |

## License

MIT
