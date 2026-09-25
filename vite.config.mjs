import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        curriculum: resolve(import.meta.dirname, 'curriculum.html'),
        alumni: resolve(import.meta.dirname, 'alumni.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        pta: resolve(import.meta.dirname, 'pta.html'),
        staff: resolve(import.meta.dirname, 'staff.html'),
        virtualTour: resolve(import.meta.dirname, 'virtual-tour.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-360-assets',
      closeBundle() {
        if (fs.existsSync('360')) {
          fs.cpSync('360', 'dist/360', { recursive: true });
        }
      }
    }
  ]
});
