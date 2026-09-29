# @pareesh/use-idle-detection

User inactivity detection hook for React supporting mouse, keyboard, touch, scroll, pointer, and visibility changes with configurable timeout.

## Installation

```bash
npm install @pareesh/use-idle-detection
# or
pnpm add @pareesh/use-idle-detection
```

## Quick Start

```tsx
import React from 'react';
import { useIdleDetection } from '@pareesh/use-idle-detection';

export function InactivityWarning() {
  const { isIdle, reset, pause, resume } = useIdleDetection({
    timeout: 300_000, // 5 minutes
    onIdle: () => console.log('Session timed out'),
    onActive: () => console.log('User returned')
  });

  return (
    <div>
      {isIdle ? (
        <div className="modal">
          <p>Are you still there? Your session will expire soon.</p>
          <button onClick={reset}>I'm still here</button>
        </div>
      ) : (
        <p>Active session</p>
      )}
    </div>
  );
}
```

## API

### `useIdleDetection(options?)`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `timeout` | `number` | `60000` (1 min) | Idle delay in milliseconds |
| `initialIdle` | `boolean` | `false` | Starting idle state |
| `onIdle` | `() => void` | `undefined` | Callback fired when user becomes idle |
| `onActive` | `() => void` | `undefined` | Callback fired when user performs activity |
| `events` | `string[]` | Default events | Custom DOM event names to monitor |
| `idleOnVisibilityHidden` | `boolean` | `false` | Treat tab switching/minimizing as instant idle |

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `isIdle` | `boolean` | Whether the user is currently idle |
| `lastActive` | `number` | Timestamp of the most recent user activity |
| `reset` | `() => void` | Manually mark active and restart timer |
| `pause` | `() => void` | Pause activity tracking |
| `resume` | `() => void` | Resume activity tracking |

## License

MIT
