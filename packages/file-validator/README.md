# @pareeshy/file-validator

Comprehensive client-side file validation library supporting MIME types, magic bytes inspection, size limits, image dimensions, and detailed error reports.

## Installation

```bash
npm install @pareeshy/file-validator
# or
pnpm add @pareeshy/file-validator
```

## Quick Start

```ts
import { validateFiles } from '@pareeshy/file-validator';

async function handleUpload(files: FileList) {
  const result = await validateFiles(files, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxWidth: 3840,
    maxHeight: 2160,
    checkMagicBytes: true
  });

  if (!result.valid) {
    console.error('Validation failed:', result.errors);
    return;
  }

  console.log('Ready to upload:', result.validFiles);
}
```

## API

### `validateFiles(files, options?): Promise<FileValidationResult>`

### Options

| Option | Type | Description |
| --- | --- | --- |
| `minSize` | `number` | Minimum file size in bytes |
| `maxSize` | `number` | Maximum file size in bytes |
| `allowedExtensions` | `string[]` | Permitted extensions, e.g. `['.pdf', '.png']` |
| `allowedMimeTypes` | `string[]` | Permitted MIME patterns, e.g. `['image/*']` |
| `minFiles` / `maxFiles` | `number` | File count boundaries |
| `minWidth` / `maxWidth` | `number` | Image width boundaries |
| `minHeight` / `maxHeight` | `number` | Image height boundaries |
| `checkMagicBytes` | `boolean` | Verifies actual binary header bytes |
| `customValidate` | `(file: File) => Promise<string \| null>` | Custom validation rule |

## License

MIT
