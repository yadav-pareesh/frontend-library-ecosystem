import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getImageDimensions } from '../src';

describe('getImageDimensions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:mock-url')
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn()
    });

    class MockImage {
      naturalWidth = 1920;
      naturalHeight = 1080;
      onload: (() => void) | null = null;
      set src(_: string) {
        setTimeout(() => this.onload?.(), 10);
      }
    }
    Object.defineProperty(window, 'Image', {
      writable: true,
      value: MockImage
    });
  });

  it('calculates width, height, aspect ratio, and orientation for landscape', async () => {
    const file = new File(['fake-data'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await getImageDimensions(file);

    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
    expect(result.aspectRatio).toBeCloseTo(1.777, 2);
    expect(result.orientation).toBe('landscape');
  });
});
