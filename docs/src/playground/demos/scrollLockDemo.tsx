import React, { useState, useEffect } from 'react';
import { useScrollLock } from '@pareeshy/scroll-lock';
import { PlaygroundDemoProps } from '../types';

export function ScrollLockDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [modalOpen, setModalOpen] = useState(false);

  useScrollLock(modalOpen);

  useEffect(() => {
    setModalOpen(false);
    log('info', 'Initialized @pareeshy/scroll-lock with scrollbar compensation');
  }, [resetKey]);

  useEffect(() => {
    if (modalOpen) {
      log(
        'warning',
        'Modal opened: Document body scroll LOCKED (scrollbar width compensated to prevent layout shifts)'
      );
    } else {
      log('info', 'Modal closed: Document body scroll UNLOCKED');
    }
  }, [modalOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
        When opening modals, drawers, or dialogs, locking the background scroll prevents awkward
        dual-scrolling while compensating for the disappearing scrollbar to avoid visual layout
        jitter.
      </p>

      <div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          🔒 Open Modal & Lock Background Scroll
        </button>
      </div>

      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 440,
              width: '100%',
              backgroundColor: 'var(--stripe-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--stripe-border)',
              padding: 24,
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-head)' }}>
              🔒 Scroll Lock Active
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-body)',
                margin: '12px 0 16px',
                lineHeight: 1.5
              }}
            >
              Try scrolling using your mouse wheel. Notice the background page cannot scroll at all,
              and no layout shift occurred when the scrollbar vanished!
            </p>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Unlock & Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
