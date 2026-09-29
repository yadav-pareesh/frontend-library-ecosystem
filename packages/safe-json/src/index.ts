export type SafeParseResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: T; error: Error };

export type SafeStringifyResult =
  | { success: true; data: string; error?: never }
  | { success: false; data?: never; error: Error };

/**
 * Safely parses a JSON string without throwing runtime errors.
 */
export function safeParse<T = unknown>(
  raw: string,
  fallback?: T
): SafeParseResult<T> {
  if (typeof raw !== 'string') {
    return {
      success: false,
      data: fallback,
      error: new TypeError(`Expected JSON string, received ${typeof raw}`)
    };
  }

  try {
    const data = JSON.parse(raw) as T;
    return { success: true, data };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, data: fallback, error };
  }
}

/**
 * Parse JSON and return data or fallback directly.
 */
export function safeParseValue<T>(raw: string, fallback: T): T {
  const result = safeParse<T>(raw, fallback);
  return result.success ? result.data : fallback;
}

/**
 * Safely stringifies a JavaScript value without throwing runtime errors.
 */
export function safeStringify(
  value: unknown,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): SafeStringifyResult {
  try {
    const data = JSON.stringify(value, replacer, space);
    return { success: true, data };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, error };
  }
}

/**
 * Stringifies objects with circular references by replacing repeated references with "[Circular]".
 */
export function safeStringifyCircular(
  value: unknown,
  space?: string | number
): string {
  const seen = new WeakSet();

  return JSON.stringify(
    value,
    (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      return val;
    },
    space
  );
}
