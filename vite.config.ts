import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
        {
          src: 'public/icons/*',
          dest: 'icons',
        },
      ],
    }) as any,
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'service-worker' 
            ? 'service-worker.js' 
            : '[name].js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'styles.css') {
            return 'content.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
        // Use IIFE format to avoid ES module imports in content scripts
        format: 'iife',
        name: 'KeyWizard',
        // Force all code into entry chunks - prevent code splitting
        manualChunks: (id) => {
          // Don't create separate chunks - bundle everything with entries
          // This ensures content.js has no external imports
          return null;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
