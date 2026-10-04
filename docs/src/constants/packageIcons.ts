export const CATEGORY_ORDER = [
  'React Hooks',
  'Browser APIs',
  'State Management',
  'Performance',
  'Search & Data',
  'Files & Images',
  'UI Utilities',
  'Developer Experience'
] as const;

export type PackageCategory = (typeof CATEGORY_ORDER)[number];

export const PACKAGE_ICONS: Record<string, string> = {
  '@pareeshy/use-debounced-value': '⏱️',
  '@pareeshy/use-local-storage-state': '💾',
  '@pareeshy/use-session-storage-state': '🗂️',
  '@pareeshy/use-network-status': '📶',
  '@pareeshy/use-online-queue': '🔄',
  '@pareeshy/use-idle-detection': '💤',
  '@pareeshy/use-page-visibility': '👁️',
  '@pareeshy/use-copy-to-clipboard': '📋',
  '@pareeshy/use-media-query': '📱',
  '@pareeshy/use-element-size': '📐',
  '@pareeshy/use-optimistic-action': '⚡',
  '@pareeshy/use-persisted-state': '🗄️',
  '@pareeshy/use-infinite-scroll': '📜',
  '@pareeshy/use-previous-value': '⏪',
  '@pareeshy/use-value-history': '📊',
  '@pareeshy/use-permission': '🛡️',
  '@pareeshy/use-web-worker': '⚙️',
  '@pareeshy/use-undo-redo': '↩️',
  '@pareeshy/auto-ellipsis': '✂️',
  '@pareeshy/smart-search': '🔍',
  '@pareeshy/file-validator': '📁',
  '@pareeshy/image-compressor': '🗜️',
  '@pareeshy/image-dimensions': '🖼️',
  '@pareeshy/browser-storage': '🗃️',
  '@pareeshy/safe-json': '🔒',
  '@pareeshy/url-state': '🔗',
  '@pareeshy/form-dirty-state': '📝',
  '@pareeshy/scroll-lock': '🔒',
  '@pareeshy/react-confirm-action': '❓',
  '@pareeshy/react-shortcuts': '⌨️',
  '@pareeshy/react-error-boundary-lite': '🛡️',
  '@pareeshy/react-file-dropzone-lite': '📥',
  '@pareeshy/internal-utils': '🛠️',
  '@pareeshy/ai-mock-assistant': '🤖'
};

export function getPackageIcon(pkgName: string): string {
  return PACKAGE_ICONS[pkgName] || '📦';
}
