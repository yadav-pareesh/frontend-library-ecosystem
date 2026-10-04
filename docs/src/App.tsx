import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PACKAGES_DATA, PackageInfo } from './packagesData';
import { PlaygroundView } from './playground/PlaygroundView';
import { UnifiedSidebar } from './components/UnifiedSidebar';
import { CATEGORY_ORDER, getPackageIcon } from './constants/packageIcons';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
type ActiveTab = 'docs' | 'playground';

const THEME_STORAGE_KEY = 'pareeshy_theme';
const SCOPE = '@pareeshy/';

const getInitialTheme = (): 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // ignore
  }
  return 'light';
};

/** Parse URL hash into { tab, pkg }. Pure function with no side effects. */
const parseRoute = (): { tab: ActiveTab; pkg: string | null } => {
  const hash = window.location.hash;
  if (hash.startsWith('#playground')) {
    const slug = hash.replace(/^#playground\/?/, '');
    if (slug) {
      const name = decodeURIComponent(slug);
      const fullName = name.startsWith(SCOPE) ? name : `${SCOPE}${name}`;
      return { tab: 'playground', pkg: fullName };
    }
    return { tab: 'playground', pkg: null };
  }
  if (hash.startsWith('#')) {
    const rawSlug = hash.slice(1);
    const reserved = ['installation', 'overview', 'scenarios', 'api'];
    if (rawSlug && !reserved.includes(rawSlug)) {
      const name = decodeURIComponent(rawSlug);
      const fullName = name.startsWith(SCOPE) ? name : `${SCOPE}${name}`;
      if (PACKAGES_DATA.some((p) => p.name === fullName)) {
        return { tab: 'docs', pkg: fullName };
      }
    }
  }
  return { tab: 'docs', pkg: null };
};

const getInstallCommand = (pkgName: string, pm: PackageManager): string => {
  switch (pm) {
    case 'pnpm': return `pnpm add ${pkgName}`;
    case 'yarn': return `yarn add ${pkgName}`;
    case 'bun':  return `bun add ${pkgName}`;
    default:     return `npm install ${pkgName}`;
  }
};

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Flattened packages in sidebar category order — stable reference
  const sidebarOrderedPackages = useMemo<PackageInfo[]>(() => {
    return CATEGORY_ORDER.flatMap((cat) => PACKAGES_DATA.filter((p) => p.category === cat));
  }, []);

  // Parse route once on mount for initial state
  const initialRoute = useMemo(parseRoute, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialRoute.tab);
  const [selectedPkgName, setSelectedPkgName] = useState<string>(() => {
    if (initialRoute.pkg && PACKAGES_DATA.some((p) => p.name === initialRoute.pkg)) {
      return initialRoute.pkg;
    }
    return sidebarOrderedPackages[0]?.name ?? PACKAGES_DATA[0]!.name;
  });

  const currentSidebarIndex = useMemo(
    () => Math.max(0, sidebarOrderedPackages.findIndex((p) => p.name === selectedPkgName)),
    [sidebarOrderedPackages, selectedPkgName]
  );

  const activePackage = sidebarOrderedPackages[currentSidebarIndex] ?? PACKAGES_DATA[0]!;
  const prevPackage = currentSidebarIndex > 0 ? sidebarOrderedPackages[currentSidebarIndex - 1] : null;
  const nextPackage =
    currentSidebarIndex < sidebarOrderedPackages.length - 1
      ? sidebarOrderedPackages[currentSidebarIndex + 1]
      : null;

  const [pkgManager, setPkgManager] = useState<PackageManager>('npm');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Command Palette state
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const [cmdSelectedIndex, setCmdSelectedIndex] = useState(0);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const q = cmdSearch.trim().toLowerCase();
    if (!q) return sidebarOrderedPackages.slice(0, 8);
    return sidebarOrderedPackages
      .filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(q) ||
          pkg.purpose.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q) ||
          pkg.whenToUse?.some((w) => w.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [cmdSearch, sidebarOrderedPackages]);

  // Apply theme to document and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Global Cmd/Ctrl+K and Escape hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCmdOpen) {
        setIsCmdOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCmdOpen]);

  // Auto-focus command palette input on open
  useEffect(() => {
    if (isCmdOpen) {
      setCmdSearch('');
      setCmdSelectedIndex(0);
      setTimeout(() => cmdInputRef.current?.focus(), 50);
    }
  }, [isCmdOpen]);

  // Sync state on browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const { tab, pkg } = parseRoute();
      setActiveTab(tab);
      if (pkg && PACKAGES_DATA.some((p) => p.name === pkg)) {
        setSelectedPkgName(pkg);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToDocs = useCallback(
    (pkgName?: string) => {
      const target = pkgName ?? selectedPkgName;
      setActiveTab('docs');
      setSelectedPkgName(target);
      window.location.hash = target.replace(SCOPE, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedPkgName]
  );

  const navigateToPlayground = useCallback(
    (pkgName?: string) => {
      const target = pkgName ?? selectedPkgName;
      setActiveTab('playground');
      setSelectedPkgName(target);
      window.location.hash = `playground/${target.replace(SCOPE, '')}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedPkgName]
  );

  const selectPackageByName = useCallback(
    (pkgName: string) => {
      setSelectedPkgName(pkgName);
      setIsCmdOpen(false);
      setIsMobileSidebarOpen(false);
      if (activeTab === 'playground') {
        window.location.hash = `playground/${pkgName.replace(SCOPE, '')}`;
      } else {
        window.location.hash = pkgName.replace(SCOPE, '');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeTab]
  );

  const copyText = useCallback((text: string, type: 'install' | 'code') => {
    navigator.clipboard?.writeText(text);
    if (type === 'install') {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  }, []);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const installCmd = getInstallCommand(activePackage.name, pkgManager);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--stripe-bg)'
      }}
    >
      {/* Sticky Top Header */}
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
            maxWidth: 1680,
            width: '100%',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          {/* Left: Mobile toggle + Brand + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flexShrink: 1 }}>
            <button
              onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
              aria-label="Toggle Navigation Sidebar"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)',
                backgroundColor: 'var(--stripe-bg-subtle)',
                color: 'var(--text-head)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              className="mobile-sidebar-toggle-btn"
            >
              ☰
            </button>

            <div
              onClick={() => navigateToDocs()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
            >
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
                  fontSize: 14,
                  flexShrink: 0
                }}
              >
                P
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-head)',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
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
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap'
                }}
              >
                {activeTab === 'docs' ? 'DOCS' : 'PLAYGROUND'}
              </span>
            </div>

            <span style={{ color: 'var(--stripe-border)', userSelect: 'none' }}>/</span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>
                {activeTab === 'docs' ? activePackage.category : 'Playground'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span
                style={{
                  color: 'var(--text-head)',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 220,
                  display: 'inline-block'
                }}
                title={selectedPkgName}
              >
                {selectedPkgName.replace(SCOPE, '')}
              </span>
            </div>
          </div>

          {/* Center: View Switcher */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--stripe-bg-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--stripe-border)',
              gap: 2,
              flexShrink: 0
            }}
          >
            {([
              { key: 'docs', label: 'Docs', icon: '📘' },
              { key: 'playground', label: 'Playground', icon: '⚡' }
            ] as const).map(({ key, label, icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => (key === 'docs' ? navigateToDocs() : navigateToPlayground())}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--stripe-bg-surface)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Search + Theme + GitHub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => setIsCmdOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                backgroundColor: 'var(--stripe-bg-subtle)',
                border: '1px solid var(--stripe-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>🔍</span>
              <span className="search-label">Search...</span>
              <kbd
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--stripe-bg-surface)',
                  border: '1px solid var(--stripe-border)',
                  padding: '2px 5px',
                  borderRadius: 4,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              title="Toggle theme"
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
                gap: 5,
                whiteSpace: 'nowrap'
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
                padding: '4px 6px',
                whiteSpace: 'nowrap'
              }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div
        className="app-main-layout"
        style={{
          maxWidth: 1680,
          width: '100%',
          margin: '0 auto',
          flex: 1,
          minHeight: 'calc(100vh - 60px)',
          position: 'relative'
        }}
      >
        <UnifiedSidebar
          packages={sidebarOrderedPackages}
          selectedPackage={selectedPkgName}
          onSelectPackage={selectPackageByName}
          activeTab={activeTab}
          onTabChange={(tab) => (tab === 'docs' ? navigateToDocs() : navigateToPlayground())}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {activeTab === 'playground' ? (
            <PlaygroundView
              selectedPackage={selectedPkgName}
              onNavigateToDocs={navigateToDocs}
            />
          ) : (
            <div className="docs-columns-layout" style={{ alignItems: 'start', flex: 1 }}>
              {/* Documentation Content */}
              <main style={{ padding: '36px 40px', minHeight: '80vh' }}>
                {/* Package Header */}
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
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
                    {activePackage.name.replace(SCOPE, '')}
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
                    {[
                      `Bundle: ${activePackage.bundleSize}`,
                      activePackage.browserOnly ? 'Browser Only' : 'SSR Safe',
                      activePackage.dependencies === '0' ? '0 Dependencies' : activePackage.dependencies
                    ].map((label) => (
                      <span
                        key={label}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--stripe-bg-subtle)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--stripe-border)',
                          padding: '2px 8px',
                          borderRadius: 4
                        }}
                      >
                        {label}
                      </span>
                    ))}
                    <button
                      onClick={() => navigateToPlayground(activePackage.name)}
                      title={`Test ${activePackage.name} interactively`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '3px 10px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      ⚡ Try in Playground
                    </button>
                  </div>
                </div>

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

                {/* Installation */}
                <section id="installation" style={{ marginBottom: 32, scrollMarginTop: 88 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-head)',
                      marginBottom: 12
                    }}
                  >
                    Installation
                  </h3>
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
                    {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
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
                    <code style={{ color: '#38bdf8', fontSize: '0.875rem' }}>{installCmd}</code>
                    <button
                      onClick={() => copyText(installCmd, 'install')}
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

                {/* Why You Need This */}
                <section id="overview" style={{ marginBottom: 32, scrollMarginTop: 88 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-head)',
                      marginBottom: 12
                    }}
                  >
                    Why You Need This
                  </h3>
                  <div className="stripe-callout">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: '0.9rem' }}>💡</span>
                      <strong
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        The Problem Solved
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-head)', lineHeight: 1.6 }}>
                      {activePackage.description}
                    </p>
                  </div>
                </section>

                {/* Common Scenarios */}
                <section id="scenarios" style={{ marginBottom: 36, scrollMarginTop: 88 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-head)',
                      marginBottom: 12
                    }}
                  >
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
                        <span
                          style={{
                            color: 'var(--success)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            lineHeight: 1.4
                          }}
                        >
                          ✓
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.45 }}>
                          {scenario}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* API Reference */}
                <section id="api" style={{ marginBottom: 40, scrollMarginTop: 88 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-head)',
                      marginBottom: 12
                    }}
                  >
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
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
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

                {/* Prev / Next Navigation */}
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
                      ← Previous ({prevPackage.name.replace(SCOPE, '')})
                    </button>
                  ) : (
                    <div />
                  )}
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
                      Next ({nextPackage.name.replace(SCOPE, '')}) →
                    </button>
                  )}
                </div>
              </main>

              {/* Right: Code Panel + TOC */}
              <aside
                style={{
                  position: 'sticky',
                  top: 60,
                  padding: '24px 20px',
                  height: 'calc(100vh - 60px)',
                  overflowY: 'auto'
                }}
              >
                <div className="stripe-code-card">
                  {/* Terminal header */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {['#ef4444', '#f59e0b', '#10b981'].map((color) => (
                        <span
                          key={color}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: color,
                            display: 'inline-block'
                          }}
                        />
                      ))}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          marginLeft: 8,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        Example.tsx
                      </span>
                    </div>
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

                {/* On this page TOC */}
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
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: '0.8rem'
                    }}
                  >
                    {[
                      { id: 'installation', label: 'Installation' },
                      { id: 'overview', label: 'Why you need this' },
                      { id: 'scenarios', label: 'Common scenarios' },
                      { id: 'api', label: 'API Reference' }
                    ].map(({ id, label }) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={(e) => scrollToSection(e, id)}
                          style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* Command Palette (⌘K / Ctrl+K) */}
      {isCmdOpen && (
        <div className="cmd-palette-overlay" onClick={() => setIsCmdOpen(false)}>
          <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
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
                    setCmdSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCmdSelectedIndex((prev) => Math.max(prev - 1, 0));
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

            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px' }}>
              {searchResults.length === 0 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                  }}
                >
                  No packages matching &ldquo;{cmdSearch}&rdquo;
                </div>
              ) : (
                searchResults.map((pkg, i) => {
                  const isSelected = i === cmdSelectedIndex;
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
                        <span style={{ fontSize: '1.1rem' }}>{getPackageIcon(pkg.name)}</span>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              color: isSelected ? 'var(--primary)' : 'var(--text-head)'
                            }}
                          >
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
              <span>
                Navigation: <kbd>↑</kbd> <kbd>↓</kbd> to select
              </span>
              <span>
                Open: <kbd>↵</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
