# @pareesh

> A lightweight, modular collection of 32 production-grade frontend utilities, React hooks, and UI libraries designed for modern web applications.

Consumers install only the exact packages they need:

```bash
npm install @pareesh/use-debounced-value
# or
npm install @pareesh/auto-ellipsis
# or
npm install @pareesh/smart-search
```

---

## 📦 Package Matrix

| Package | Category | Purpose | Framework | Browser-Only? | Runtime Deps | Bundle Size | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [`@pareesh/use-debounced-value`](./packages/use-debounced-value) | React Hooks | Debounce values & callbacks with flush/cancel | React >=18 | No (SSR Safe) | 0 | 1.2 KB | Stable |
| [`@pareesh/use-local-storage-state`](./packages/use-local-storage-state) | State Management | Reactive localStorage with cross-tab sync | React >=18 | No (SSR Safe) | 0 | 1.4 KB | Stable |
| [`@pareesh/use-session-storage-state`](./packages/use-session-storage-state) | State Management | Reactive sessionStorage with error guards | React >=18 | No (SSR Safe) | 0 | 1.3 KB | Stable |
| [`@pareesh/use-network-status`](./packages/use-network-status) | Browser APIs | Detect online/offline, speed, and RTT | React >=18 | Yes | 0 | 0.9 KB | Stable |
| [`@pareesh/use-online-queue`](./packages/use-online-queue) | Performance | Offline-first persistent retry action queue | React >=18 | Yes | 0 | 1.8 KB | Stable |
| [`@pareesh/use-idle-detection`](./packages/use-idle-detection) | Browser APIs | Track user inactivity across all DOM events | React >=18 | Yes | 0 | 1.3 KB | Stable |
| [`@pareesh/use-page-visibility`](./packages/use-page-visibility) | Browser APIs | Reactive document visibility state | React >=18 | No (SSR Safe) | 0 | 0.6 KB | Stable |
| [`@pareesh/use-copy-to-clipboard`](./packages/use-copy-to-clipboard) | Browser APIs | Copy text to clipboard with fallback | React >=18 | Yes | 0 | 1.1 KB | Stable |
| [`@pareesh/use-media-query`](./packages/use-media-query) | React Hooks | SSR-safe reactive media queries | React >=18 | No (SSR Safe) | 0 | 0.8 KB | Stable |
| [`@pareesh/use-element-size`](./packages/use-element-size) | UI Utilities | ResizeObserver element measurement | React >=18 | Yes | 0 | 1.2 KB | Stable |
| [`@pareesh/use-optimistic-action`](./packages/use-optimistic-action) | State Management | Reusable optimistic UI with rollback | React >=18 | No (SSR Safe) | 0 | 1.4 KB | Stable |
| [`@pareesh/use-persisted-state`](./packages/use-persisted-state) | State Management | Persisted state with TTL & migrations | React >=18 | No (SSR Safe) | 0 | 1.6 KB | Stable |
| [`@pareesh/use-infinite-scroll`](./packages/use-infinite-scroll) | Performance | IntersectionObserver-based infinite scroll | React >=18 | Yes | 0 | 1.1 KB | Stable |
| [`@pareesh/use-previous-value`](./packages/use-previous-value) | React Hooks | Track previous values with custom equality | React >=18 | No (SSR Safe) | 0 | 0.4 KB | Stable |
| [`@pareesh/use-value-history`](./packages/use-value-history) | React Hooks | Historical audit log with capacity bounds | React >=18 | No (SSR Safe) | 0 | 0.9 KB | Stable |
| [`@pareesh/use-permission`](./packages/use-permission) | Browser APIs | Browser Permissions API abstraction | React >=18 | Yes | 0 | 1.0 KB | Stable |
| [`@pareesh/use-web-worker`](./packages/use-web-worker) | Performance | Typed Web Worker background execution | React >=18 | Yes | 0 | 1.5 KB | Stable |
| [`@pareesh/use-undo-redo`](./packages/use-undo-redo) | State Management | Undo/redo manager with zero extra clones | React >=18 | No (SSR Safe) | 0 | 1.3 KB | Stable |
| [`@pareesh/auto-ellipsis`](./packages/auto-ellipsis) | UI Utilities | Multi-line text truncation with ResizeObserver | React >=18 | Yes | 0 | 1.7 KB | Stable |
| [`@pareesh/smart-search`](./packages/smart-search) | Search & Data | Client-side fuzzy search with highlighting | Agnostic / React | No (SSR Safe) | 0 | 1.8 KB | Stable |
| [`@pareesh/file-validator`](./packages/file-validator) | Files & Images | MIME, magic bytes, dimensions validator | Agnostic | Yes | 0 | 2.2 KB | Stable |
| [`@pareesh/image-compressor`](./packages/image-compressor) | Files & Images | Client-side JPEG/PNG/WebP compressor | Agnostic | Yes | 0 | 1.9 KB | Stable |
| [`@pareesh/image-dimensions`](./packages/image-dimensions) | Files & Images | Safe image dimension & aspect extractor | Agnostic | Yes | 0 | 0.8 KB | Stable |
| [`@pareesh/browser-storage`](./packages/browser-storage) | State Management | Unified localStorage, session & IndexedDB | Agnostic | Yes | 0 | 2.1 KB | Stable |
| [`@pareesh/safe-json`](./packages/safe-json) | Developer Experience | Safe JSON parse/stringify with circular fix | Agnostic | No (SSR Safe) | 0 | 0.7 KB | Stable |
| [`@pareesh/url-state`](./packages/url-state) | State Management | React state sync with URL query params | React >=18 | No (SSR Safe) | 0 | 1.5 KB | Stable |
| [`@pareesh/form-dirty-state`](./packages/form-dirty-state) | UI Utilities | Form dirty state detection with diffing | React >=18 | No (SSR Safe) | 0 | 1.2 KB | Stable |
| [`@pareesh/scroll-lock`](./packages/scroll-lock) | UI Utilities | Scroll lock with scrollbar compensation | Agnostic / React | Yes | 0 | 1.0 KB | Stable |
| [`@pareesh/react-confirm-action`](./packages/react-confirm-action) | UI Utilities | Accessible Promise-based confirm dialog | React >=18 | No (SSR Safe) | 0 | 1.6 KB | Stable |
| [`@pareesh/react-shortcuts`](./packages/react-shortcuts) | Developer Experience | Keyboard shortcut manager with Mod key | React >=18 | Yes | 0 | 1.4 KB | Stable |
| [`@pareesh/react-error-boundary-lite`](./packages/react-error-boundary-lite) | Developer Experience | Lightweight Error Boundary with resetKeys | React >=18 | No (SSR Safe) | 0 | 1.1 KB | Stable |
| [`@pareesh/react-file-dropzone-lite`](./packages/react-file-dropzone-lite) | UI Utilities | Drag-and-drop file upload zone hook | React >=18 | Yes | 0 | 1.7 KB | Stable |

---

## 🛠️ Monorepo Architecture

```
/
├── packages/              # 32 independently publishable packages + internal-utils
│   ├── use-debounced-value/
│   ├── use-local-storage-state/
│   ├── auto-ellipsis/
│   └── ...
├── docs/                  # Interactive documentation website (React + Vite)
├── examples/              # Real-world usage playgrounds
├── .github/workflows/     # CI/CD pipelines
├── .changeset/            # Automated versioning and changelogs
├── pnpm-workspace.yaml    # Workspaces configuration
├── turbo.json             # Turborepo task orchestrator
└── package.json           # Monorepo scripts
```

### Key Engineering Principles

1. **Zero Unnecessary Dependencies**: Every package relies on native browser and React APIs.
2. **Dual ESM + CJS Output**: Emits both pristine modern ESM (`.js`) and CommonJS (`.cjs`) alongside TypeScript declarations (`.d.ts`).
3. **SSR Safety**: Safe guards prevent server hydration mismatches and window access exceptions.
4. **Accessibility (a11y)**: Built-in ARIA roles, focus management, and keyboard navigation.

---

## 🚀 Development Scripts

```bash
# Install dependencies across all packages
pnpm install

# Run comprehensive test suite across monorepo
pnpm test

# Typecheck all packages
pnpm typecheck

# Build all packages with tsup and turbo
pnpm build

# Run monorepo health validation
pnpm check

# Start interactive documentation website
pnpm dev:docs
```

---

## 📦 Versioning & Releases

Packages follow strict Semantic Versioning (`SemVer`). Releases and changelogs are managed via [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

---

## 📄 License

MIT © Pareesh
