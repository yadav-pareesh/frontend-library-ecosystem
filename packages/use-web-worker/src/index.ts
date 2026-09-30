import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareeshy/internal-utils';

export interface UseWebWorkerReturn<TInput, TOutput> {
  /** Post data to the worker and await typed result. */
  post: (input: TInput) => Promise<TOutput>;
  /** Latest result returned from the worker. */
  data: TOutput | null;
  /** Whether the worker is currently executing a task. */
  loading: boolean;
  /** Error thrown by worker or communication failure. */
  error: Error | null;
  /** Manually terminate and recreate worker if needed. */
  terminate: () => void;
}

export type WorkerCreator<TInput, TOutput> =
  | (() => Worker)
  | ((input: TInput) => TOutput)
  | string;

function createWorkerFromFunction<TInput, TOutput>(
  fn: (input: TInput) => TOutput
): { worker: Worker; cleanup: () => void } {
  const code = `
    self.onmessage = function(e) {
      try {
        const handler = (${fn.toString()});
        const result = handler(e.data);
        self.postMessage({ success: true, result });
      } catch (err) {
        self.postMessage({ success: false, error: err instanceof Error ? err.message : String(err) });
      }
    };
  `;
  const blob = new Blob([code], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  return {
    worker,
    cleanup: () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    }
  };
}

export function useWebWorker<TInput, TOutput>(
  workerOrFn: WorkerCreator<TInput, TOutput>
): UseWebWorkerReturn<TInput, TOutput> {
  const [data, setData] = useState<TOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const activePromiseRef = useRef<{
    resolve: (res: TOutput) => void;
    reject: (err: Error) => void;
  } | null>(null);

  const initWorker = useCallback(() => {
    if (!isBrowser || typeof Worker === 'undefined') return null;

    if (typeof workerOrFn === 'function') {
      try {
        const probe = (workerOrFn as () => Worker)();
        if (probe && typeof probe === 'object' && probe instanceof Worker) {
          workerRef.current = probe;
          cleanupRef.current = () => probe.terminate();
          return probe;
        }
      } catch {
        // Not a zero-argument Worker factory
      }

      // Pure calculation worker function
      const { worker, cleanup } = createWorkerFromFunction(
        workerOrFn as (input: TInput) => TOutput
      );
      workerRef.current = worker;
      cleanupRef.current = cleanup;
      return worker;
    } else if (typeof workerOrFn === 'string') {
      const worker = new Worker(workerOrFn);
      workerRef.current = worker;
      cleanupRef.current = () => worker.terminate();
      return worker;
    }

    return null;
  }, [workerOrFn]);

  const terminate = useCallback(() => {
    if (activePromiseRef.current) {
      activePromiseRef.current.reject(new Error('Worker terminated'));
      activePromiseRef.current = null;
    }
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    workerRef.current = null;
    setLoading(false);
  }, []);

  const post = useCallback(
    async (input: TInput): Promise<TOutput> => {
      if (!isBrowser) {
        throw new Error('Web Workers are only supported in browser environments.');
      }

      if (!workerRef.current) {
        initWorker();
      }

      const worker = workerRef.current;
      if (!worker) {
        throw new Error('Failed to initialize Web Worker.');
      }

      setLoading(true);
      setError(null);

      return new Promise<TOutput>((resolve, reject) => {
        activePromiseRef.current = { resolve, reject };

        worker.onmessage = (e: MessageEvent) => {
          setLoading(false);
          if (e.data && typeof e.data === 'object' && 'success' in e.data) {
            if (e.data.success) {
              setData(e.data.result);
              resolve(e.data.result);
            } else {
              const err = new Error(e.data.error || 'Worker task failed');
              setError(err);
              reject(err);
            }
          } else {
            setData(e.data);
            resolve(e.data);
          }
          activePromiseRef.current = null;
        };

        worker.onerror = (e: ErrorEvent) => {
          setLoading(false);
          const err = new Error(e.message || 'Worker runtime error');
          setError(err);
          reject(err);
          activePromiseRef.current = null;
        };

        worker.postMessage(input);
      });
    },
    [initWorker]
  );

  useEffect(() => {
    return () => {
      terminate();
    };
  }, [terminate]);

  return {
    post,
    data,
    loading,
    error,
    terminate
  };
}
