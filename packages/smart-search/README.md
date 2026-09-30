# @pareeshy/smart-search

High-speed client-side fuzzy search utility and React hook with scoring, keyword highlighting, recent history, and keyboard navigation.

## Installation

```bash
npm install @pareeshy/smart-search
# or
pnpm add @pareeshy/smart-search
```

## Quick Start

```tsx
import React from 'react';
import { useSmartSearch, highlightMatches } from '@pareeshy/smart-search';

const users = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com' },
  { id: 3, name: 'Alex Johnson', email: 'alex@example.com' }
];

export function UserSearch() {
  const { query, setQuery, results, selectedIndex, onKeyDown } = useSmartSearch({
    items: users,
    keys: ['name', 'email'],
    debounceMs: 150
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search users..."
      />
      <ul>
        {results.map(({ item }, idx) => (
          <li key={item.id} style={{ background: idx === selectedIndex ? '#e0f2fe' : 'transparent' }}>
            {highlightMatches(item.name, query).map((part, i) => (
              <span key={i} style={{ fontWeight: part.isMatch ? 'bold' : 'normal' }}>
                {part.text}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### `fuzzyMatch(target, query): FuzzyMatchResult`
Calculates score and whether characters match.

### `highlightMatches(text, query): HighlightSegment[]`
Tokenizes a string into matched and unmatched segments for styling.

### `useSmartSearch<T>(options): UseSmartSearchReturn<T>`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | **required** | Dataset array |
| `keys` | `(keyof T \| ((item: T) => string))[]` | **required** | Properties or extractor functions to index |
| `threshold` | `number` | `10` | Minimum fuzzy score to include |
| `debounceMs` | `number` | `150` | Input debounce delay |
| `recentLimit` | `number` | `5` | History limit |

## License

MIT
