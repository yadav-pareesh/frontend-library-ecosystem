import React from 'react';
import { PlaygroundDemo } from './types';
import { PACKAGES_DATA } from '../packagesData';
import { PACKAGE_ICONS, CATEGORY_ORDER } from '../constants/packageIcons';

// Demo components importing real workspace packages
import { AiAssistantDemo } from './demos/aiAssistantDemo';
import { UseDebouncedValueDemo } from './demos/useDebouncedValueDemo';
import { UseLocalStorageStateDemo } from './demos/useLocalStorageStateDemo';
import { UseSessionStorageStateDemo } from './demos/useSessionStorageStateDemo';
import { UseNetworkStatusDemo } from './demos/useNetworkStatusDemo';
import { UseOnlineQueueDemo } from './demos/useOnlineQueueDemo';
import { UseIdleDetectionDemo } from './demos/useIdleDetectionDemo';
import { UsePageVisibilityDemo } from './demos/usePageVisibilityDemo';
import { UseCopyToClipboardDemo } from './demos/useCopyToClipboardDemo';
import { UseMediaQueryDemo } from './demos/useMediaQueryDemo';
import { UseElementSizeDemo } from './demos/useElementSizeDemo';
import { UseOptimisticActionDemo } from './demos/useOptimisticActionDemo';
import { UsePersistedStateDemo } from './demos/usePersistedStateDemo';
import { UseInfiniteScrollDemo } from './demos/useInfiniteScrollDemo';
import { UsePreviousValueDemo } from './demos/usePreviousValueDemo';
import { UseValueHistoryDemo } from './demos/useValueHistoryDemo';
import { UsePermissionDemo } from './demos/usePermissionDemo';
import { UseWebWorkerDemo } from './demos/useWebWorkerDemo';
import { UseUndoRedoDemo } from './demos/useUndoRedoDemo';
import { AutoEllipsisDemo } from './demos/autoEllipsisDemo';
import { SmartSearchDemo } from './demos/smartSearchDemo';
import { FileValidatorDemo } from './demos/fileValidatorDemo';
import { ImageCompressorDemo } from './demos/imageCompressorDemo';
import { ImageDimensionsDemo } from './demos/imageDimensionsDemo';
import { BrowserStorageDemo } from './demos/browserStorageDemo';
import { SafeJsonDemo } from './demos/safeJsonDemo';
import { UrlStateDemo } from './demos/urlStateDemo';
import { FormDirtyStateDemo } from './demos/formDirtyStateDemo';
import { ScrollLockDemo } from './demos/scrollLockDemo';
import { ReactConfirmActionDemo } from './demos/reactConfirmActionDemo';
import { ReactShortcutsDemo } from './demos/reactShortcutsDemo';
import { ReactErrorBoundaryLiteDemo } from './demos/reactErrorBoundaryLiteDemo';
import { ReactFileDropzoneLiteDemo } from './demos/reactFileDropzoneLiteDemo';
import { InternalUtilsDemo } from './demos/internalUtilsDemo';

const DEMO_COMPONENTS: Record<string, React.ComponentType<any>> = {
  '@pareeshy/use-debounced-value': UseDebouncedValueDemo,
  '@pareeshy/use-local-storage-state': UseLocalStorageStateDemo,
  '@pareeshy/use-session-storage-state': UseSessionStorageStateDemo,
  '@pareeshy/use-network-status': UseNetworkStatusDemo,
  '@pareeshy/use-online-queue': UseOnlineQueueDemo,
  '@pareeshy/use-idle-detection': UseIdleDetectionDemo,
  '@pareeshy/use-page-visibility': UsePageVisibilityDemo,
  '@pareeshy/use-copy-to-clipboard': UseCopyToClipboardDemo,
  '@pareeshy/use-media-query': UseMediaQueryDemo,
  '@pareeshy/use-element-size': UseElementSizeDemo,
  '@pareeshy/use-optimistic-action': UseOptimisticActionDemo,
  '@pareeshy/use-persisted-state': UsePersistedStateDemo,
  '@pareeshy/use-infinite-scroll': UseInfiniteScrollDemo,
  '@pareeshy/use-previous-value': UsePreviousValueDemo,
  '@pareeshy/use-value-history': UseValueHistoryDemo,
  '@pareeshy/use-permission': UsePermissionDemo,
  '@pareeshy/use-web-worker': UseWebWorkerDemo,
  '@pareeshy/use-undo-redo': UseUndoRedoDemo,
  '@pareeshy/auto-ellipsis': AutoEllipsisDemo,
  '@pareeshy/smart-search': SmartSearchDemo,
  '@pareeshy/file-validator': FileValidatorDemo,
  '@pareeshy/image-compressor': ImageCompressorDemo,
  '@pareeshy/image-dimensions': ImageDimensionsDemo,
  '@pareeshy/browser-storage': BrowserStorageDemo,
  '@pareeshy/safe-json': SafeJsonDemo,
  '@pareeshy/url-state': UrlStateDemo,
  '@pareeshy/form-dirty-state': FormDirtyStateDemo,
  '@pareeshy/scroll-lock': ScrollLockDemo,
  '@pareeshy/react-confirm-action': ReactConfirmActionDemo,
  '@pareeshy/react-shortcuts': ReactShortcutsDemo,
  '@pareeshy/react-error-boundary-lite': ReactErrorBoundaryLiteDemo,
  '@pareeshy/react-file-dropzone-lite': ReactFileDropzoneLiteDemo,
  '@pareeshy/internal-utils': InternalUtilsDemo,
  '@pareeshy/ai-mock-assistant': AiAssistantDemo,
};

export const PLAYGROUND_CATEGORIES = ['All', ...CATEGORY_ORDER] as const;

// Build the complete typed registry deriving metadata from PACKAGES_DATA
export const PLAYGROUND_REGISTRY: PlaygroundDemo[] = PACKAGES_DATA.map((pkg) => {
  const Component = DEMO_COMPONENTS[pkg.name] || UseDebouncedValueDemo;
  return {
    packageName: pkg.name,
    title: pkg.name.replace('@pareeshy/', ''),
    description: pkg.purpose,
    category: pkg.category,
    icon: PACKAGE_ICONS[pkg.name] || '📦',
    component: Component,
    codeSnippet: pkg.exampleSnippet
  };
});
