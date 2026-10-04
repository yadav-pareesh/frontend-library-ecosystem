import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface QueueItem<T> {
  id: string;
  payload: T;
  createdAt: number;
  retryCount: number;
  lastError?: string;
}

export interface UseOnlineQueueOptions<T> {
  /** Storage key to persist queue across refreshes. */
  storageKey?: string;
  /** Async processor callback for each item in the queue. */
  onProcess: (item: QueueItem<T>) => Promise<void>;
  /** Maximum number of retry attempts before discarding or marking as failed. @default 3 */
  maxRetries?: number;
  /** Base delay between retries in milliseconds. @default 1000 */
  retryDelayMs?: number;
  /** Exponential backoff multiplier. @default 2 */
  backoffMultiplier?: number;
  /** Automatically process items when online. @default true */
  autoProcess?: boolean;
}

export interface OnlineQueueResult<T> {
  items: QueueItem<T>[];
  isProcessing: boolean;
  isOnline: boolean;
  enqueue: (payload: T, customId?: string) => string;
  remove: (id: string) => void;
  clear: () => void;
  processQueue: () => Promise<void>;
}

export function useOnlineQueue<T>(options: UseOnlineQueueOptions<T>): OnlineQueueResult<T> {
  const {
    storageKey,
    onProcess,
    maxRetries = 3,
    retryDelayMs = 1000,
    backoffMultiplier = 2,
    autoProcess = true
  } = options;

  const onProcessRef = useRef(onProcess);
  onProcessRef.current = onProcess;

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    isBrowser && typeof navigator.onLine === 'boolean' ? navigator.onLine : true
  );

  const [items, setItems] = useState<QueueItem<T>[]>(() => {
    if (!isBrowser || !storageKey) return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Persist items
  useEffect(() => {
    if (!isBrowser || !storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Storage quota or permission error
    }
  }, [items, storageKey]);

  // Online / offline listeners
  useEffect(() => {
    if (!isBrowser) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const remove = useCallback((id: string) => {
    itemsRef.current = itemsRef.current.filter((item) => item.id !== id);
    setItems(itemsRef.current);
  }, []);

  const clear = useCallback(() => {
    itemsRef.current = [];
    setItems([]);
  }, []);

  const enqueue = useCallback((payload: T, customId?: string): string => {
    const id = customId || `queue_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    if (itemsRef.current.some((item) => item.id === id)) {
      return id;
    }

    const next = [
      ...itemsRef.current,
      {
        id,
        payload,
        createdAt: Date.now(),
        retryCount: 0
      }
    ];
    itemsRef.current = next;
    setItems(next);

    return id;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || !navigator.onLine || itemsRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      while (itemsRef.current.length > 0 && navigator.onLine) {
        const item = itemsRef.current[0];
        if (!item) break;

        try {
          await onProcessRef.current(item);
          // Success: pop item immediately
          itemsRef.current = itemsRef.current.filter((i) => i.id !== item.id);
          setItems(itemsRef.current);
        } catch (err) {
          const nextRetry = item.retryCount + 1;
          const errorMsg = err instanceof Error ? err.message : String(err);

          if (nextRetry > maxRetries) {
            // Discard after max retries
            itemsRef.current = itemsRef.current.filter((i) => i.id !== item.id);
            setItems(itemsRef.current);
          } else {
            // Increment retry count and delay
            itemsRef.current = itemsRef.current.map((i) =>
              i.id === item.id ? { ...i, retryCount: nextRetry, lastError: errorMsg } : i
            );
            setItems(itemsRef.current);
            const delay = retryDelayMs * Math.pow(backoffMultiplier, item.retryCount);
            await new Promise((res) => setTimeout(res, delay));
          }
          break;
        }
      }
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [maxRetries, retryDelayMs, backoffMultiplier]);

  useEffect(() => {
    if (autoProcess && isOnline && items.length > 0 && !isProcessingRef.current) {
      void processQueue();
    }
  }, [autoProcess, isOnline, items.length, processQueue]);

  return {
    items,
    isProcessing,
    isOnline,
    enqueue,
    remove,
    clear,
    processQueue
  };
}
