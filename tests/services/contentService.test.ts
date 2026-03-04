import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contentService } from '../../services/contentService';
import { supabase, isLiveMode } from '../../lib/supabase';

// Mock Supabase with isLiveMode
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
        order: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        data: null,
        error: null,
      })),
    })),
  },
  isLiveMode: vi.fn(() => false),
  getStorageUrl: vi.fn((url) => url),
}));

describe('ContentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isLiveMode).mockReturnValue(false);
  });

  describe('getServices', () => {
    it('should return services data for french locale', async () => {
      const result = await contentService.getServices('fr');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fallback to local data when Supabase connection is inactive', async () => {
      vi.mocked(isLiveMode).mockReturnValue(false);
      const result = await contentService.getServices('fr');
      expect(result).toBeDefined();
    });
  });

  describe('getServiceById', () => {
    it('should return specific service', async () => {
      const result = await contentService.getServiceById('business-intelligence', 'fr');
      expect(result).toBeDefined();
    });

    it('should return null for non-existent service', async () => {
      const result = await contentService.getServiceById('invalid-id', 'fr');
      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully in live mode', async () => {
      vi.mocked(isLiveMode).mockReturnValue(true);
      // @ts-ignore
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Network Error', code: 'NETWORK_ERROR' } })
        }))
      });

      // The new implementation throws in live mode when a technical error occurs
      await expect(contentService.getServices('fr')).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      vi.mocked(isLiveMode).mockReturnValue(true);
      // @ts-ignore
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Timeout', code: 'TIMEOUT' } })
        }))
      });
      await expect(contentService.getServices('fr')).rejects.toThrow();
    });
  });
});