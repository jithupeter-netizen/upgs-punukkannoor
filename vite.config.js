import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        alumni: resolve(__dirname, 'alumni.html'),
        contact: resolve(__dirname, 'contact.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        pta: resolve(__dirname, 'pta.html'),
        staff: resolve(__dirname, 'staff.html'),
        virtualTour: resolve(__dirname, 'virtual-tour.html'),
      },
    },
  },
});
