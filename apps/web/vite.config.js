import {defineConfig} from 'vite';

export default defineConfig({
    base: '/pwa-bootcamp-ii/', // NOME DO SEU REPOSITÓRIO
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
        host: '0.0.0.0',
        strictPort: true,
        watch: {
            usePolling: true
        }
    }
});