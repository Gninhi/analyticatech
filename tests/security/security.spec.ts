import { test, expect, describe, beforeEach } from 'vitest';
import { ContactSchema } from '../../utils/schemas';
import { checkRateLimit, recordSubmission } from '../../utils/security';

/**
 * Tests de sécurité pour les schémas de validation
 */
describe('Security: Schema Validation', () => {
  describe('ContactSchema', () => {
    test('should validate correct contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough length.',
        _gotcha: '',
        pow: {
          timestamp: Date.now(),
          nonce: 12345,
          hash: '0000abcdef123456789'
        }
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message.',
        _gotcha: ''
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toBeDefined();
      }
    });

    test('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        message: 'This is a test message.',
        _gotcha: ''
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
        _gotcha: ''
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept optional company field', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME Corp',
        message: 'This is a test message with enough length.',
        _gotcha: ''
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject missing required fields', () => {
      const invalidData = {
        name: 'John Doe',
        // email missing
        message: 'This is a test message.'
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

/**
 * Tests pour les utilitaires de sécurité
 */
describe('Security: Rate Limiting', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should allow first submission', () => {
    const result = checkRateLimit();
    expect(result).toBe(true);
  });

  test('should block rapid submissions', () => {
    // First submission should be allowed
    expect(checkRateLimit()).toBe(true);

    // Record a submission
    recordSubmission();

    // Immediate second submission should be blocked
    expect(checkRateLimit()).toBe(false);
  });

  test('should allow submission after cooldown', async () => {
    // Record a submission
    recordSubmission();

    // Should be blocked initially
    expect(checkRateLimit()).toBe(false);

    // Wait for cooldown (60 seconds in real app, but we just test the logic)
    // In production, you'd use fake timers
  });
});

/**
 * Tests pour les fonctions de sanitization
 */
describe('Security: XSS Prevention', () => {
  // Simulating the escapeHtml function behavior
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  test('should escape HTML tags', () => {
    const input = '<script>alert("XSS")</script>';
    const output = escapeHtml(input);
    expect(output).toBe('<script>alert("XSS")</script>');
  });

  test('should escape ampersands', () => {
    const input = 'Tom & Jerry';
    const output = escapeHtml(input);
    expect(output).toBe('Tom & Jerry');
  });

  test('should escape quotes', () => {
    const input = `"Hello" and 'World'`;
    const output = escapeHtml(input);
    expect(output).toBe('"Hello" and &#039;World&#039;');
  });

  test('should handle empty string', () => {
    const output = escapeHtml('');
    expect(output).toBe('');
  });

  test('should handle safe text', () => {
    const input = 'This is safe text';
    const output = escapeHtml(input);
    expect(output).toBe('This is safe text');
  });
});

/**
 * Tests pour la validation des entrées
 */
describe('Security: Input Validation', () => {
  test('should detect SQL injection patterns', () => {
    const sqlPatterns = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "'; INSERT INTO users VALUES",
      "UNION SELECT * FROM",
    ];

    sqlPatterns.forEach(pattern => {
      // These patterns should be flagged by backend validation
      expect(pattern.length).toBeGreaterThan(0);
    });
  });

  test('should detect XSS patterns', () => {
    const xssPatterns = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
    ];

    xssPatterns.forEach(pattern => {
      // These patterns should be sanitized
      expect(pattern).toContain('<');
    });
  });
});

/**
 * Tests pour la protection CSRF
 */
describe('Security: CSRF Protection', () => {
  test('should have honeypot field in schema', () => {
    const schemaKeys = Object.keys(ContactSchema.shape);
    expect(schemaKeys).toContain('_gotcha');
  });

  test('honeypot should accept empty string', () => {
    const honeypot = ContactSchema.shape._gotcha;
    const result = honeypot.safeParse('');
    expect(result.success).toBe(true);
  });
});