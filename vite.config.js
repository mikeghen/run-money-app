import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("import.meta.env", import.meta.env);

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: "8080",
  },
  plugins: [react()],
  base: ""
});
