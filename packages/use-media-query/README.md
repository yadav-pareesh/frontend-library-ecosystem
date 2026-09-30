# @pareeshy/use-media-query

SSR-safe reactive media query hook for React with matchMedia listener support and fallback values.

## Installation

```bash
npm install @pareeshy/use-media-query
# or
pnpm add @pareeshy/use-media-query
```

## Quick Start

```tsx
import React from 'react';
import { useMediaQuery } from '@pareeshy/use-media-query';

export function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav>
      {isMobile ? <MobileDrawer /> : <DesktopNavbar />}
    </nav>
  );
}
```

## API

### `useMediaQuery(query, options?): boolean`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultValue` | `boolean` | `false` | Default value returned in SSR before hydration |
| `initializeWithValue` | `boolean` | `true` | Evaluate media query immediately on client mount |

### Multiple Media Queries: `useMediaQueries(map)`

```tsx
const { isMobile, prefersDark } = useMediaQueries({
  isMobile: '(max-width: 600px)',
  prefersDark: '(prefers-color-scheme: dark)'
});
```

## License

MIT
