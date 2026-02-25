import { describe, it, expect, vi } from 'vitest';
import { checkRateLimit, checkClientRateLimit } from '../../utils/rateLimit';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Server-side Rate Limiting', () => {
    it('should allow first request for new IP', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect());

      const result = await checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(true);
    });

    it('should block requests exceeding limit', async () => {
      const mockData = {
        identifier: '192.168.1.1',
        requests: 5,
        first_request: Date.now() - 30000, // 30 seconds ago
        last_request: Date.now(),
        blocked_until: null,
      };

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
        update: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect());

      const result = await checkRateLimit('192.168.1.1', { maxRequests: 5 });
      expect(result.allowed).toBe(false);
      expect(result.blocked).toBe(true);
    });

    it('should reset counter after window expires', async () => {
      const mockData = {
        identifier: '192.168.1.1',
        requests: 5,
        first_request: Date.now() - 70000, // 70 seconds ago (> 1 minute window)
        last_request: Date.now() - 65000,
        blocked_until: null,
      };

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
        update: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect());

      const result = await checkRateLimit('192.168.1.1', { windowMs: 60000 });
      expect(result.allowed).toBe(true);
    });

    it('should handle blocked IPs', async () => {
      const blockedUntil = Date.now() + 300000; // Blocked for 5 minutes
      const mockData = {
        identifier: '192.168.1.1',
        requests: 10,
        first_request: Date.now() - 60000,
        last_request: Date.now(),
        blocked_until: blockedUntil,
      };

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect());

      const result = await checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(false);
      expect(result.blocked).toBe(true);
      expect(result.resetTime).toBe(blockedUntil);
    });

    it('should handle database errors gracefully', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
          }),
        }),
      });

      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect());

      const result = await checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(true); // Fail open for security
    });
  });

  describe('Client-side Rate Limiting', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should allow first request', () => {
      const result = checkClientRateLimit('test-action');
      expect(result).toBe(true);
    });

    it('should track multiple requests within window', () => {
      checkClientRateLimit('test-action');
      checkClientRateLimit('test-action');
      const result = checkClientRateLimit('test-action');
      expect(result).toBe(true); // 3rd request still allowed
    });

    it('should block after limit reached', () => {
      checkClientRateLimit('test-action');
      checkClientRateLimit('test-action');
      checkClientRateLimit('test-action');
      const result = checkClientRateLimit('test-action'); // 4th request
      expect(result).toBe(false);
    });

    it('should reset after window expires', () => {
      // Mock Date.now to simulate time passing
      const now = Date.now();
      const mockNow = vi.spyOn(Date, 'now');
      
      // First request
      mockNow.mockReturnValue(now);
      checkClientRateLimit('test-action');
      
      // Wait 61 seconds
      mockNow.mockReturnValue(now + 61000);
      const result = checkClientRateLimit('test-action');
      expect(result).toBe(true);
      
      mockNow.mockRestore();
    });
  });
});
