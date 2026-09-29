# @pareesh/auto-ellipsis

Intelligent text truncation component and hook for React supporting single-line, multi-line, ResizeObserver responsive reflow, and expand/collapse accessibility.

## Installation

```bash
npm install @pareesh/auto-ellipsis
# or
pnpm add @pareesh/auto-ellipsis
```

## Quick Start

```tsx
import React from 'react';
import { AutoEllipsis } from '@pareesh/auto-ellipsis';

export function ProductDescription({ description }: { description: string }) {
  return (
    <AutoEllipsis
      text={description}
      lines={3}
      expandable
      expandText="Read full details"
      collapseText="Show less"
    />
  );
}
```

## Hook API: `useAutoEllipsis`

```tsx
import { useAutoEllipsis } from '@pareesh/auto-ellipsis';

function CustomCard({ bio }: { bio: string }) {
  const [ref, { isTruncated, isExpanded, toggleExpand }] = useAutoEllipsis({ lines: 2 });

  return (
    <div>
      <p ref={ref} style={{ WebkitLineClamp: isExpanded ? 'none' : 2 }}>
        {bio}
      </p>
      {isTruncated && (
        <button onClick={toggleExpand}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      )}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | **required** | Content string to display and truncate |
| `lines` | `number` | `1` | Number of clamped lines |
| `expandable` | `boolean` | `false` | Enable expand/collapse button |
| `expandText` | `string` | `'Read more'` | Button label when clamped |
| `collapseText` | `string` | `'Show less'` | Button label when expanded |
| `renderTooltip` | `(text: string) => ReactNode` | `undefined` | Custom tooltip renderer when truncated |

## License

MIT
