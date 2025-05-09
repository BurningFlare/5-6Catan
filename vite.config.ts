import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  base: "/5-6Catan",
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'copy-404-for-github-pages',
      closeBundle() {
        // Copy 404.html to dist folder
        copyFileSync('public/404.html', 'dist/404.html');
        // Copy redirect.js to dist folder
        copyFileSync('public/redirect.js', 'dist/redirect.js');
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
