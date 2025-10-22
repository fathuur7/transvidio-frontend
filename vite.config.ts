import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Lebih eksplisit daripada true
    port: 8080,
    strictPort: true, // Gagal jika port sudah dipakai
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      mangle: true,
      format: {
        comments: false // Hapus semua comment di production
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Chunk splitting yang lebih reliable
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            return 'vendor'; // Vendor lainnya
          }
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Naikkan limit warning
    sourcemap: mode === 'development' // Source map hanya untuk dev
  }
}));