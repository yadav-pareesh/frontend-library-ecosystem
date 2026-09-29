/**
 * @pareesh/internal-utils
 * Private shared utilities for @pareesh monorepo packages.
 */

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function noop(): void {}

export function safeEventListener<K extends keyof WindowEventMap>(
  target: Window | Document | HTMLElement | null | undefined,
  type: string,
  listener: (event: any) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!target || !target.addEventListener) {
    return noop;
  }
  target.addEventListener(type, listener, options);
  return () => {
    target.removeEventListener(type, listener, options);
  };
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return Boolean(
    value &&
      (typeof value === 'object' || typeof value === 'function') &&
      typeof (value as { then?: unknown }).then === 'function'
  );
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (
      !isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }

  return true;
}
