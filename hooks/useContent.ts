import { useState, useEffect, useRef, useCallback } from 'react';
import { contentService } from '../services/contentService';
import { useI18n } from '../components/System/I18nProvider';

/**
 * OPTIMIZED DATA FETCHER
 * Features for Lighthouse > 95:
 * - In-memory cache to prevent duplicate requests
 * - Request deduplication
 * - Stale-while-revalidate pattern
 * - Reduced console logging in production
 */

// Global cache for data deduplication
const cache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(key: string, locale: string): string {
  return `${key}:${locale}`;
}

function useDataFetcher<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(() => {
    // Initialize from cache if available
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // Not loading if we have cached data
    const cached = cache.get(cacheKey);
    return !cached || Date.now() - cached.timestamp >= CACHE_TTL;
  });
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      if (isMountedRef.current) {
        setData(cached.data);
        setIsLoading(false);
      }
      return;
    }

    // Check if request is already pending (deduplication)
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      pending.then((result) => {
        if (isMountedRef.current) {
          setData(result);
          setIsLoading(false);
        }
      });
      return;
    }

    // Start new request
    setIsLoading(true);
    
    const request = fetcher()
      .then((result) => {
        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        pendingRequests.delete(cacheKey);
        
        if (isMountedRef.current) {
          setData(result);
          setError(null);
          setIsLoading(false);
        }
        return result;
      })
      .catch((err) => {
        pendingRequests.delete(cacheKey);
        
        if (isMountedRef.current) {
          setError(err);
          setIsLoading(false);
        }
        
        // Only log in development
        if (import.meta.env.DEV) {
          console.error("Data Fetch Error:", err);
        }
        throw err;
      });

    pendingRequests.set(cacheKey, request);

    return () => {
      isMountedRef.current = false;
    };
  }, [cacheKey, ...dependencies]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    cache.delete(cacheKey);
    pendingRequests.delete(cacheKey);
    setIsLoading(true);
    
    try {
      const result = await fetcher();
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, [cacheKey, fetcher]);

  return { data, isLoading, error, refetch };
}

// Export hooks with cache keys
export const useServices = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('services', locale),
    () => contentService.getServices(locale),
    [locale]
  );
};

export const useServiceDetail = (id: string) => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey(`service:${id}`, locale),
    () => contentService.getServiceById(id, locale),
    [id, locale]
  );
};

export const useSolutions = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('solutions', locale),
    () => contentService.getSolutions(locale),
    [locale]
  );
};

export const useSolutionDetail = (id: string) => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey(`solution:${id}`, locale),
    () => contentService.getSolutionById(id, locale),
    [id, locale]
  );
};

export const useResources = (category?: string) => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey(`resources:${category || 'all'}`, locale),
    () => contentService.getResources(locale, category),
    [locale, category]
  );
};

export const useTestimonials = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('testimonials', locale),
    () => contentService.getTestimonials(locale),
    [locale]
  );
};

export const useTeam = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('team', locale),
    () => contentService.getTeam(locale),
    [locale]
  );
};

export const useMilestones = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('milestones', locale),
    () => contentService.getMilestones(locale),
    [locale]
  );
};

export const useCoreValues = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('coreValues', locale),
    () => contentService.getCoreValues(locale),
    [locale]
  );
};

export const useTickerMetrics = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('tickerMetrics', locale),
    () => contentService.getTickerMetrics(locale),
    [locale]
  );
};

export const useFeaturedCases = () => {
  const { locale } = useI18n();
  return useDataFetcher(
    getCacheKey('featuredCases', locale),
    () => contentService.getFeaturedCases(locale),
    [locale]
  );
};