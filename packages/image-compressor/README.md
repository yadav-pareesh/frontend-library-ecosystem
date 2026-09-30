# @pareeshy/image-compressor

High-performance client-side image compression library supporting JPEG, PNG, and WebP with dimension resizing and Blob/File output.

## Installation

```bash
npm install @pareeshy/image-compressor
# or
pnpm add @pareeshy/image-compressor
```

## Quick Start

```ts
import { compressImage } from '@pareeshy/image-compressor';

async function onImageSelected(file: File) {
  const compressed = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    mimeType: 'image/webp'
  });

  console.log(`Original: ${compressed.originalSize} B, Compressed: ${compressed.compressedSize} B`);
  // Upload compressed.file to backend...
}
```

## API

### `compressImage(source, options?): Promise<CompressedImageResult>`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `quality` | `number` | `0.8` | Compression quality between 0.0 and 1.0 |
| `maxWidth` | `number` | `undefined` | Maximum width constraint in pixels |
| `maxHeight` | `number` | `undefined` | Maximum height constraint in pixels |
| `mimeType` | `'image/jpeg' \| 'image/png' \| 'image/webp'` | original / `'image/jpeg'` | Target MIME output |
| `fileName` | `string` | input file name | Custom output file name |

### Return Result

| Property | Type | Description |
| --- | --- | --- |
| `file` | `File` | Compressed File instance ready for multipart upload |
| `blob` | `Blob` | Raw compressed Blob |
| `originalSize` | `number` | Size before compression in bytes |
| `compressedSize` | `number` | Size after compression in bytes |
| `compressionRatio` | `number` | Ratio of output size to input size |
| `width` | `number` | Final image width |
| `height` | `number` | Final image height |

## License

MIT
