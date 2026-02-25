import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scroll functions
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn() as any;

// Mock crypto for Proof of Work
global.crypto = {
  subtle: {
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
  },
} as any;

// Mock window.crypto.randomUUID if needed
if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: vi.fn(() => '12345678-1234-1234-1234-123456789012'),
    writable: true,
  });
}

// Suppress console warnings in tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Filter out specific warnings
  if (args[0]?.includes?.('React') || args[0]?.includes?.('act')) {
    return;
  }
  originalWarn(...args);
};
