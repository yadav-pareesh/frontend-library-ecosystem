import { isBrowser } from '@pareeshy/internal-utils';

export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: ImageOrientation;
}

export function getImageDimensions(
  source: File | Blob | string
): Promise<ImageDimensions> {
  if (!isBrowser) {
    return Promise.reject(
      new Error('getImageDimensions is only supported in browser environments.')
    );
  }

  return new Promise((resolve, reject) => {
    const isUrl = typeof source === 'string';
    const objectUrl = isUrl ? source : URL.createObjectURL(source);

    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!isUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      if (width === 0 || height === 0) {
        reject(new Error('Image has zero dimensions or is corrupt.'));
        return;
      }

      const aspectRatio = width / height;
      let orientation: ImageOrientation = 'square';
      if (width > height) {
        orientation = 'landscape';
      } else if (height > width) {
        orientation = 'portrait';
      }

      resolve({
        width,
        height,
        aspectRatio,
        orientation
      });
    };

    img.onerror = () => {
      if (!isUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error('Failed to load image resource to calculate dimensions.'));
    };

    img.src = objectUrl;
  });
}
