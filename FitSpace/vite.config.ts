import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: change '/fitspace/' to your GitHub repository name
// when deploying to GitHub Pages, e.g. '/my-repo-name/'
export default defineConfig({
  plugins: [react()],
  base: '/fitspace/',
});