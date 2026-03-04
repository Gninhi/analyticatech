
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { initSentry } from './lib/sentry';

// Init Sentry
initSentry();

// --- SYSTEM & UTILS ---
import { AnalyticsProvider } from './components/System/AnalyticsProvider';
import { I18nProvider } from './components/System/I18nProvider';
import { ThemeProvider } from './components/System/ThemeProvider';
import ErrorBoundary from './components/System/ErrorBoundary';
import ScrollToTop from './components/System/ScrollToTop';
import CookieConsent from './components/System/CookieConsent';

// --- LAYOUT ---
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// --- UI COMPONENTS (CRITICAL) ---
import ScrollProgress from './components/UI/ScrollProgress';
import BackToTop from './components/UI/BackToTop';
import CommandPalette from './components/System/CommandPalette';

// --- LAZY COMPONENTS ---
const ImmersiveBackground = lazy(() => import('./components/Visuals/ImmersiveBackground'));
const FluidCursor = lazy(() => import('./components/Visuals/FluidCursor'));

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Solutions = lazy(() => import('./pages/Solutions'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));
const IntelligenceHub = lazy(() => import('./pages/IntelligenceHub'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Non-lazy test page for debugging
import TestPage from './pages/TestPage';

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-transparent z-50">
    <div className="relative">
      <div className="absolute inset-0 bg-analytica-accent blur-xl opacity-20 animate-pulse"></div>
      <Loader2 className="w-12 h-12 text-analytica-accent animate-spin relative z-10" />
    </div>
    <div className="mt-4 text-xs font-mono text-analytica-accent tracking-[0.3em] uppercase animate-pulse">
      Initialisation...
    </div>
  </div>
);

const ErrorFallback = (
  <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
      <p className="text-red-500 mb-2">Something went wrong:</p>
      <pre className="text-sm text-gray-700 overflow-auto">Application failed to load</pre>
      <p className="text-xs text-gray-500 mt-4">Please refresh the page or contact support.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ThemeProvider>
        <I18nProvider>
          <Router>
            <AnalyticsProvider>
              <div className="min-h-screen relative text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col font-sans">
                <ScrollProgress />
                <ScrollToTop />
                <BackToTop />
                <CommandPalette />
                <CookieConsent />

                <ErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <ImmersiveBackground />
                  </Suspense>
                </ErrorBoundary>
                <ErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <FluidCursor />
                  </Suspense>
                </ErrorBoundary>

                <ErrorBoundary fallback={<div className="h-16 flex items-center justify-center bg-red-900/20 text-red-500 font-mono text-xs">NAV_ERR</div>}>
                  <Navbar />
                </ErrorBoundary>

                <main className="flex-grow w-full relative z-10">
                  <ErrorBoundary fallback={ErrorFallback}>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/test" element={<TestPage />} />
                        <Route
                          path="/"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <Home />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/services"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <Services />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/services/:id"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <ServiceDetail />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/solutions"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <Solutions />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/solutions/:id"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <SolutionDetail />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/hub"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <IntelligenceHub />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/about"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <About />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/contact"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <Contact />
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/legal"
                          element={
                            <ErrorBoundary fallback={ErrorFallback}>
                              <Legal />
                            </ErrorBoundary>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>

                <Footer />
              </div>
            </AnalyticsProvider>
          </Router>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
