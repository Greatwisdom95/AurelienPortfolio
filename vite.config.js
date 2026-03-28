import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        // Multi-page build: index.html (portfolio) + jpo.html (JPO page)
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                jpo: resolve(__dirname, 'jpo.html'),
            },
            output: {
                manualChunks: {
                    // Split vendor chunks for better caching
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-gsap': ['gsap'],
                },
            },
        },
        // Use esbuild for minification (default, faster)
        minify: 'esbuild',
        // Chunk size warning limit
        chunkSizeWarningLimit: 500,
    },
})
