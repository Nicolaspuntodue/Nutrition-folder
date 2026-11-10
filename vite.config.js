import { defineConfig } from 'vite'

// Due pagine: la homepage e l'app del quiz.
export default defineConfig({
  server: { port: 5173, host: true },
  build: { rollupOptions: { input: { home: 'index.html', app: 'app.html' } } },
})
