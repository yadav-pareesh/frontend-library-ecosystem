import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { PackageInfo } from '../packagesData';
import { CATEGORY_ORDER, getPackageIcon } from '../constants/packageIcons';

export interface UnifiedSidebarProps {
  packages: PackageInfo[];
  selectedPackage: string;
  onSelectPackage: (pkgName: string) => void;
  activeTab?: 'docs' | 'playground';
  onTabChange?: (tab: 'docs' | 'playground') => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function UnifiedSidebar({
  packages,
  selectedPackage,
  onSelectPackage,
  activeTab = 'docs',
  onTabChange,
  isMobileOpen = false,
  onCloseMobile
}: UnifiedSidebarProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Category pills scroll management
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const updateCategoryScrollState = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    updateCategoryScrollState();

    // Map vertical mouse wheel (deltaY) directly to horizontal scroll
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        updateCategoryScrollState();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateCategoryScrollState());
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateCategoryScrollState]);

  const handleCategoryScroll = (direction: 'left' | 'right') => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -130 : 130;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateCategoryScrollState, 250);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX - el.offsetLeft;
    dragScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = categoryScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragStartXRef.current;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = dragScrollLeftRef.current - walk;
    updateCategoryScrollState();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Automatically scroll active package item into view inside the sidebar
  useEffect(() => {
    const el = document.getElementById('active-sidebar-item');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedPackage]);

  // Global '/' keyboard shortcut to focus sidebar search
  useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  // Filtered packages based on search query and category pill
  const filteredPackages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return packages.filter((pkg) => {
      const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
      const matchesSearch =
        !q ||
        pkg.name.toLowerCase().includes(q) ||
        pkg.purpose.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        (pkg.whenToUse && pkg.whenToUse.some((w) => w.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [packages, search, selectedCategory]);

  // Group packages by category (used when selectedCategory === 'All' and no search is active)
  const groupedPackages = useMemo(() => {
    const map = new Map<string, PackageInfo[]>();
    CATEGORY_ORDER.forEach((cat) => map.set(cat, []));

    packages.forEach((pkg) => {
      const list = map.get(pkg.category) || [];
      list.push(pkg);
      map.set(pkg.category, list);
    });

    return map;
  }, [packages]);

  const handleItemClick = (pkgName: string) => {
    onSelectPackage(pkgName);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const isGroupedView = selectedCategory === 'All' && !search.trim();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 37, 64, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          className="sidebar-mobile-backdrop"
        />
      )}

      {/* Main Persistent Sidebar */}
      <aside
        id="unified-app-sidebar"
        className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          borderRight: '1px solid var(--stripe-border)',
          backgroundColor: 'var(--stripe-sidebar-bg)',
          height: 'calc(100vh - 60px)',
          position: 'sticky',
          top: 60,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          zIndex: isMobileOpen ? 100 : 30,
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Top Control Section: Search & Category Pills */}
        <div
          style={{
            padding: '16px 14px 10px',
            borderBottom: '1px solid var(--stripe-border)',
            flexShrink: 0
          }}
        >
          {/* Header row: Title + Mode Indicator + Mobile Close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Ecosystem ({packages.length})
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '1px 6px',
                  borderRadius: 4
                }}
              >
                {activeTab === 'docs' ? 'DOCS' : 'PLAYGROUND'}
              </span>
            </div>

            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '2px 6px'
                }}
                title="Close sidebar"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Input */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            >
              🔍
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages..."
              style={{
                width: '100%',
                padding: '7px 28px 7px 30px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--stripe-border)',
                backgroundColor: 'var(--stripe-bg)',
                color: 'var(--text-head)',
                fontSize: '0.82rem',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearch('');
                  searchInputRef.current?.blur();
                }
              }}
            />
            {search ? (
              <button
                onClick={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: '2px 4px'
                }}
                title="Clear search (Esc)"
              >
                ✕
              </button>
            ) : (
              <kbd
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.65rem',
                  backgroundColor: 'var(--stripe-bg-subtle)',
                  border: '1px solid var(--stripe-border)',
                  padding: '1px 5px',
                  borderRadius: 3,
                  color: 'var(--text-muted)',
                  pointerEvents: 'none'
                }}
              >
                /
              </kbd>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ position: 'relative', marginTop: 2 }}>
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleCategoryScroll('left')}
                style={{
                  position: 'absolute',
                  left: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--stripe-bg-surface)',
                  border: '1px solid var(--stripe-border)',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--text-body)',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  padding: 0
                }}
                title="Scroll categories left"
                aria-label="Scroll categories left"
              >
                ‹
              </button>
            )}

            <div
              ref={categoryScrollRef}
              onScroll={updateCategoryScrollState}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="category-pills-scroll"
              style={{
                display: 'flex',
                gap: 4,
                overflowX: 'auto',
                paddingBottom: 4,
                userSelect: 'none',
                cursor: isDraggingRef.current ? 'grabbing' : 'grab'
              }}
            >
              {(['All', ...CATEGORY_ORDER] as string[]).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={(e) => {
                      if (hasDraggedRef.current) return;
                      setSelectedCategory(cat);
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                      });
                      setTimeout(updateCategoryScrollState, 200);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      whiteSpace: 'nowrap',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--stripe-border)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--stripe-bg)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      flexShrink: 0
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleCategoryScroll('right')}
                style={{
                  position: 'absolute',
                  right: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--stripe-bg-surface)',
                  border: '1px solid var(--stripe-border)',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--text-body)',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  padding: 0
                }}
                title="Scroll categories right"
                aria-label="Scroll categories right"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Package List Area */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '10px 10px 24px'
          }}
        >
          {isGroupedView ? (
            /* Grouped View (Categorized sections matching Stripe docs) */
            Array.from(groupedPackages.entries()).map(([category, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={category} style={{ marginBottom: 16 }}>
                  {/* Category Header */}
                  <div
                    style={{
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '5px 8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{category.toUpperCase()}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.7 }}>
                      {items.length}
                    </span>
                  </div>

                  {/* Category Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {items.map((pkg) => {
                      const isActive = pkg.name === selectedPackage;
                      const icon = getPackageIcon(pkg.name);
                      const displayName = pkg.name.replace('@pareeshy/', '');

                      return (
                        <div
                          key={pkg.name}
                          id={isActive ? 'active-sidebar-item' : undefined}
                          onClick={() => handleItemClick(pkg.name)}
                          className={`stripe-nav-item ${isActive ? 'active' : ''}`}
                          title={`${pkg.name} - ${pkg.purpose}`}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              overflow: 'hidden',
                              minWidth: 0
                            }}
                          >
                            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{icon}</span>
                            <span
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem'
                              }}
                            >
                              {displayName}
                            </span>
                          </div>

                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                              flexShrink: 0,
                              marginLeft: 6
                            }}
                          >
                            {pkg.bundleSize ? pkg.bundleSize.split(' ')[0] : 'lite'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            /* Flat Filtered Results View */
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  padding: '4px 8px 8px',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{selectedCategory !== 'All' ? selectedCategory : 'Results'}</span>
                <span>{filteredPackages.length}</span>
              </div>

              {filteredPackages.length === 0 ? (
                <div
                  style={{
                    padding: '32px 14px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem'
                  }}
                >
                  <p style={{ marginBottom: 12 }}>No packages matching "{search}"</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('All');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--stripe-border)',
                      padding: '4px 10px',
                      borderRadius: 4,
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredPackages.map((pkg) => {
                    const isActive = pkg.name === selectedPackage;
                    const icon = getPackageIcon(pkg.name);
                    const displayName = pkg.name.replace('@pareeshy/', '');

                    return (
                      <div
                        key={pkg.name}
                        id={isActive ? 'active-sidebar-item' : undefined}
                        onClick={() => handleItemClick(pkg.name)}
                        className={`stripe-nav-item ${isActive ? 'active' : ''}`}
                        title={`${pkg.name} - ${pkg.purpose}`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            overflow: 'hidden',
                            minWidth: 0
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{icon}</span>
                          <span
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              fontSize: '0.84rem'
                            }}
                          >
                            {displayName}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            flexShrink: 0,
                            marginLeft: 6
                          }}
                        >
                          {pkg.bundleSize
                            ? pkg.bundleSize.split(' ')[0]
                            : pkg.category.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Quick-Switch bar (optional footer) */}
        {onTabChange && (
          <div
            style={{
              borderTop: '1px solid var(--stripe-border)',
              padding: '10px 14px',
              backgroundColor: 'var(--stripe-bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              flexShrink: 0
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Current Mode:</span>
            <button
              onClick={() => onTabChange(activeTab === 'docs' ? 'playground' : 'docs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--stripe-bg-subtle)',
                border: '1px solid var(--stripe-border)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-head)',
                fontWeight: 600,
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              <span>{activeTab === 'docs' ? '⚡ Switch to Playground' : '📘 Switch to Docs'}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
