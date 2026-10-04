import React, { useEffect } from 'react';
import { useUrlState } from '@pareeshy/url-state';
import { PlaygroundDemoProps } from '../types';

export function UrlStateDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [filterQuery, setFilterQuery, { clear: clearQuery }] = useUrlState<string>(
    'filter',
    'react',
    {
      historyMode: 'replace'
    }
  );
  const [page, setPage, { clear: clearPage }] = useUrlState<number>('page', 1, {
    historyMode: 'replace'
  });

  useEffect(() => {
    log('info', 'Initialized @pareeshy/url-state with search params synchronization');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}
      >
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Query Parameter (?filter=...)
          </label>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              log('info', `URL state updated: ?filter=${e.target.value}`);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)'
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Page Parameter (?page=...)
          </label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                log('info', `URL state updated: ?page=${next}`);
              }}
              disabled={page <= 1}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)',
                backgroundColor: 'var(--stripe-bg-subtle)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Prev
            </button>
            <span style={{ fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{page}</span>
            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                log('info', `URL state updated: ?page=${next}`);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)',
                backgroundColor: 'var(--stripe-bg-subtle)',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Live Window Location Viewer */}
      <div
        style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--code-bg)',
          border: '1px solid var(--code-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}
      >
        <span style={{ color: 'var(--code-comment)', display: 'block', marginBottom: 6 }}>
          // Live window.location.search:
        </span>
        <div style={{ color: 'var(--code-keyword)' }}>
          {typeof window !== 'undefined'
            ? window.location.search || '(none - default values omitted from URL)'
            : ''}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            clearQuery();
            clearPage();
            log('warning', 'Cleared both URL parameters');
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Reset URL Parameters
        </button>
      </div>
    </div>
  );
}
