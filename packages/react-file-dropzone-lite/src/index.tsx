import React, { useCallback, useRef, useState } from 'react';

export interface FileRejection {
  file: File;
  reason: string;
}

export interface UseFileDropzoneOptions {
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  accept?: string;
  multiple?: boolean;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  noClick?: boolean;
  noKeyboard?: boolean;
}

export interface UseFileDropzoneReturn {
  getRootProps: (
    props?: React.HTMLAttributes<HTMLDivElement>
  ) => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: (
    props?: React.InputHTMLAttributes<HTMLInputElement>
  ) => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  open: () => void;
}

function matchesAccept(file: File, acceptStr?: string): boolean {
  if (!acceptStr) return true;
  const tokens = acceptStr.split(',').map((t) => t.trim().toLowerCase());

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  for (const token of tokens) {
    if (token.startsWith('.')) {
      if (fileName.endsWith(token)) return true;
    } else if (token.endsWith('/*')) {
      const base = token.slice(0, -2);
      if (mimeType.startsWith(`${base}/`)) return true;
    } else if (token === mimeType) {
      return true;
    }
  }
  return false;
}

export function useFileDropzone(options: UseFileDropzoneOptions): UseFileDropzoneReturn {
  const {
    onDrop,
    accept,
    multiple = true,
    minSize,
    maxSize,
    maxFiles,
    disabled = false,
    noClick = false,
    noKeyboard = false
  } = options;

  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = useCallback(
    (fileList: File[]) => {
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];

      let list = fileList;
      if (!multiple && list.length > 1) {
        list = [list[0]!];
      }

      if (maxFiles !== undefined && list.length > maxFiles) {
        rejected.push({
          file: list[list.length - 1]!,
          reason: `Exceeded maximum of ${maxFiles} files.`
        });
        list = list.slice(0, maxFiles);
      }

      for (const file of list) {
        if (!matchesAccept(file, accept)) {
          rejected.push({ file, reason: 'File type not accepted.' });
          continue;
        }

        if (maxSize !== undefined && file.size > maxSize) {
          rejected.push({ file, reason: `File size exceeds ${maxSize} bytes.` });
          continue;
        }

        if (minSize !== undefined && file.size < minSize) {
          rejected.push({ file, reason: `File size below minimum of ${minSize} bytes.` });
          continue;
        }

        accepted.push(file);
      }

      onDrop(accepted, rejected);
    },
    [accept, multiple, minSize, maxSize, maxFiles, onDrop]
  );

  const open = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      setIsDragActive(true);
      setIsDragAccept(true);
      setIsDragReject(false);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragAccept(false);
    setIsDragReject(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files || []);
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleClick = useCallback(
    (_e?: React.MouseEvent) => {
      if (disabled || noClick) return;
      open();
    },
    [disabled, noClick, open]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || noKeyboard) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
    [disabled, noKeyboard, open]
  );

  const getRootProps = useCallback(
    (props: React.HTMLAttributes<HTMLDivElement> = {}): React.HTMLAttributes<HTMLDivElement> => {
      return {
        ...props,
        role: 'button',
        tabIndex: disabled ? -1 : 0,
        'aria-disabled': disabled,
        onClick: (e) => {
          props.onClick?.(e);
          handleClick(e);
        },
        onKeyDown: (e) => {
          props.onKeyDown?.(e);
          handleKeyDown(e);
        },
        onDragOver: (e) => {
          props.onDragOver?.(e);
          handleDragOver(e);
        },
        onDragLeave: (e) => {
          props.onDragLeave?.(e);
          handleDragLeave(e);
        },
        onDrop: (e) => {
          props.onDrop?.(e);
          handleDrop(e);
        }
      };
    },
    [disabled, handleClick, handleKeyDown, handleDragOver, handleDragLeave, handleDrop]
  );

  const getInputProps = useCallback(
    (
      props: React.InputHTMLAttributes<HTMLInputElement> = {}
    ): React.InputHTMLAttributes<HTMLInputElement> & {
      ref: React.RefObject<HTMLInputElement | null>;
    } => {
      return {
        ...props,
        type: 'file',
        ref: inputRef,
        style: { display: 'none', ...(props.style || {}) },
        accept,
        multiple,
        disabled,
        onChange: (e) => {
          props.onChange?.(e);
          if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
            e.target.value = ''; // Reset input so same file can be re-selected
          }
        }
      };
    },
    [accept, multiple, disabled, processFiles]
  );

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open
  };
}
