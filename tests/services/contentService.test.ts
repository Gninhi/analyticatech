import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contentService } from '../../services/contentService';
import { supabase } from '../../lib/supabase';

// Mock Supabase
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
}));

describe('ContentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getServices', () => {
    it('should return services data for french locale', async () => {
      const mockServices = [
        { id: '1', title: { fr: 'Service 1', en: 'Service 1 EN' }, icon: 'icon' },
      ];
      
      const mockResponse = {
        data: mockServices,
        error: null,
      };
      
      // Setup mock
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue(mockResponse),
      });
      
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const result = await contentService.getServices('fr');
      expect(result).toBeDefined();
    });

    it('should fallback to local data when Supabase fails', async () => {
      const mockError = { message: 'Connection failed' };
      
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      const result = await contentService.getServices('fr');
      expect(result).toBeDefined();
    });
  });

  describe('getServiceById', () => {
    it('should return specific service', async () => {
      const mockService = { id: 'service-1', title: { fr: 'Service 1' } };
      
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockService, error: null }),
          }),
        }),
      });

      const result = await contentService.getServiceById('service-1', 'fr');
      expect(result).toBeDefined();
    });

    it('should return null for non-existent service', async () => {
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      });

      const result = await contentService.getServiceById('invalid-id', 'fr');
      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Network error');
      });

      await expect(contentService.getServices('fr')).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Timeout');
      });

      await expect(contentService.getServices('fr')).rejects.toThrow('Timeout');
    });
  });
});
