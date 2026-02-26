// 🔧 UPDATED: src/hooks/useMinimumLoading.ts
// Optimized for fast user experience

import { useState, useEffect } from 'react';

export function useMinimumLoading(minimumMs: number = 100) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowContent, setShouldShowContent] = useState(false);

  useEffect(() => {
    // Always show loading for at least the minimum duration
    const timer = setTimeout(() => {
      setShouldShowContent(true);
      setIsLoading(false);
    }, minimumMs);

    return () => clearTimeout(timer);
  }, [minimumMs]);

  return {
    isLoading,
    shouldShowContent,
    // For compatibility with existing code
    shouldHideContent: !shouldShowContent,
    startLoading: () => {}, // No-op since we auto-start
    finishLoading: () => {} // No-op since we auto-finish
  };
}

// 🎨 Optimized pre-configured hooks for immediate responsiveness
export function useDashboardLoading() {
  return useMinimumLoading(100); // 0.1 seconds - immediate response
}

export function useResumeLoading() {
  return useMinimumLoading(100); // 0.1 seconds - immediate response
}

export function useJobDescriptionLoading() {
  return useMinimumLoading(100); // 0.1 seconds - immediate response
}

export function useFinalizeLoading() {
  return useMinimumLoading(100); // 0.1 seconds - immediate response
}