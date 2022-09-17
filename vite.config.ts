import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [ solidPlugin(), mkcert() ],
  server: {
    port: 3000,
    https: true
  },
  build: {
    target: 'esnext',
  },
  base: ""
});
