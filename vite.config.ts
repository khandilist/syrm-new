import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const root = new URL('.', import.meta.url).pathname;

  return {
    base: '/',
    css: { postcss: { plugins: [tailwindcss()] } },
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@', replacement: root },
        { find: /^react$/, replacement: new URL('./node_modules/react/index.js', import.meta.url).pathname },
        { find: /^react\/jsx-runtime$/, replacement: new URL('./node_modules/react/jsx-runtime.js', import.meta.url).pathname },
        { find: /^react\/jsx-dev-runtime$/, replacement: new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url).pathname },
        { find: /^react-dom$/, replacement: new URL('./node_modules/react-dom/index.js', import.meta.url).pathname },
        { find: /^react-dom\/client$/, replacement: new URL('./node_modules/react-dom/client.js', import.meta.url).pathname },
      ],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('/node_modules/three/')) {
              return 'vendor-three';
            }
          },
        },
      },
    },
  };
});
