import { describe, it, expect, beforeEach } from 'vitest';
import { createBrowserStorage, createMemoryStorageAdapter } from '../src';

describe('browser-storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('memory adapter supports full CRUD operations', async () => {
    const memory = createMemoryStorageAdapter<string>();

    expect(await memory.get('key1')).toBeNull();

    await memory.set('key1', 'val1');
    expect(await memory.get('key1')).toBe('val1');

    expect(await memory.keys()).toEqual(['key1']);

    await memory.remove('key1');
    expect(await memory.get('key1')).toBeNull();
  });

  it('local storage adapter prefixes keys and serializes objects', async () => {
    const storage = createBrowserStorage<{ count: number }>('local', {
      prefix: 'myapp:'
    });

    await storage.set('counter', { count: 42 });

    expect(await storage.get('counter')).toEqual({ count: 42 });
    expect(window.localStorage.getItem('myapp:counter')).toBe(JSON.stringify({ count: 42 }));

    const keys = await storage.keys();
    expect(keys).toContain('counter');

    await storage.clear();
    expect(await storage.get('counter')).toBeNull();
  });
});
