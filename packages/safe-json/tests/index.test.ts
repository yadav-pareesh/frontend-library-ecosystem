import { describe, it, expect } from 'vitest';
import { safeParse, safeParseValue, safeStringify, safeStringifyCircular } from '../src';

describe('safe-json', () => {
  it('safely parses valid and invalid JSON strings', () => {
    const valid = safeParse<{ ok: boolean }>('{"ok":true}');
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.ok).toBe(true);
    }

    const invalid = safeParse('invalid json {', { fallback: true });
    expect(invalid.success).toBe(false);
    expect(invalid.data).toEqual({ fallback: true });
    expect(invalid.error).toBeInstanceOf(Error);
  });

  it('safeParseValue returns fallback on error', () => {
    expect(safeParseValue('bad', [1, 2, 3])).toEqual([1, 2, 3]);
    expect(safeParseValue('[10, 20]', [1, 2, 3])).toEqual([10, 20]);
  });

  it('safeStringifyCircular prevents circular reference exceptions', () => {
    const obj: any = { name: 'Root' };
    obj.self = obj;

    expect(() => JSON.stringify(obj)).toThrow();

    const result = safeStringifyCircular(obj);
    expect(result).toContain('"name":"Root"');
    expect(result).toContain('"self":"[Circular]"');
  });
});
