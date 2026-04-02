import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
        }),
    ],
    server: {
        port: 5205,
        strictPort: true,
        proxy: {
            "/api": {
                target: "http://localhost:8094",
                changeOrigin: true,
            },
        },
    },
    preview: {
        port: 5205,
    },
});
