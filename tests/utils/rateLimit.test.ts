import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, recordSubmission, RATE_LIMIT_COOLDOWN_MS } from '../../utils/security';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
})();

describe('Rate Limiting', () => {
  const originalDateNow = Date.now;
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up localStorage mock
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    Date.now = originalDateNow;
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  describe('checkRateLimit', () => {
    it('should allow first submission', () => {
      expect(checkRateLimit()).toBe(true);
    });

    it('should block rapid submissions within cooldown', () => {
      // First submission allowed
      expect(checkRateLimit()).toBe(true);
      recordSubmission();

      // Second submission should be blocked
      expect(checkRateLimit()).toBe(false);
    });

    it('should allow submission after cooldown', () => {
      // First submission
      expect(checkRateLimit()).toBe(true);
      recordSubmission();

      // Mock time after cooldown
      const futureTime = Date.now() + RATE_LIMIT_COOLDOWN_MS + 1000;
      Date.now = vi.fn(() => futureTime);

      expect(checkRateLimit()).toBe(true);
    });

    it('should handle invalid timestamp gracefully', () => {
      localStorage.setItem('last_submission', 'invalid-timestamp');
      expect(checkRateLimit()).toBe(true);
    });
  });

  describe('recordSubmission', () => {
    it('should store timestamp in localStorage', () => {
      recordSubmission();
      const stored = localStorage.getItem('last_submission');
      expect(stored).toBeDefined();
      expect(Number(stored)).toBeGreaterThan(0);
    });
  });
});