# @pareeshy/react-file-dropzone-lite

Lightweight, headless drag-and-drop file upload zone hook and component for React with full keyboard navigation and validation support.

## Installation

```bash
npm install @pareeshy/react-file-dropzone-lite
# or
pnpm add @pareeshy/react-file-dropzone-lite
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { useFileDropzone } from '@pareeshy/react-file-dropzone-lite';

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useFileDropzone({
    accept: 'image/*,.pdf',
    maxSize: 10 * 1024 * 1024,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        alert(`Rejected: ${rejected.map((r) => r.reason).join(', ')}`);
      }
      setFiles((prev) => [...prev, ...accepted]);
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #9ca3af',
        borderRadius: 8,
        padding: 32,
        textAlign: 'center',
        background: isDragActive ? '#f0fdf4' : '#fafafa',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Drop your files here...' : 'Click or drag files here to upload'}</p>
      <ul>
        {files.map((file) => (
          <li key={file.name}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### `useFileDropzone(options): UseFileDropzoneReturn`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `onDrop` | `(accepted: File[], rejected: FileRejection[]) => void` | **required** | File drop/selection handler |
| `accept` | `string` | `undefined` | Filter MIME types or extensions (`'image/*,.pdf'`) |
| `multiple` | `boolean` | `true` | Allow multiple file selections |
| `maxSize` | `number` | `undefined` | Max file size in bytes |
| `minSize` | `number` | `undefined` | Min file size in bytes |
| `maxFiles` | `number` | `undefined` | Max allowed files |
| `disabled` | `boolean` | `false` | Disable dropzone |
| `noClick` | `boolean` | `false` | Disable click to open file dialog |
| `noKeyboard` | `boolean` | `false` | Disable keyboard Enter/Space trigger |

### Return Object

| Property | Type | Description |
| --- | --- | --- |
| `getRootProps` | `(props?) => HTMLAttributes` | Attaches drag events, accessibility roles |
| `getInputProps` | `(props?) => InputHTMLAttributes` | Attaches hidden file input props |
| `isDragActive` | `boolean` | True when files are hovered over dropzone |
| `open()` | `() => void` | Imperatively opens file dialog |

## License

MIT
