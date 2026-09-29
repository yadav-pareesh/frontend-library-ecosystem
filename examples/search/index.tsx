import React from 'react';
import { useSmartSearch, highlightMatches } from '@pareesh/smart-search';
import { useDebouncedValue } from '@pareesh/use-debounced-value';

const products = [
  { id: '1', name: 'Wireless Noise-Canceling Headphones', category: 'Audio', price: 299 },
  { id: '2', name: 'Mechanical Gaming Keyboard', category: 'Accessories', price: 149 },
  { id: '3', name: 'Ultra-Wide 4K Gaming Monitor', category: 'Displays', price: 799 },
  { id: '4', name: 'Ergonomic Vertical Mouse', category: 'Accessories', price: 79 },
  { id: '5', name: 'USB-C Multiport Hub with PD', category: 'Accessories', price: 59 }
];

export function SearchPlayground() {
  const { query, setQuery, results, selectedIndex, onKeyDown } = useSmartSearch({
    items: products,
    keys: ['name', 'category'],
    debounceMs: 100
  });

  const [debouncedQuery] = useDebouncedValue(query, 300);

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Smart Search Playground</h2>
      <input
        type="text"
        placeholder="Type product name or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc' }}
      />
      <p style={{ fontSize: '0.85rem', color: '#666' }}>Debounced query: "{debouncedQuery}"</p>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {results.map(({ item }, idx) => (
          <li
            key={item.id}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #eee',
              backgroundColor: idx === selectedIndex ? '#e0f2fe' : 'transparent',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>
              {highlightMatches(item.name, query).map((part, i) => (
                <span key={i} style={{ backgroundColor: part.isMatch ? '#fef08a' : 'transparent' }}>
                  {part.text}
                </span>
              ))}
              <small style={{ color: '#888', marginLeft: 8 }}>({item.category})</small>
            </span>
            <strong>${item.price}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
