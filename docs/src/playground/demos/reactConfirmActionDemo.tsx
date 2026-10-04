import React, { useEffect } from 'react';
import { ConfirmProvider, useConfirmAction } from '@pareeshy/react-confirm-action';
import { PlaygroundDemoProps } from '../types';

function ConfirmInnerDemo({ log }: { log: (lvl: any, msg: string, data?: any) => void }) {
  const confirm = useConfirmAction();

  const handleDeleteAccount = async () => {
    log('info', 'Triggered confirm() Promise dialog...');
    const approved = await confirm({
      title: 'Delete Production Database?',
      message: 'This will permanently destroy all records in staging and production. Are you sure?',
      confirmText: 'Yes, Delete Everything',
      cancelText: 'Cancel Safe',
      destructive: true
    });

    if (approved) {
      log('error', 'User clicked CONFIRM (Promise resolved true)');
    } else {
      log('info', 'User clicked CANCEL or pressed ESC (Promise resolved false)');
    }
  };

  const handleSimpleConfirm = async () => {
    const ok = await confirm({
      title: 'Deploy to Edge?',
      message: 'Promote release candidate v1.0.1 to 100% global traffic?',
      confirmText: 'Deploy Now',
      destructive: false
    });

    if (ok) {
      log('success', 'User approved deployment!');
    } else {
      log('warning', 'Deployment aborted by user.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button
        onClick={handleDeleteAccount}
        style={{
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#ef4444',
          color: '#fff',
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        🗑️ Destructive Action Dialog
      </button>

      <button
        onClick={handleSimpleConfirm}
        style={{
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        🚀 Standard Confirmation Dialog
      </button>
    </div>
  );
}

export function ReactConfirmActionDemo({ log, resetKey }: PlaygroundDemoProps) {
  useEffect(() => {
    log('info', 'Initialized @pareeshy/react-confirm-action with Promise-based modal');
  }, [resetKey]);

  return (
    <ConfirmProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
          Replace ugly native <code>window.confirm()</code> with a fully accessible, promise-based
          React confirmation dialog supporting focus management, keyboard trapping (<kbd>ESC</kbd>{' '}
          to cancel), and custom styling.
        </p>
        <ConfirmInnerDemo log={log} />
      </div>
    </ConfirmProvider>
  );
}
