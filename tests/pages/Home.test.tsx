import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { I18nProvider } from '../../components/System/I18nProvider';

describe('Home Page Integration', () => {
  beforeEach(() => {
    // Mock localStorage for I18nProvider
    const localStorageMock = (() => {
      let store: Record<string, string> = {
        'analytica_locale': 'fr'
      };
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // Mock IntersectionObserver for Framer Motion
    class IntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      root = null;
      rootMargin = '';
      thresholds = [];
      takeRecords = () => [];
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      value: IntersectionObserver,
      writable: true
    });

    Object.defineProperty(global, 'IntersectionObserver', {
      value: IntersectionObserver,
      writable: true
    });
  });

  test('should render main hero section', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nProvider>
    );

    // Check for main hero elements
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Cabinet expert en Business Intelligence/i)).toBeInTheDocument();
  });

  test('should render service cards', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nProvider>
    );

    // Check for service cards
    expect(screen.getByText(/Augmented Decision Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Operational Orchestration/i)).toBeInTheDocument();
  });

  test('should render CTA section', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nProvider>
    );

    // Check for CTA elements (NavLink renders as link)
    expect(screen.getByRole('link', { name: /Démarrer/i })).toBeInTheDocument();
  });
});