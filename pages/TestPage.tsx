import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  console.log('[TestPage] Rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">✅ Test Page Loaded Successfully!</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-slate-600 dark:text-slate-300">
              If you can see this page, the basic React rendering is working correctly.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              The issue might be with lazy-loaded components or specific providers.
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Check browser console for errors (F12 → Console)</li>
              <li>Look for failed network requests</li>
              <li>Test individual lazy-loaded components</li>
              <li>Verify provider initialization logs</li>
            </ol>
          </div>
          
          <div className="flex gap-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-analytica-accent hover:bg-analytica-accent/90 text-white rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Home Page
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;