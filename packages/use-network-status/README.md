# @pareeshy/use-network-status

Reactive network status hook for React with online/offline detection, effective connection type, downlink, RTT, and graceful degradation.

## Installation

```bash
npm install @pareeshy/use-network-status
# or
pnpm add @pareeshy/use-network-status
```

## Quick Start

```tsx
import React from 'react';
import { useNetworkStatus } from '@pareeshy/use-network-status';

export function ConnectionBanner() {
  const { online, effectiveType, downlink, rtt } = useNetworkStatus();

  if (!online) {
    return <div className="banner danger">You are currently offline.</div>;
  }

  return (
    <div className="banner info">
      Online {effectiveType && `(${effectiveType.toUpperCase()})`}
      {downlink && ` • ${downlink} Mbps`}
      {rtt && ` • ${rtt}ms RTT`}
    </div>
  );
}
```

## API

### `useNetworkStatus(): NetworkStatus`

Returns an object containing:

| Property | Type | Description |
| --- | --- | --- |
| `online` | `boolean` | `true` if browser has network connection, `false` otherwise |
| `effectiveType` | `'slow-2g' \| '2g' \| '3g' \| '4g' \| undefined` | Effective network connection speed (if supported by browser) |
| `downlink` | `number \| undefined` | Estimated bandwidth capacity in Megabits per second |
| `rtt` | `number \| undefined` | Estimated round-trip latency in milliseconds |
| `saveData` | `boolean \| undefined` | Indicates if user enabled data-saver mode |

## Browser Support & SSR

* Works across all browsers using `window.addEventListener('online' | 'offline')`.
* Uses the W3C Network Information API where supported (Chromium, modern mobile browsers) and gracefully degrades without runtime errors on Safari/Firefox/Node.js.

## License

MIT
