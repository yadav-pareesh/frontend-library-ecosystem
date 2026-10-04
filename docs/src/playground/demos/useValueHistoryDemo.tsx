import React, { useState, useEffect } from 'react';
import { useValueHistory } from '@pareeshy/use-value-history';
import { PlaygroundDemoProps } from '../types';

export function UseValueHistoryDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [val, setVal] = useState('Idle');
  const historyResult = useValueHistory(val, { maxSize: 6 });

  useEffect(() => {
    setVal('Idle');
    historyResult.clear();
    log('info', 'Initialized @pareeshy/use-value-history (Capacity: 6 snapshots)');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Quick Action Triggers */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Idle', 'Drafting', 'In Review', 'Approved', 'Deployed', 'Archived'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setVal(status);
              log('info', `Pushed new state into value history: "${status}"`);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: val === status ? 'var(--primary)' : 'var(--stripe-bg-subtle)',
              color: val === status ? '#fff' : 'var(--text-head)',
              border: '1px solid var(--stripe-border)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}
          >
            {status}
          </button>
        ))}

        <button
          onClick={() => {
            historyResult.clear();
            log('warning', 'Cleared value history buffer');
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.82rem'
          }}
        >
          Clear History
        </button>
      </div>

      {/* History Timeline */}
      <div
        style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--stripe-bg-subtle)',
          border: '1px solid var(--stripe-border)'
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
          Timeline Snapshots ({historyResult.history.length}/6 retained)
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            overflowX: 'auto',
            padding: '4px 0'
          }}
        >
          {historyResult.history.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor:
                    idx === historyResult.history.length - 1
                      ? 'var(--primary)'
                      : 'var(--stripe-bg-surface)',
                  color: idx === historyResult.history.length - 1 ? '#fff' : 'var(--text-head)',
                  border: '1px solid var(--stripe-border)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                #{idx + 1}: {item}
              </div>
              {idx < historyResult.history.length - 1 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
