import { useCallback, useRef, useState } from 'react';

export interface OptimisticActionOptions<TState, TPayload, TResult> {
  /** Synchronously computes the next optimistic state from current state and payload. */
  update: (current: TState, payload: TPayload) => TState;
  /** Custom rollback handler. Defaults to reverting directly to previous state. */
  rollback?: (previous: TState, payload: TPayload, error: unknown) => TState;
  /** Callback fired when async action succeeds. */
  onSuccess?: (result: TResult, payload: TPayload) => void;
  /** Callback fired when async action fails. */
  onError?: (error: unknown, payload: TPayload) => void;
}

export interface OptimisticActionReturn<TState, TPayload> {
  state: TState;
  execute: (payload: TPayload) => Promise<boolean>;
  isPending: boolean;
  error: Error | null;
  retry: () => Promise<boolean>;
  rollback: () => void;
  reset: () => void;
}

export function useOptimisticAction<TState, TPayload, TResult = void>(
  initialState: TState,
  action: (payload: TPayload) => Promise<TResult>,
  options: OptimisticActionOptions<TState, TPayload, TResult>
): OptimisticActionReturn<TState, TPayload> {
  const [state, setState] = useState<TState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const actionRef = useRef(action);
  actionRef.current = action;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const lastRollbackStateRef = useRef<TState>(initialState);
  const lastPayloadRef = useRef<TPayload | null>(null);

  const rollbackAction = useCallback(() => {
    setState(lastRollbackStateRef.current);
    setError(null);
    setIsPending(false);
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    setError(null);
    setIsPending(false);
    lastPayloadRef.current = null;
    lastRollbackStateRef.current = initialState;
  }, [initialState]);

  const execute = useCallback(async (payload: TPayload): Promise<boolean> => {
    const prevState = stateRef.current;
    lastRollbackStateRef.current = prevState;
    lastPayloadRef.current = payload;

    // Optimistic update
    const nextState = optionsRef.current.update(prevState, payload);
    setState(nextState);
    setIsPending(true);
    setError(null);

    try {
      const result = await actionRef.current(payload);
      setIsPending(false);
      optionsRef.current.onSuccess?.(result, payload);
      return true;
    } catch (err) {
      const actionError = err instanceof Error ? err : new Error(String(err));
      setError(actionError);
      setIsPending(false);

      // Revert or custom rollback
      if (optionsRef.current.rollback) {
        setState(optionsRef.current.rollback(prevState, payload, actionError));
      } else {
        setState(prevState);
      }

      optionsRef.current.onError?.(actionError, payload);
      return false;
    }
  }, []);

  const retry = useCallback(async (): Promise<boolean> => {
    if (lastPayloadRef.current === null) {
      return false;
    }
    return execute(lastPayloadRef.current);
  }, [execute]);

  return {
    state,
    execute,
    isPending,
    error,
    retry,
    rollback: rollbackAction,
    reset
  };
}
