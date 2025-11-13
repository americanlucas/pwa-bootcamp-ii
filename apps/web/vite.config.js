import {defineConfig} from 'vite';

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    resolve: {
      alias: {
          '@': './src'
      }
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './src/index.html'
            }
        }
    },
    server: {
        port: 8080,
        host: '0.0.0.0', // Permite conexões externas ao container
        strictPort: true,
        watch: {
            usePolling: true // Importante para Docker no Windows
        }
    }
});