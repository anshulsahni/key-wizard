import { defineConfig } from 'vite';
import { resolve } from 'path';

// Build config for service worker (ES module format)
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false, // Don't empty on second build
    minify: false, // Disable minification for easier debugging
    rollupOptions: {
      input: {
        "service-worker": resolve(
          __dirname,
          "src/background/service-worker.ts"
        ),
      },
      output: {
        entryFileNames: "service-worker.js",
        format: "es",
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

