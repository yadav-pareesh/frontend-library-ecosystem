# @pareesh/use-permission

Browser Permissions API abstraction hook for React supporting camera, microphone, geolocation, notifications, and clipboard with graceful degradation.

## Installation

```bash
npm install @pareesh/use-permission
# or
pnpm add @pareesh/use-permission
```

## Quick Start

```tsx
import React from 'react';
import { usePermission } from '@pareesh/use-permission';

export function GeolocationWidget() {
  const { state, isSupported, isLoading } = usePermission('geolocation');

  if (!isSupported) {
    return <p>Geolocation permissions are not supported by this browser.</p>;
  }

  if (isLoading) {
    return <p>Checking permissions...</p>;
  }

  return (
    <div>
      <p>Permission status: <strong>{state}</strong></p>
      {state === 'prompt' && <button>Request Location</button>}
      {state === 'granted' && <p>Location available</p>}
      {state === 'denied' && <p>Permission was blocked.</p>}
    </div>
  );
}
```

## API

### `usePermission(permissionName): UsePermissionResult`

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `state` | `'granted' \| 'denied' \| 'prompt' \| 'unsupported'` | Current permission status |
| `isSupported` | `boolean` | Whether browser supports Permissions API |
| `isLoading` | `boolean` | True while initial query resolves |

## License

MIT
