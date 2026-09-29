import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compressImage } from '../src';

describe('compressImage', () => {
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

    // Mock Image
    class MockImage {
      naturalWidth = 2000;
      naturalHeight = 1000;
      onload: (() => void) | null = null;
      set src(_: string) {
        setTimeout(() => this.onload?.(), 10);
      }
    }
    Object.defineProperty(window, 'Image', {
      writable: true,
      value: MockImage
    });

    // Mock HTMLCanvasElement
    const mockCtx = {
      drawImage: vi.fn()
    };

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
    HTMLCanvasElement.prototype.toBlob = vi.fn(function (
      this: HTMLCanvasElement,
      cb: (b: Blob) => void,
      type = 'image/jpeg'
    ) {
      cb(new Blob(['mock-compressed-data'], { type }));
    });
  });

  it('resizes dimensions according to maxWidth and preserves aspect ratio', async () => {
    const originalFile = new File(['fake-image-bytes-very-long'], 'photo.jpg', {
      type: 'image/jpeg'
    });

    const result = await compressImage(originalFile, {
      maxWidth: 1000,
      quality: 0.7
    });

    expect(result.width).toBe(1000);
    expect(result.height).toBe(500); // 2000x1000 scaled down to 1000x500
    expect(result.file).toBeInstanceOf(File);
  });
});
