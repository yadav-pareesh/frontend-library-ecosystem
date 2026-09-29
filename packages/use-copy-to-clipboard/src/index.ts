import { useCallback, useEffect, useRef, useState } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export interface UseCopyToClipboardOptions {
  /** Delay in milliseconds before resetting `copied` state to false. @default 2000 */
  resetTimeout?: number;
}

export interface UseCopyToClipboardReturn {
  /** Copy text to the user clipboard. Returns true if successful. */
  copy: (text: string) => Promise<boolean>;
  /** Whether text was recently copied. */
  copied: boolean;
  /** Any error encountered during copy. */
  error: Error | null;
  /** Manually reset copied and error state. */
  reset: () => void;
}

function fallbackCopyText(text: string): boolean {
  if (!isBrowser) return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.setAttribute('readonly', '');
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    document.body.removeChild(textarea);
    return false;
  }
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const { resetTimeout = 2000 } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCopied(false);
    setError(null);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      reset();

      if (!isBrowser) {
        const err = new Error('Clipboard operations are not supported in server environment.');
        setError(err);
        return false;
      }

      let success = false;

      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(text);
          success = true;
        } else {
          success = fallbackCopyText(text);
          if (!success) {
            throw new Error('execCommand fallback failed to copy text.');
          }
        }

        setCopied(true);
        setError(null);

        if (resetTimeout > 0) {
          timerRef.current = setTimeout(() => {
            setCopied(false);
          }, resetTimeout);
        }

        return true;
      } catch (err) {
        const failureError =
          err instanceof Error ? err : new Error(String(err));
        setError(failureError);
        setCopied(false);
        return false;
      }
    },
    [resetTimeout, reset]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    copy,
    copied,
    error,
    reset
  };
}
