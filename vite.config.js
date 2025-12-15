import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        // Optimize chunk splitting
        rollupOptions: {
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
