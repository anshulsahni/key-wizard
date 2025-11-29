import { defineConfig } from 'vite';
import { resolve } from 'path';

// Build config for content script (IIFE format)
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't empty on first build
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: 'content.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'styles.css') {
            return 'content.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
        format: 'iife',
        name: 'KeyWizard',
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

