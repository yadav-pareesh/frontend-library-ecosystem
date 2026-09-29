# @pareesh/image-dimensions

Safe, lightweight image dimensions extractor for File, Blob, and image URL inputs in browsers with aspect ratio calculations.

## Installation

```bash
npm install @pareesh/image-dimensions
# or
pnpm add @pareesh/image-dimensions
```

## Quick Start

```ts
import { getImageDimensions } from '@pareesh/image-dimensions';

async function onFileSelected(file: File) {
  const { width, height, aspectRatio, orientation } = await getImageDimensions(file);

  console.log(`Resolution: ${width}x${height}`);
  console.log(`Aspect Ratio: ${aspectRatio.toFixed(2)}`);
  console.log(`Orientation: ${orientation}`); // 'landscape' | 'portrait' | 'square'
}
```

## API

### `getImageDimensions(source: File | Blob | string): Promise<ImageDimensions>`

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `width` | `number` | Natural pixel width |
| `height` | `number` | Natural pixel height |
| `aspectRatio` | `number` | `width / height` |
| `orientation` | `'landscape' \| 'portrait' \| 'square'` | Computed orientation category |

## License

MIT
