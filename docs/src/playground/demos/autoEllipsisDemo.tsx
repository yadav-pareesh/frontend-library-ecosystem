import React, { useState, useEffect } from 'react';
import { AutoEllipsis, useAutoEllipsis } from '@pareeshy/auto-ellipsis';
import { PlaygroundDemoProps } from '../types';

export function AutoEllipsisDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [lines, setLines] = useState(2);
  const [boxWidth, setBoxWidth] = useState(380);
  const [sampleText, setSampleText] = useState(
    'Production-grade, scalable frontend utility and library package ecosystem under the @pareeshy scope. High-performance, SSR-safe React hooks for debouncing, state synchronization, storage adapters, and resilient browser APIs.'
  );

  const [ref, { isTruncated, isExpanded, toggleExpand }] = useAutoEllipsis<HTMLDivElement>({
    lines,
    onTruncateChange: (truncated) => {
      log('info', `Truncation state changed: isTruncated = ${truncated} (lines clamped: ${lines})`);
    }
  });

  useEffect(() => {
    log('info', 'Initialized @pareeshy/auto-ellipsis with ResizeObserver responsive reflow');
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
            Clamped Line Count: {lines} {lines === 1 ? '(Single-line)' : '(Multi-line)'}
          </label>
          <input
            type="range"
            min={1}
            max={4}
            value={lines}
            onChange={(e) => setLines(Number(e.target.value))}
            style={{ width: '100%' }}
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
            Container Width: {boxWidth}px
          </label>
          <input
            type="range"
            min={200}
            max={650}
            value={boxWidth}
            onChange={(e) => setBoxWidth(Number(e.target.value))}
            style={{ width: '100%' }}
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
            Custom Text Input:
          </label>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Type custom text to test auto-ellipsis..."
            style={{
              width: '100%',
              padding: '6px 10px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Target Truncated Container */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6
          }}
        >
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-head)' }}>
            Live Truncated Container Preview:
          </label>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: isTruncated ? 'rgba(217, 119, 6, 0.15)' : 'var(--success-bg)',
              color: isTruncated ? 'var(--warning)' : 'var(--success)'
            }}
          >
            {isTruncated ? '✂️ TRUNCATED (Overflow detected)' : '✓ FULL TEXT VISIBLE'}
          </span>
        </div>

        <div
          style={{
            width: `${boxWidth}px`,
            maxWidth: '100%',
            padding: 16,
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-surface)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'width 0.1s ease'
          }}
        >
          <div
            ref={ref}
            style={
              isExpanded
                ? {}
                : lines > 1
                  ? {
                      display: '-webkit-box',
                      WebkitLineClamp: lines,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  : {
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
            }
          >
            {sampleText}
          </div>

          {(isTruncated || isExpanded) && (
            <button
              onClick={() => {
                toggleExpand();
                log(
                  'info',
                  `Toggled expand/collapse: now ${!isExpanded ? 'EXPANDED' : 'COLLAPSED'}`
                );
              }}
              style={{
                marginTop: 8,
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isExpanded ? '↑ Show less' : '↓ Show more'}
            </button>
          )}
        </div>
      </div>

      {/* Component API Test */}
      <div
        style={{
          padding: 12,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}
        >
          Tested with &lt;AutoEllipsis lines={lines} expandable /&gt; component
        </span>
        <div style={{ marginTop: 6 }}>
          <AutoEllipsis
            text="The <AutoEllipsis> component handles accessible ARIA attributes, tooltip fallbacks, and window resize listeners automatically out of the box."
            lines={1}
            expandable
          />
        </div>
      </div>
    </div>
  );
}
