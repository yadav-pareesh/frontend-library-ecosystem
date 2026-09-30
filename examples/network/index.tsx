import React from 'react';
import { useNetworkStatus } from '@pareeshy/use-network-status';
import { useOnlineQueue } from '@pareeshy/use-online-queue';

export function NetworkPlayground() {
  const { online, effectiveType, downlink, rtt } = useNetworkStatus();

  const { items, enqueue, isProcessing } = useOnlineQueue<{ action: string; timestamp: number }>({
    storageKey: 'demo-offline-queue',
    onProcess: async (item) => {
      // Simulate API sync
      await new Promise((res) => setTimeout(res, 800));
      console.log('Processed offline action:', item);
    }
  });

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Network & Offline Sync Playground</h2>
      <div style={{ padding: 12, borderRadius: 8, backgroundColor: online ? '#dcfce7' : '#fee2e2' }}>
        <strong>Status:</strong> {online ? 'Online' : 'Offline'} | Speed: {effectiveType || 'N/A'} | Downlink: {downlink || 'N/A'} Mbps | RTT: {rtt || 'N/A'}ms
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => enqueue({ action: 'Like post', timestamp: Date.now() })}>
          Enqueue Action
        </button>
        <p>Queued items: {items.length} {isProcessing && '(Processing...)'}</p>
      </div>
    </div>
  );
}
