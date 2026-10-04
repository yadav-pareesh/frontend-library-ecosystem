import React, { useEffect } from 'react';
import { useSmartSearch, highlightMatches } from '@pareeshy/smart-search';
import { PlaygroundDemoProps } from '../types';

interface SampleLibrary {
  name: string;
  category: string;
  description: string;
}

const SAMPLE_ITEMS: SampleLibrary[] = [
  {
    name: '@pareeshy/use-debounced-value',
    category: 'React Hooks',
    description: 'Debounce fast keystrokes and values'
  },
  {
    name: '@pareeshy/use-local-storage-state',
    category: 'State Management',
    description: 'Reactive localStorage with cross-tab sync'
  },
  {
    name: '@pareeshy/use-network-status',
    category: 'Browser APIs',
    description: 'Detect online/offline, speed, and RTT'
  },
  {
    name: '@pareeshy/use-online-queue',
    category: 'Performance',
    description: 'Offline-first persistent retry action queue'
  },
  {
    name: '@pareeshy/use-idle-detection',
    category: 'Browser APIs',
    description: 'Track user inactivity across DOM events'
  },
  {
    name: '@pareeshy/use-media-query',
    category: 'React Hooks',
    description: 'SSR-safe reactive media queries'
  },
  {
    name: '@pareeshy/use-element-size',
    category: 'UI Utilities',
    description: 'ResizeObserver element measurements'
  },
  {
    name: '@pareeshy/smart-search',
    category: 'Search & Data',
    description: 'Client-side fuzzy search with keyword highlighting'
  },
  {
    name: '@pareeshy/image-compressor',
    category: 'Files & Images',
    description: 'Client-side JPEG/PNG/WebP image compressor'
  },
  {
    name: '@pareeshy/scroll-lock',
    category: 'UI Utilities',
    description: 'Scroll lock with scrollbar width compensation'
  }
];

export function SmartSearchDemo({ log, resetKey }: PlaygroundDemoProps) {
  const { query, setQuery, results, selectedIndex, setSelectedIndex, onKeyDown } =
    useSmartSearch<SampleLibrary>({
      items: SAMPLE_ITEMS,
      keys: ['name', 'category', 'description'],
      debounceMs: 100,
      threshold: 10
    });

  useEffect(() => {
    setQuery('');
    log('info', 'Initialized @pareeshy/smart-search with fuzzy matching & keyboard navigation');
  }, [resetKey]);

  useEffect(() => {
    if (query) {
      log('info', `Fuzzy query: "${query}" (Found ${results.length} matches)`);
    }
  }, [query, results.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search Input */}
      <div>
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            display: 'block',
            marginBottom: 6
          }}
        >
          Fuzzy Search over Libraries (Try: "debounce", "offline", "storage", or "img"):
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type search term (e.g. deb, net, que)..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ✕
            </button>
          )}
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            display: 'block'
          }}
        >
          Supports keyboard navigation: <kbd>↑</kbd> <kbd>↓</kbd> to select result item.
        </span>
      </div>

      {/* Results List */}
      <div
        style={{
          border: '1px solid var(--stripe-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--stripe-bg-surface)'
        }}
      >
        <div
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--stripe-bg-subtle)',
            borderBottom: '1px solid var(--stripe-border)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>Search Results ({results.length})</span>
          <span>Fuzzy Score</span>
        </div>

        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {results.length === 0 ? (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              No matches found for "{query}"
            </div>
          ) : (
            results.map(({ item, score }, index) => {
              const isSelected = index === selectedIndex;
              const nameSegments = highlightMatches(item.name, query);

              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelectedIndex(index);
                    log('success', `Selected search item: ${item.name}`, item);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--stripe-border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: isSelected ? 'var(--primary)' : 'var(--text-head)'
                      }}
                    >
                      {nameSegments.map((seg, i) =>
                        seg.isMatch ? (
                          <mark
                            key={i}
                            style={{
                              backgroundColor: 'rgba(99, 91, 255, 0.25)',
                              color: 'var(--text-head)',
                              fontWeight: 800,
                              borderRadius: 2
                            }}
                          >
                            {seg.text}
                          </mark>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        )
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      backgroundColor: 'var(--stripe-bg-subtle)',
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    Score: {score}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
