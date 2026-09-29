import { useEffect, useState } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

export interface NetworkStatus {
  online: boolean;
  effectiveType?: EffectiveConnectionType;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: EffectiveConnectionType;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: 'change', listener: (event: Event) => void): void;
  removeEventListener(type: 'change', listener: (event: Event) => void): void;
}

function getNetworkConnection(): NetworkInformation | null {
  if (!isBrowser || !('navigator' in window)) return null;
  const nav = window.navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

function getSnapshot(): NetworkStatus {
  if (!isBrowser) {
    return {
      online: true,
      effectiveType: undefined,
      downlink: undefined,
      rtt: undefined,
      saveData: undefined
    };
  }

  const conn = getNetworkConnection();

  return {
    online: typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
    effectiveType: conn?.effectiveType,
    downlink: conn?.downlink,
    rtt: conn?.rtt,
    saveData: conn?.saveData
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(getSnapshot);

  useEffect(() => {
    if (!isBrowser) return;

    const update = () => {
      setStatus(getSnapshot());
    };

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    const conn = getNetworkConnection();
    if (conn) {
      conn.addEventListener('change', update);
    }

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      if (conn) {
        conn.removeEventListener('change', update);
      }
    };
  }, []);

  return status;
}
