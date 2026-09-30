import { isBrowser } from '@pareeshy/internal-utils';

export interface FileValidationError {
  file: File;
  code:
    | 'FILE_TOO_LARGE'
    | 'FILE_TOO_SMALL'
    | 'INVALID_MIME_TYPE'
    | 'INVALID_EXTENSION'
    | 'INVALID_MAGIC_BYTES'
    | 'IMAGE_TOO_WIDE'
    | 'IMAGE_TOO_NARROW'
    | 'IMAGE_TOO_TALL'
    | 'IMAGE_TOO_SHORT'
    | 'TOO_MANY_FILES'
    | 'TOO_FEW_FILES'
    | 'CUSTOM_ERROR';
  message: string;
}

export interface FileValidationOptions {
  minSize?: number;
  maxSize?: number;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
  minFiles?: number;
  maxFiles?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  checkMagicBytes?: boolean;
  customValidate?: (file: File) => Promise<string | null> | string | null;
}

export interface FileValidationResult {
  valid: boolean;
  errors: FileValidationError[];
  validFiles: File[];
  invalidFiles: { file: File; errors: string[] }[];
}

export async function detectMimeFromMagicBytes(file: File): Promise<string | null> {
  if (typeof file.slice !== 'function') return null;

  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return 'image/png';
    }

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return 'image/jpeg';
    }

    // GIF: 47 49 46 38
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    ) {
      return 'image/gif';
    }

    // PDF: 25 50 44 46 (%PDF)
    if (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    ) {
      return 'application/pdf';
    }

    // WEBP: RIFF....WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return 'image/webp';
    }

    return null;
  } catch {
    return null;
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!isBrowser || typeof URL === 'undefined' || typeof Image === 'undefined') {
      return resolve({ width: 0, height: 0 });
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image to calculate dimensions.'));
    };
    img.src = url;
  });
}

function matchMimePattern(mime: string, pattern: string): boolean {
  if (pattern === '*/*' || pattern === mime) return true;
  if (pattern.endsWith('/*')) {
    const base = pattern.slice(0, -2);
    return mime.startsWith(`${base}/`);
  }
  return false;
}

export async function validateFiles(
  files: File[] | FileList | File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const fileArray = Array.isArray(files)
    ? files
    : 'length' in files
      ? Array.from(files as FileList)
      : [files];

  const errors: FileValidationError[] = [];
  const validFiles: File[] = [];
  const invalidFilesMap = new Map<File, string[]>();

  const addError = (file: File, code: FileValidationError['code'], message: string) => {
    errors.push({ file, code, message });
    const existing = invalidFilesMap.get(file) || [];
    invalidFilesMap.set(file, [...existing, message]);
  };

  // Count validations
  if (options.minFiles !== undefined && fileArray.length < options.minFiles) {
    const dummy = fileArray[0] || new File([], 'files');
    addError(
      dummy,
      'TOO_FEW_FILES',
      `Expected at least ${options.minFiles} files, but received ${fileArray.length}.`
    );
  }

  if (options.maxFiles !== undefined && fileArray.length > options.maxFiles) {
    const dummy = fileArray[fileArray.length - 1] || new File([], 'files');
    addError(
      dummy,
      'TOO_MANY_FILES',
      `Exceeded maximum allowed files limit (${options.maxFiles}). Received ${fileArray.length}.`
    );
  }

  for (const file of fileArray) {
    let fileHasError = false;

    // File size check
    if (options.maxSize !== undefined && file.size > options.maxSize) {
      addError(
        file,
        'FILE_TOO_LARGE',
        `File "${file.name}" size (${file.size} bytes) exceeds limit of ${options.maxSize} bytes.`
      );
      fileHasError = true;
    }

    if (options.minSize !== undefined && file.size < options.minSize) {
      addError(
        file,
        'FILE_TOO_SMALL',
        `File "${file.name}" size (${file.size} bytes) is below minimum of ${options.minSize} bytes.`
      );
      fileHasError = true;
    }

    // Extension check
    if (options.allowedExtensions && options.allowedExtensions.length > 0) {
      const extMatch = file.name.match(/\.([0-9a-z]+)$/i);
      const ext = extMatch ? `.${extMatch[1]!.toLowerCase()}` : '';
      const allowed = options.allowedExtensions.map((e) =>
        e.startsWith('.') ? e.toLowerCase() : `.${e.toLowerCase()}`
      );
      if (!allowed.includes(ext)) {
        addError(
          file,
          'INVALID_EXTENSION',
          `Extension "${ext}" not permitted for "${file.name}". Allowed: ${allowed.join(', ')}.`
        );
        fileHasError = true;
      }
    }

    // MIME type check
    if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
      const isMimeAllowed = options.allowedMimeTypes.some((pattern) =>
        matchMimePattern(file.type, pattern)
      );
      if (!isMimeAllowed) {
        addError(
          file,
          'INVALID_MIME_TYPE',
          `MIME type "${file.type}" is not permitted for "${file.name}".`
        );
        fileHasError = true;
      }
    }

    // Magic bytes check
    if (options.checkMagicBytes) {
      const detected = await detectMimeFromMagicBytes(file);
      if (detected && file.type && detected !== file.type) {
        addError(
          file,
          'INVALID_MAGIC_BYTES',
          `Detected file signature (${detected}) does not match declared type (${file.type}).`
        );
        fileHasError = true;
      }
    }

    // Image dimension check
    const hasDimensionRequirements =
      options.minWidth !== undefined ||
      options.maxWidth !== undefined ||
      options.minHeight !== undefined ||
      options.maxHeight !== undefined;

    if (hasDimensionRequirements && file.type.startsWith('image/')) {
      try {
        const { width, height } = await getImageDimensions(file);
        if (options.maxWidth !== undefined && width > options.maxWidth) {
          addError(file, 'IMAGE_TOO_WIDE', `Image width (${width}px) exceeds max (${options.maxWidth}px).`);
          fileHasError = true;
        }
        if (options.minWidth !== undefined && width < options.minWidth) {
          addError(file, 'IMAGE_TOO_NARROW', `Image width (${width}px) is below min (${options.minWidth}px).`);
          fileHasError = true;
        }
        if (options.maxHeight !== undefined && height > options.maxHeight) {
          addError(file, 'IMAGE_TOO_TALL', `Image height (${height}px) exceeds max (${options.maxHeight}px).`);
          fileHasError = true;
        }
        if (options.minHeight !== undefined && height < options.minHeight) {
          addError(file, 'IMAGE_TOO_SHORT', `Image height (${height}px) is below min (${options.minHeight}px).`);
          fileHasError = true;
        }
      } catch {
        // Not a decodable image or running in SSR
      }
    }

    // Custom validation
    if (options.customValidate) {
      const customErr = await options.customValidate(file);
      if (customErr) {
        addError(file, 'CUSTOM_ERROR', customErr);
        fileHasError = true;
      }
    }

    if (!fileHasError) {
      validFiles.push(file);
    }
  }

  const invalidFiles = Array.from(invalidFilesMap.entries()).map(([file, errList]) => ({
    file,
    errors: errList
  }));

  return {
    valid: errors.length === 0,
    errors,
    validFiles,
    invalidFiles
  };
}
