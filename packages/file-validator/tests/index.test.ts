import { describe, it, expect } from 'vitest';
import { validateFiles, detectMimeFromMagicBytes } from '../src';

describe('validateFiles', () => {
  it('validates file size within thresholds', async () => {
    const file = new File(['1234567890'], 'sample.txt', { type: 'text/plain' });

    const result = await validateFiles(file, {
      maxSize: 5
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe('FILE_TOO_LARGE');
    expect(result.invalidFiles).toHaveLength(1);
    expect(result.validFiles).toHaveLength(0);
  });

  it('validates allowed MIME types and extensions', async () => {
    const validFile = new File(['valid'], 'avatar.png', { type: 'image/png' });
    const invalidFile = new File(['script'], 'run.exe', { type: 'application/x-msdownload' });

    const result = await validateFiles([validFile, invalidFile], {
      allowedMimeTypes: ['image/*'],
      allowedExtensions: ['.png']
    });

    expect(result.valid).toBe(false);
    expect(result.validFiles).toHaveLength(1);
    expect(result.validFiles[0]?.name).toBe('avatar.png');
    expect(result.invalidFiles).toHaveLength(1);
    expect(result.invalidFiles[0]?.file.name).toBe('run.exe');
  });

  it('detects PNG magic bytes', async () => {
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const file = new File([pngHeader], 'test.png', { type: 'image/png' });

    const mime = await detectMimeFromMagicBytes(file);
    expect(mime).toBe('image/png');
  });
});
