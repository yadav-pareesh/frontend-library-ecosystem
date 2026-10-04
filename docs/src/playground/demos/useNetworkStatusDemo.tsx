import React, { useEffect } from 'react';
import { useNetworkStatus } from '@pareeshy/use-network-status';
import { PlaygroundDemoProps } from '../types';

export function UseNetworkStatusDemo({ log, resetKey }: PlaygroundDemoProps) {
  const status = useNetworkStatus();

  useEffect(() => {
    log('info', 'Initialized @pareeshy/use-network-status', {
      online: status.online,
      effectiveType: status.effectiveType,
      downlink: status.downlink
    });
  }, [resetKey]);

  useEffect(() => {
    if (status.online) {
      log('success', 'Network Status: ONLINE', { rtt: status.rtt, downlink: status.downlink });
    } else {
      log('error', 'Network Status: OFFLINE');
    }
  }, [status.online]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status Hero Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: status.online ? 'var(--success-bg)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${status.online ? 'var(--success-border)' : 'rgba(239, 68, 68, 0.3)'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.8rem' }}>{status.online ? '📶' : '🚫'}</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                color: status.online ? 'var(--success)' : '#ef4444'
              }}
            >
              {status.online ? 'Device is Online' : 'Device is Offline'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Native browser window.navigator.onLine detection
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              // Simulate offline event
              window.dispatchEvent(new Event('offline'));
              log('warning', 'Dispatched synthetic "offline" event to window');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Simulate Offline
          </button>
          <button
            onClick={() => {
              // Simulate online event
              window.dispatchEvent(new Event('online'));
              log('success', 'Dispatched synthetic "online" event to window');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--stripe-border)',
              backgroundColor: 'var(--stripe-bg)',
              color: 'var(--text-head)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Simulate Online
          </button>
        </div>
      </div>

      {/* Network Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Effective Type
          </span>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-head)', marginTop: 4 }}
          >
            {status.effectiveType || 'N/A (Safari/Firefox)'}
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
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Downlink Speed
          </span>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-head)', marginTop: 4 }}
          >
            {status.downlink ? `${status.downlink} Mbps` : 'N/A'}
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
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            RTT Latency
          </span>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-head)', marginTop: 4 }}
          >
            {status.rtt ? `${status.rtt} ms` : 'N/A'}
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
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            Data Saver
          </span>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-head)', marginTop: 4 }}
          >
            {status.saveData ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );
}
