
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- SYSTEM & UTILS ---
import { AnalyticsProvider } from './components/System/AnalyticsProvider';
import { I18nProvider } from './components/System/I18nProvider';
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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <Router>
          <AnalyticsProvider>
            <div className="min-h-screen relative text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col font-sans">
              <ScrollProgress />
              <ScrollToTop />
              <BackToTop />
              <CommandPalette />
              <CookieConsent />
              
              <Suspense fallback={null}>
                 <ImmersiveBackground />
                 <FluidCursor />
              </Suspense>

              <ErrorBoundary fallback={<div className="h-16 flex items-center justify-center bg-red-900/20 text-red-500 font-mono text-xs">NAV_ERR</div>}>
                <Navbar />
              </ErrorBoundary>
              
              <main className="flex-grow w-full relative z-10">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/solutions/:id" element={<SolutionDetail />} />
                    <Route path="/hub" element={<IntelligenceHub />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="*" element={<NotFound />} /> 
                  </Routes>
                </Suspense>
              </main>

              <Footer />
            </div>
          </AnalyticsProvider>
        </Router>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default App;
