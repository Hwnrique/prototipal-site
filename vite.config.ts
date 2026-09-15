import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  // O GitHub Pages serve este projeto dentro do caminho do repositório.
  base: '/prototipal-site/',
});
