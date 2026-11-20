import { defineConfig, loadEnv } from 'vite';
import { rmSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export default defineConfig(({ mode }) => ({
  // Project Pages needs /repository-name/. Normal static builds remain portable.
  base: process.env.VITE_BASE_PATH || loadEnv(mode, process.cwd(), 'VITE_').VITE_BASE_PATH || (mode === 'github-pages' ? '/ottawa-robotic-housing-ar/' : './'),
  plugins: [{
    name: 'inspection-assets',
    closeBundle() {
      rmSync('dist/models/original', { recursive: true, force: true });
      mkdirSync('dist/reports', { recursive: true });
      const inventory = JSON.parse(readFileSync('reports/inventory.json', 'utf8'));
      writeFileSync('dist/reports/inventory.json', JSON.stringify(inventory.map(({ path, ...row }) => row)));
      cpSync('reports/thumbnails', 'dist/reports/thumbnails', { recursive: true });
      writeFileSync('dist/.nojekyll', '');
    }
  }],
  server: { host: '0.0.0.0' },
  build: { target: 'es2022', chunkSizeWarningLimit: 1800 },
  optimizeDeps: { exclude: ['mind-ar'] }
}));
