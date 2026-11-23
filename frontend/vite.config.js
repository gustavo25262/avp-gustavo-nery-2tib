import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/jogos": "http://localhost:3000",
      "/usuarios": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/upload": "http://localhost:3000",
      "/uploads": "http://localhost:3000"
    }
  }
});
