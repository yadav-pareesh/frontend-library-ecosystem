import React, { useState, useEffect } from 'react';
import { useInfiniteScroll } from '@pareeshy/use-infinite-scroll';
import { PlaygroundDemoProps } from '../types';

export function UseInfiniteScrollDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [items, setItems] = useState<string[]>(() =>
    Array.from({ length: 8 }, (_, i) => `Package Registry Item #${i + 1}`)
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    log('info', 'IntersectionObserver triggered: Loading next 6 items...');

    await new Promise((r) => setTimeout(r, 600));

    setItems((prev) => {
      const nextBatch = Array.from(
        { length: 6 },
        (_, i) => `Package Registry Item #${prev.length + i + 1}`
      );
      if (prev.length + nextBatch.length >= 32) {
        setHasMore(false);
        log('warning', 'Loaded all 32 items. hasMore set to false.');
      } else {
        log('success', `Appended 6 items. Total items: ${prev.length + nextBatch.length}`);
      }
      return [...prev, ...nextBatch];
    });

    setLoading(false);
  };

  const sentinelRef = useInfiniteScroll({
    loadMore,
    hasMore,
    loading,
    rootMargin: '40px'
  });

  useEffect(() => {
    setItems(Array.from({ length: 8 }, (_, i) => `Package Registry Item #${i + 1}`));
    setHasMore(true);
    setLoading(false);
    log('info', 'Initialized @pareeshy/use-infinite-scroll');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Items Loaded: <strong>{items.length} / 32</strong>
        </span>
        <button
          onClick={() => {
            setItems(Array.from({ length: 8 }, (_, i) => `Package Registry Item #${i + 1}`));
            setHasMore(true);
            log('info', 'Reset item list back to initial 8 items');
          }}
          style={{
            padding: '4px 10px',
            fontSize: '0.78rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            cursor: 'pointer'
          }}
        >
          🔄 Reset List
        </button>
      </div>

      {/* Scroll Container */}
      <div
        style={{
          height: 220,
          overflowY: 'auto',
          border: '1px solid var(--stripe-border)',
          borderRadius: 'var(--radius-md)',
          padding: 10,
          backgroundColor: 'var(--stripe-bg-surface)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--stripe-bg-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-body)',
                border: '1px solid var(--stripe-border)'
              }}
            >
              📦 {item}
            </div>
          ))}

          {/* Sentinel Element for IntersectionObserver */}
          <div
            ref={sentinelRef}
            style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {loading ? (
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                ⏳ Fetching next batch...
              </span>
            ) : !hasMore ? (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ✓ End of list (All 32 items loaded)
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Scroll down to load more...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
