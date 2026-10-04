import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@pareeshy/use-media-query';
import { PlaygroundDemoProps } from '../types';

export function UseMediaQueryDemo({ log, resetKey }: PlaygroundDemoProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [customQuery, setCustomQuery] = useState('(min-width: 800px)');
  const isCustomMatch = useMediaQuery(customQuery);

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-media-query with reactive matchMedia listeners');
  }, [resetKey]);

  useEffect(() => {
    log('info', `Custom query "${customQuery}" changed match state: ${isCustomMatch}`);
  }, [isCustomMatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Screen Size Match Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12
        }}
      >
        <div
          style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            backgroundColor: isMobile ? 'var(--primary-light)' : 'var(--stripe-bg-subtle)',
            border: `1px solid ${isMobile ? 'var(--primary)' : 'var(--stripe-border)'}`
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Mobile (≤ 640px)
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: isMobile ? 'var(--primary)' : 'var(--text-muted)',
              marginTop: 4
            }}
          >
            {isMobile ? '✓ ACTIVE' : 'Inactive'}
          </div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            backgroundColor: isTablet ? 'var(--primary-light)' : 'var(--stripe-bg-subtle)',
            border: `1px solid ${isTablet ? 'var(--primary)' : 'var(--stripe-border)'}`
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Tablet (641px - 1024px)
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: isTablet ? 'var(--primary)' : 'var(--text-muted)',
              marginTop: 4
            }}
          >
            {isTablet ? '✓ ACTIVE' : 'Inactive'}
          </div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 'var(--radius-md)',
            backgroundColor: isDesktop ? 'var(--primary-light)' : 'var(--stripe-bg-subtle)',
            border: `1px solid ${isDesktop ? 'var(--primary)' : 'var(--stripe-border)'}`
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Desktop (≥ 1025px)
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: isDesktop ? 'var(--primary)' : 'var(--text-muted)',
              marginTop: 4
            }}
          >
            {isDesktop ? '✓ ACTIVE' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            prefers-color-scheme: dark
          </span>
          <div
            style={{
              fontWeight: 700,
              color: isDarkMode ? 'var(--primary)' : 'var(--text-body)',
              marginTop: 4
            }}
          >
            {isDarkMode ? '🌙 Dark mode requested' : '☀️ Light mode'}
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            border: '1px solid var(--stripe-border)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            prefers-reduced-motion
          </span>
          <div
            style={{
              fontWeight: 700,
              color: prefersReducedMotion ? 'var(--warning)' : 'var(--text-body)',
              marginTop: 4
            }}
          >
            {prefersReducedMotion ? '⚠️ Reduced motion active' : '⚡ Smooth animations'}
          </div>
        </div>
      </div>

      {/* Custom Query Tester */}
      <div
        style={{
          border: '1px solid var(--stripe-border)',
          padding: 14,
          borderRadius: 'var(--radius-md)'
        }}
      >
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            display: 'block',
            marginBottom: 4
          }}
        >
          Live Custom Media Query Tester
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          />
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isCustomMatch ? 'var(--success-bg)' : 'rgba(239, 68, 68, 0.1)',
              color: isCustomMatch ? 'var(--success)' : '#ef4444',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${isCustomMatch ? 'var(--success-border)' : 'rgba(239, 68, 68, 0.3)'}`
            }}
          >
            {isCustomMatch ? 'MATCHES: TRUE' : 'MATCHES: FALSE'}
          </div>
        </div>
      </div>
    </div>
  );
}
