import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * VITE CONFIGURATION - OPTIMIZED FOR LIGHTHOUSE > 95
 * 
 * Performance features:
 * - Bundle splitting for better caching
 * - Tree shaking
 * - Minification
 * - Preload hints
 */
export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Target modern browsers for smaller bundles
      target: 'esnext',
      // Minification options
      minify: 'esbuild',
      // CSS code splitting
      cssCodeSplit: true,
      // Generate source maps for production debugging
      sourcemap: false,
      // Chunk size warnings
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk - React ecosystem
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Animation chunk
            'vendor-animation': ['framer-motion'],
            // 3D chunk - heavy Three.js
            'vendor-3d': ['three'],
            // UI utilities
            'vendor-ui': ['lucide-react'],
            // Data utilities
            'vendor-data': ['@supabase/supabase-js', 'zod'],
          },
          // Asset file naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId 
              ? chunkInfo.facadeModuleId.split('/').pop() 
              : 'chunk';
            return `assets/${chunkInfo.name || facadeModuleId}-[hash].js`;
          },
        },
      },
      // Enable esbuild minification options
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
        legalComments: 'none',
      },
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'lucide-react',
      ],
      exclude: ['@iconify/icons-mdi'],
    },
    // Enable gzip compression preview
    preview: {
      port: 3000,
    },
  };
});