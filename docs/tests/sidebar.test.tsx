import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnifiedSidebar } from '../src/components/UnifiedSidebar';
import { PACKAGES_DATA } from '../src/packagesData';

describe('UnifiedSidebar Component (Single Sidebar for Docs & Playground)', () => {
  it('renders correctly in docs mode and displays the DOCS indicator', () => {
    const onSelect = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="docs"
      />
    );

    expect(screen.getByText('DOCS')).toBeTruthy();
    expect(screen.getByText(/Ecosystem \(\d+\)/)).toBeTruthy();
    expect(screen.getByText('use-debounced-value')).toBeTruthy();
  });

  it('renders correctly in playground mode and displays the PLAYGROUND indicator', () => {
    const onSelect = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="playground"
      />
    );

    expect(screen.getByText('PLAYGROUND')).toBeTruthy();
    expect(screen.getByText('use-debounced-value')).toBeTruthy();
  });

  it('supports selecting packages and triggers onSelectPackage', () => {
    const onSelect = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="playground"
      />
    );

    const item = screen.getByText('use-local-storage-state');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith('@pareeshy/use-local-storage-state');
  });

  it('filters packages by category pills and resets cleanly', () => {
    const onSelect = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="docs"
      />
    );

    const devExpPill = screen.getByText('Developer Experience');
    fireEvent.click(devExpPill);

    expect(screen.getByText('safe-json')).toBeTruthy();
    expect(screen.getByText('internal-utils')).toBeTruthy();
    expect(screen.getByText('ai-mock-assistant')).toBeTruthy();

    // Reset back to All
    const allPill = screen.getByText('All');
    fireEvent.click(allPill);
    expect(screen.getByText('use-debounced-value')).toBeTruthy();
  });

  it('filters by search input and handles empty results with clear filter action', () => {
    const onSelect = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="docs"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search packages...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent-query-xyz' } });

    expect(screen.getByText('No packages matching "nonexistent-query-xyz"')).toBeTruthy();

    const clearBtn = screen.getByText('Clear filters');
    fireEvent.click(clearBtn);

    expect(screen.getByText('use-debounced-value')).toBeTruthy();
  });

  it('triggers onTabChange when mode switch button is clicked', () => {
    const onSelect = vi.fn();
    const onTabChange = vi.fn();
    render(
      <UnifiedSidebar
        packages={PACKAGES_DATA}
        selectedPackage="@pareeshy/use-debounced-value"
        onSelectPackage={onSelect}
        activeTab="docs"
        onTabChange={onTabChange}
      />
    );

    const switchBtn = screen.getByText('⚡ Switch to Playground');
    fireEvent.click(switchBtn);
    expect(onTabChange).toHaveBeenCalledWith('playground');
  });
});
