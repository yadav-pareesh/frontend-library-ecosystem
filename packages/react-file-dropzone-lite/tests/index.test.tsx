import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFileDropzone } from '../src';

function DropzoneTest({ onDrop }: { onDrop: any }) {
  const { getRootProps, getInputProps, isDragActive } = useFileDropzone({
    onDrop,
    accept: 'image/*'
  });

  return (
    <div {...getRootProps()} data-testid="dropzone">
      <input {...getInputProps()} data-testid="file-input" />
      <p>{isDragActive ? 'Drop files here' : 'Drag & drop or click'}</p>
    </div>
  );
}

describe('react-file-dropzone-lite', () => {
  it('renders dropzone and handles dropped files', () => {
    const onDrop = vi.fn();
    render(<DropzoneTest onDrop={onDrop} />);

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toBeDefined();

    const file = new File(['image-bytes'], 'avatar.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file]
      }
    });

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop).toHaveBeenCalledWith([file], []);
  });

  it('rejects files not matching accept pattern', () => {
    const onDrop = vi.fn();
    render(<DropzoneTest onDrop={onDrop} />);

    const dropzone = screen.getByTestId('dropzone');
    const rejectedFile = new File(['text'], 'notes.txt', { type: 'text/plain' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [rejectedFile]
      }
    });

    expect(onDrop).toHaveBeenCalledTimes(1);
    const [accepted, rejected] = onDrop.mock.calls[0]!;
    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toContain('File type not accepted');
  });
});
