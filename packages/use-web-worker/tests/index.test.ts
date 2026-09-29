import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWebWorker } from '../src';

describe('useWebWorker', () => {
  let mockWorkerInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockWorkerInstance = {
      postMessage: vi.fn((data: any) => {
        setTimeout(() => {
          mockWorkerInstance.onmessage?.({
            data: { success: true, result: data * 2 }
          });
        }, 10);
      }),
      terminate: vi.fn(),
      onmessage: null,
      onerror: null
    };

    class MockWorker {
      constructor() {
        return mockWorkerInstance;
      }
    }

    Object.defineProperty(window, 'Worker', {
      writable: true,
      value: MockWorker
    });

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:mock-url')
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn()
    });
  });

  it('posts message to worker and resolves typed response', async () => {
    const { result } = renderHook(() =>
      useWebWorker<number, number>((num) => num * 2)
    );

    let res: number = 0;
    await act(async () => {
      res = await result.current.post(21);
    });

    expect(res).toBe(42);
    expect(result.current.data).toBe(42);
    expect(result.current.loading).toBe(false);
  });

  it('terminates worker cleanly', () => {
    const { result } = renderHook(() =>
      useWebWorker<number, number>(() => 0)
    );

    act(() => {
      result.current.terminate();
    });

    expect(result.current.loading).toBe(false);
  });
});
