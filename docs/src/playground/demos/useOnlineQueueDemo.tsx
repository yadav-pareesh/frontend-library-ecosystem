import React, { useState, useEffect } from 'react';
import { useOnlineQueue, QueueItem } from '@pareeshy/use-online-queue';
import { PlaygroundDemoProps } from '../types';

interface ActionPayload {
  title: string;
  type: 'post' | 'comment' | 'reaction';
}

export function UseOnlineQueueDemo({ log, resetKey }: PlaygroundDemoProps) {
  const [failRate, setFailRate] = useState(0);
  const [actionTitle, setActionTitle] = useState('Create invoice #1042');
  const [processedLog, setProcessedLog] = useState<string[]>([]);

  const queue = useOnlineQueue<ActionPayload>({
    storageKey: 'playground_online_queue',
    maxRetries: 3,
    retryDelayMs: 800,
    onProcess: async (item: QueueItem<ActionPayload>) => {
      log(
        'info',
        `Processing queue item: "${item.payload.title}" (Attempt ${item.retryCount + 1})`
      );
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (Math.random() < failRate) {
        throw new Error('Simulated backend network failure (503)');
      }

      setProcessedLog((prev) => [
        `✓ Processed: ${item.payload.title} (${new Date().toLocaleTimeString()})`,
        ...prev
      ]);
      log('success', `Completed action: "${item.payload.title}"`);
    }
  });

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-online-queue with retry processor');
  }, [resetKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls & Enqueue Bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 240px' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-head)',
              display: 'block',
              marginBottom: 4
            }}
          >
            Action Title
          </label>
          <input
            type="text"
            value={actionTitle}
            onChange={(e) => setActionTitle(e.target.value)}
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
            Simulated Error Rate: {Math.round(failRate * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={failRate}
            onChange={(e) => setFailRate(Number(e.target.value))}
            style={{ width: 140 }}
          />
        </div>

        <button
          onClick={() => {
            if (!actionTitle.trim()) return;
            const id = queue.enqueue({ title: actionTitle, type: 'post' });
            log('info', `Enqueued item: "${actionTitle}" [ID: ${id}]`);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ➕ Enqueue Task
        </button>

        <button
          onClick={() => {
            queue.clear();
            log('warning', 'Cleared online queue');
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-bg-subtle)',
            color: 'var(--text-head)',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {/* Queue Status Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Queue Status: <strong>{queue.items.length} pending</strong>
        </span>
        {queue.isProcessing && (
          <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
            ⏳ Processing queue actively...
          </span>
        )}
      </div>

      {/* Queue Items Table */}
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
            fontWeight: 600,
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          Pending Offline Queue ({queue.items.length})
        </div>
        <div style={{ maxHeight: 180, overflowY: 'auto' }}>
          {queue.items.length === 0 ? (
            <div
              style={{
                padding: '20px 14px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              Queue is empty. Click "Enqueue Task" to queue offline requests.
            </div>
          ) : (
            queue.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                  borderBottom: '1px solid var(--stripe-border)',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-head)' }}>
                    {item.payload.title}
                  </span>
                  <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Retries: {item.retryCount}/3
                  </span>
                  {item.lastError && (
                    <div style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                      Error: {item.lastError}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    queue.remove(item.id);
                    log('warning', `Removed item ${item.id}`);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Process Log */}
      {processedLog.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: 'var(--success)' }}>
          {processedLog.slice(0, 3).map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}
