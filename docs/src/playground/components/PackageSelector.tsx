import React, { useMemo } from 'react';
import { PlaygroundDemo } from '../types';
import { UnifiedSidebar } from '../../components/UnifiedSidebar';
import { PackageInfo, PACKAGES_DATA } from '../../packagesData';

export interface PackageSelectorProps {
  demos?: PlaygroundDemo[];
  selectedPackage: string;
  onSelectPackage: (pkgName: string) => void;
}

/**
 * PackageSelector adapts the unified left sidebar for testing & playground compatibility.
 */
export function PackageSelector({ demos, selectedPackage, onSelectPackage }: PackageSelectorProps) {
  const packagesList: PackageInfo[] = useMemo(() => {
    if (!demos || demos.length === 0) {
      return PACKAGES_DATA;
    }
    return demos.map((d) => {
      const match = PACKAGES_DATA.find((p) => p.name === d.packageName);
      if (match) return match;
      return {
        name: d.packageName,
        category: d.category as any,
        purpose: d.description,
        description: d.description,
        whenToUse: [],
        framework: 'React >=18',
        browserOnly: false,
        bundleSize: '1.0 KB',
        dependencies: '0',
        status: 'Stable' as const,
        exampleSnippet: d.codeSnippet,
        apiSummary: d.title
      };
    });
  }, [demos]);

  return (
    <UnifiedSidebar
      packages={packagesList}
      selectedPackage={selectedPackage}
      onSelectPackage={onSelectPackage}
      activeTab="playground"
    />
  );
}
