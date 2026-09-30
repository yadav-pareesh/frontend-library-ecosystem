import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PACKAGES_DATA, PackageInfo } from './packagesData';

const CATEGORY_ORDER = [
  'React Hooks',
  'Browser APIs',
  'State Management',
  'Performance',
  'Search & Data',
  'Files & Images',
  'UI Utilities',
  'Developer Experience'
] as const;

const PACKAGE_ICONS: Record<string, string> = {
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
  '@pareeshy/react-file-dropzone-lite': '📥'
};

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Flattened list of packages matching the exact top-to-bottom order of the left sidebar
  const sidebarOrderedPackages = useMemo(() => {
    const list: PackageInfo[] = [];
    CATEGORY_ORDER.forEach(cat => {
      PACKAGES_DATA.filter(p => p.category === cat).forEach(p => {
        list.push(p);
      });
    });
    return list;
  }, []);

  const [selectedPkgName, setSelectedPkgName] = useState<string>(
    sidebarOrderedPackages[0]?.name ?? PACKAGES_DATA[0]!.name
  );

  const currentSidebarIndex = useMemo(() => {
    const idx = sidebarOrderedPackages.findIndex(p => p.name === selectedPkgName);
    return idx >= 0 ? idx : 0;
  }, [sidebarOrderedPackages, selectedPkgName]);

  const activePackage = sidebarOrderedPackages[currentSidebarIndex] ?? PACKAGES_DATA[0]!;

  const prevPackage = currentSidebarIndex > 0 ? sidebarOrderedPackages[currentSidebarIndex - 1] : null;
  const nextPackage = currentSidebarIndex < sidebarOrderedPackages.length - 1 ? sidebarOrderedPackages[currentSidebarIndex + 1] : null;

  const [pkgManager, setPkgManager] = useState<PackageManager>('npm');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Command Palette State
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [cmdSelectedIndex, setCmdSelectedIndex] = useState(0);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  // Group packages by category for the sidebar
  const groupedPackages = useMemo(() => {
    const map = new Map<string, PackageInfo[]>();
    CATEGORY_ORDER.forEach(cat => map.set(cat, []));

    sidebarOrderedPackages.forEach(pkg => {
      const list = map.get(pkg.category) || [];
      list.push(pkg);
      map.set(pkg.category, list);
    });

    return map;
  }, [sidebarOrderedPackages]);

  // Filtered packages for the Command Palette search
  const searchResults = useMemo(() => {
    const q = cmdSearch.trim().toLowerCase();
    if (!q) return sidebarOrderedPackages.slice(0, 8);

    return sidebarOrderedPackages
      .filter(pkg =>
        pkg.name.toLowerCase().includes(q) ||
        pkg.purpose.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.whenToUse.some(w => w.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [cmdSearch, sidebarOrderedPackages]);

  // Automatically scroll left sidebar to keep active item in view
  useEffect(() => {
    const el = document.getElementById('active-sidebar-item');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedPkgName]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global hotkeys (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      } else if (e.key === '/' && !isCmdOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsCmdOpen(true);
      } else if (e.key === 'Escape' && isCmdOpen) {
        setIsCmdOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdOpen]);

  // Auto-focus input when command palette opens
  useEffect(() => {
    if (isCmdOpen) {
      setCmdSearch('');
      setCmdSelectedIndex(0);
      setTimeout(() => cmdInputRef.current?.focus(), 50);
    }
  }, [isCmdOpen]);

  const getInstallCommand = (pkgName: string, pm: PackageManager) => {
    switch (pm) {
      case 'pnpm':
        return `pnpm add ${pkgName}`;
      case 'yarn':
        return `yarn add ${pkgName}`;
      case 'bun':
        return `bun add ${pkgName}`;
      case 'npm':
      default:
        return `npm install ${pkgName}`;
    }
  };

  const copyText = (text: string, type: 'install' | 'code') => {
    navigator.clipboard?.writeText(text);
    if (type === 'install') {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const selectPackageByName = (pkgName: string) => {
    setSelectedPkgName(pkgName);
    setIsCmdOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--stripe-bg)' }}>
      {/* 1. Stripe-Style Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--stripe-border)',
          backgroundColor: 'var(--stripe-bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 60,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo & Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 14
                }}
              >
                P
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-head)', letterSpacing: '-0.02em' }}>
                @pareeshy
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '2px 7px',
                  borderRadius: 4,
                  letterSpacing: '0.04em'
                }}
              >
                DOCS
              </span>
            </div>

            <span style={{ color: 'var(--stripe-border)' }}>/</span>

            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{activePackage.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-head)', fontWeight: 600 }}>{activePackage.name.replace('@pareeshy/', '')}</span>
            </div>
          </div>

          {/* Quick Search Button (Stripe ⌘K trigger) */}
          <div style={{ flex: '0 1 360px', margin: '0 20px' }}>
            <button
              onClick={() => setIsCmdOpen(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 12px',
                backgroundColor: 'var(--stripe-bg-subtle)',
                border: '1px solid var(--stripe-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔍</span>
                <span>Search 32 packages...</span>
              </div>
              <kbd
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--stripe-bg-surface)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Tools: Theme & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              title="Toggle theme for comfort"
              style={{
                background: 'transparent',
                border: '1px solid var(--stripe-border)',
                color: 'var(--text-body)',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            <a
              href="https://github.com/yadav-pareesh/frontend-library-ecosystem"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '4px 6px'
              }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main 3-Column Stripe Body */}
      <div
        style={{
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1fr) 460px',
          alignItems: 'start',
          flex: 1
        }}
      >
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT NAVIGATION SIDEBAR                         */}
        {/* ========================================================= */}
        <aside
          style={{
            borderRight: '1px solid var(--stripe-border)',
            backgroundColor: 'var(--stripe-sidebar-bg)',
            height: 'calc(100vh - 60px)',
            position: 'sticky',
            top: 60,
            overflowY: 'auto',
            padding: '20px 14px'
          }}
        >
          <div style={{ marginBottom: 16, padding: '0 8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              Utility Ecosystem (32)
            </span>
          </div>

          {Array.from(groupedPackages.entries()).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 18 }}>
              {/* Category Header */}
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '6px 8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{category}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.7 }}>{items.length}</span>
              </div>

              {/* Package Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((pkg) => {
                  const isActive = pkg.name === selectedPkgName;
                  const icon = PACKAGE_ICONS[pkg.name] || '📦';

                  return (
                    <div
                      key={pkg.name}
                      id={isActive ? 'active-sidebar-item' : undefined}
                      onClick={() => selectPackageByName(pkg.name)}
                      className={`stripe-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {pkg.name.replace('@pareeshy/', '')}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {pkg.bundleSize.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER DOCUMENTATION NARRATIVE                 */}
        {/* ========================================================= */}
        <main style={{ padding: '36px 40px', minHeight: '80vh' }}>
          {/* Header Title & Badges */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              @pareeshy /
            </span>
            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--text-head)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginTop: 2,
                marginBottom: 14
              }}
            >
              {activePackage.name.replace('@pareeshy/', '')}
            </h1>

            {/* Metadata Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  border: '1px solid var(--success-border)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}
              >
                ✓ {activePackage.status}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary-border)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}
              >
                {activePackage.category}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--stripe-bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}
              >
                Bundle: {activePackage.bundleSize}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--stripe-bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}
              >
                {activePackage.browserOnly ? 'Browser Only' : 'SSR Safe'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--stripe-bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}
              >
                0 Dependencies
              </span>
            </div>
          </div>

          {/* Subheading Purpose */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-body)',
              lineHeight: 1.6,
              marginBottom: 28,
              fontWeight: 400
            }}
          >
            {activePackage.purpose}
          </p>

          {/* Section: Installation */}
          <section id="installation" style={{ marginBottom: 32, scrollMarginTop: 88 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-head)', marginBottom: 12 }}>
              Installation
            </h3>

            {/* Package Manager Tabs */}
            <div
              style={{
                backgroundColor: 'var(--code-header)',
                border: '1px solid var(--code-border)',
                borderTopLeftRadius: 'var(--radius-md)',
                borderTopRightRadius: 'var(--radius-md)',
                padding: '6px 12px',
                display: 'flex',
                gap: 6
              }}
            >
              {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map(pm => (
                <button
                  key={pm}
                  onClick={() => setPkgManager(pm)}
                  style={{
                    background: pkgManager === pm ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    color: pkgManager === pm ? '#fff' : 'var(--code-comment)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Install Command Line */}
            <div
              style={{
                backgroundColor: 'var(--code-bg)',
                border: '1px solid var(--code-border)',
                borderTop: 'none',
                borderBottomLeftRadius: 'var(--radius-md)',
                borderBottomRightRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <code style={{ color: '#38bdf8', fontSize: '0.875rem' }}>
                {getInstallCommand(activePackage.name, pkgManager)}
              </code>
              <button
                onClick={() => copyText(getInstallCommand(activePackage.name, pkgManager), 'install')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: copiedInstall ? 'var(--success)' : '#e2e8f0',
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {copiedInstall ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </section>

          {/* Section: Why you need this (Stripe Callout) */}
          <section id="overview" style={{ marginBottom: 32, scrollMarginTop: 88 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-head)', marginBottom: 12 }}>
              Why You Need This
            </h3>
            <div className="stripe-callout">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: '0.9rem' }}>💡</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  The Problem Solved
                </strong>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-head)', lineHeight: 1.6 }}>
                {activePackage.description}
              </p>
            </div>
          </section>

          {/* Section: Common Real-World Scenarios */}
          <section id="scenarios" style={{ marginBottom: 36, scrollMarginTop: 88 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-head)', marginBottom: 12 }}>
              Common Real-World Scenarios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activePackage.whenToUse.map((scenario, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    backgroundColor: 'var(--stripe-bg-subtle)',
                    border: '1px solid var(--stripe-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px'
                  }}
                >
                  <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.4 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.45 }}>{scenario}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: API Reference Summary */}
          <section id="api" style={{ marginBottom: 40, scrollMarginTop: 88 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-head)', marginBottom: 12 }}>
              API Reference
            </h3>
            <div
              style={{
                backgroundColor: 'var(--stripe-bg-subtle)',
                border: '1px solid var(--stripe-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Function Signature
              </span>
              <pre
                style={{
                  backgroundColor: 'var(--code-bg)',
                  border: '1px solid var(--code-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  color: '#93c5fd',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  marginTop: 8,
                  lineHeight: 1.5
                }}
              >
                {activePackage.apiSummary}
              </pre>
            </div>
          </section>

          {/* Bottom Pagination: Next & Prev Package aligned with sidebar order */}
          <div
            style={{
              borderTop: '1px solid var(--stripe-border)',
              paddingTop: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {prevPackage ? (
              <button
                onClick={() => selectPackageByName(prevPackage.name)}
                style={{
                  background: 'none',
                  border: '1px solid var(--stripe-border)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-body)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                ← Previous ({prevPackage.name.replace('@pareeshy/', '')})
              </button>
            ) : <div />}

            {nextPackage && (
              <button
                onClick={() => selectPackageByName(nextPackage.name)}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(99, 91, 255, 0.25)'
                }}
              >
                Next ({nextPackage.name.replace('@pareeshy/', '')}) →
              </button>
            )}
          </div>
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT STICKY CODE CANVAS (Stripe Dual Pane)     */}
        {/* ========================================================= */}
        <aside
          style={{
            position: 'sticky',
            top: 60,
            padding: '24px 20px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto'
          }}
        >
          {/* Stripe-Style Dark Terminal Card */}
          <div className="stripe-code-card">
            {/* Terminal Window Header */}
            <div
              style={{
                backgroundColor: 'var(--code-header)',
                borderBottom: '1px solid var(--code-border)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Window dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>
                  Example.tsx
                </span>
              </div>

              {/* Copy Code Button */}
              <button
                onClick={() => copyText(activePackage.exampleSnippet, 'code')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: copiedCode ? 'var(--success)' : '#cbd5e1',
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {copiedCode ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Code Body */}
            <pre
              style={{
                padding: '16px',
                margin: 0,
                fontSize: '0.8rem',
                lineHeight: 1.6,
                color: 'var(--code-text)',
                overflowX: 'auto',
                whiteSpace: 'pre',
                maxHeight: 'calc(100vh - 280px)'
              }}
            >
              {activePackage.exampleSnippet}
            </pre>
          </div>

          {/* "On this page" TOC Navigation */}
          <div style={{ marginTop: 24, padding: '0 8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: 8
              }}
            >
              On this page
            </span>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
              <li>
                <a
                  href="#installation"
                  onClick={(e) => scrollToSection(e, 'installation')}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Installation
                </a>
              </li>
              <li>
                <a
                  href="#overview"
                  onClick={(e) => scrollToSection(e, 'overview')}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Why you need this
                </a>
              </li>
              <li>
                <a
                  href="#scenarios"
                  onClick={(e) => scrollToSection(e, 'scenarios')}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Common scenarios
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  onClick={(e) => scrollToSection(e, 'api')}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* 3. Command Palette Modal (⌘K / Ctrl+K) */}
      {isCmdOpen && (
        <div className="cmd-palette-overlay" onClick={() => setIsCmdOpen(false)}>
          <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
            {/* Input Header */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--stripe-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>🔍</span>
              <input
                ref={cmdInputRef}
                type="text"
                placeholder="Search packages, features, or problems..."
                value={cmdSearch}
                onChange={(e) => {
                  setCmdSearch(e.target.value);
                  setCmdSelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCmdSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCmdSelectedIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter' && searchResults[cmdSelectedIndex]) {
                    e.preventDefault();
                    selectPackageByName(searchResults[cmdSelectedIndex]!.name);
                  }
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.95rem',
                  color: 'var(--text-head)',
                  outline: 'none'
                }}
              />
              <kbd
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--stripe-bg-subtle)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  color: 'var(--text-muted)'
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px' }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No packages matching "{cmdSearch}"
                </div>
              ) : (
                searchResults.map((pkg, i) => {
                  const isSelected = i === cmdSelectedIndex;
                  const icon = PACKAGE_ICONS[pkg.name] || '📦';

                  return (
                    <div
                      key={pkg.name}
                      onClick={() => selectPackageByName(pkg.name)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.1s ease'
                      }}
                      onMouseEnter={() => setCmdSelectedIndex(i)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? 'var(--primary)' : 'var(--text-head)' }}>
                            {pkg.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                            {pkg.purpose}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: 4,
                          backgroundColor: 'var(--stripe-bg-subtle)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {pkg.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div
              style={{
                borderTop: '1px solid var(--stripe-border)',
                padding: '8px 16px',
                backgroundColor: 'var(--stripe-bg-subtle)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd> to select</span>
              <span>Open: <kbd>↵</kbd></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
