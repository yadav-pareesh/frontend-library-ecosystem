import React, { useState } from 'react';
import { useFileDropzone } from '@pareeshy/react-file-dropzone-lite';
import { validateFiles } from '@pareeshy/file-validator';
import { compressImage } from '@pareeshy/image-compressor';
import { getImageDimensions } from '@pareeshy/image-dimensions';

export function FileToolsPlayground() {
  const [status, setStatus] = useState<string>('Select or drop image files...');

  const { getRootProps, getInputProps, isDragActive } = useFileDropzone({
    accept: 'image/*',
    onDrop: async (accepted) => {
      const file = accepted[0];
      if (!file) return;

      setStatus(`Validating ${file.name}...`);
      const validation = await validateFiles(file, {
        maxSize: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/*']
      });

      if (!validation.valid) {
        setStatus(`Validation failed: ${validation.errors.map((e) => e.message).join(', ')}`);
        return;
      }

      const dims = await getImageDimensions(file);
      setStatus(`Original dimensions: ${dims.width}x${dims.height}. Compressing...`);

      const compressed = await compressImage(file, {
        maxWidth: 1200,
        quality: 0.75
      });

      setStatus(
        `Done! Original: ${(file.size / 1024).toFixed(1)} KB -> Compressed: ${(compressed.compressedSize / 1024).toFixed(1)} KB (${(compressed.compressionRatio * 100).toFixed(0)}%)`
      );
    }
  });

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>File Tools & Image Compressor Playground</h2>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #999',
          padding: 30,
          borderRadius: 12,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#eff6ff' : '#fafafa',
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? 'Drop image here!' : 'Click or drop an image to validate and compress'}</p>
      </div>
      <p style={{ marginTop: 12, color: '#333' }}>{status}</p>
    </div>
  );
}
