import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../../pages/Contact';
import { I18nProvider } from '../../components/System/I18nProvider';

describe('Contact Page Integration', () => {
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

  test('should render contact form', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </I18nProvider>
    );

    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer/i })).toBeInTheDocument();
  });

  test('should validate form on submission', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </I18nProvider>
    );

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    fireEvent.click(submitButton);

    // Should show validation errors
    expect(screen.getByText(/Veuillez corriger les erreurs dans le formulaire/i)).toBeInTheDocument();
  });

  test('should show contact information', () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </I18nProvider>
    );

    // Check for contact info
    expect(screen.getByText(/contact@analyticatech.fr/i)).toBeInTheDocument();
    expect(screen.getByText(/75008 Paris, France/i)).toBeInTheDocument();
  });
});