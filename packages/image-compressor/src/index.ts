import { isBrowser } from '@pareesh/internal-utils';

export type OutputMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface CompressImageOptions {
  /** Compression quality between 0.0 and 1.0. Applicable to JPEG and WebP. @default 0.8 */
  quality?: number;
  /** Maximum output width in pixels. Preserves aspect ratio. */
  maxWidth?: number;
  /** Maximum output height in pixels. Preserves aspect ratio. */
  maxHeight?: number;
  /** Output MIME format. Defaults to original format or 'image/jpeg'. */
  mimeType?: OutputMimeType;
  /** Custom file name when returning a File instance. */
  fileName?: string;
}

export interface CompressedImageResult {
  file: File;
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

function calculateDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let width = srcWidth;
  let height = srcHeight;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

export async function compressImage(
  source: File | Blob,
  options: CompressImageOptions = {}
): Promise<CompressedImageResult> {
  if (!isBrowser) {
    throw new Error('compressImage is only supported in browser environments.');
  }

  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    mimeType = (source.type === 'image/png' || source.type === 'image/webp'
      ? source.type
      : 'image/jpeg') as OutputMimeType,
    fileName = source instanceof File ? source.name : 'compressed-image.jpg'
  } = options;

  const objectUrl = URL.createObjectURL(source);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image for compression.'));
      image.src = objectUrl;
    });

    const { width, height } = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      maxWidth,
      maxHeight
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not available.');
    }

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Canvas toBlob compression failed.'));
          }
        },
        mimeType,
        quality
      );
    });

    // Cleanup canvas to free memory immediately
    canvas.width = 0;
    canvas.height = 0;

    const file = new File([blob], fileName, { type: mimeType, lastModified: Date.now() });
    const originalSize = source.size;
    const compressedSize = blob.size;
    const compressionRatio = originalSize > 0 ? (compressedSize / originalSize) : 1;

    return {
      file,
      blob,
      originalSize,
      compressedSize,
      compressionRatio,
      width,
      height
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
