import React, { useState, useEffect } from 'react';
import { usePageVisibility } from '@pareeshy/use-page-visibility';
import { PlaygroundDemoProps } from '../types';

export function UsePageVisibilityDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [tabSwitches, setTabSwitches] = useState(0);

  const isVisible = usePageVisibility((visible) => {
    if (!visible) {
      setTabSwitches((c) => c + 1);
      log('warning', 'Page hidden: User navigated away to another browser tab or minimized window');
    } else {
      log('success', 'Page visible: User returned to tab');
    }
  });

  useEffect(() => {
    log(
      'info',
      `Initialized @pareeshy/use-page-visibility. Initial state: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`
    );
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Visibility Status Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isVisible ? 'var(--success-bg)' : 'rgba(217, 119, 6, 0.1)',
          border: `1px solid ${isVisible ? 'var(--success-border)' : 'rgba(217, 119, 6, 0.3)'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.8rem' }}>{isVisible ? '👁️' : '🙈'}</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                color: isVisible ? 'var(--success)' : 'var(--warning)'
              }}
            >
              {isVisible ? 'PAGE IS VISIBLE' : 'PAGE IS HIDDEN'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              document.visibilityState: "
              {typeof document !== 'undefined' ? document.visibilityState : 'visible'}"
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Tab Switches
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-head)' }}>
            {tabSwitches}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)'
        }}
      >
        <h4
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-head)',
            marginBottom: 6
          }}
        >
          💡 How to Test This Hook:
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
          Switch to another browser tab, minimize this window, or press <kbd>Alt+Tab</kbd>. When you
          return, notice the switch count increments and the live log captures the departure and
          return events!
        </p>
      </div>
    </div>
  );
}
