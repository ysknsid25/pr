import ssg from "@hono/vite-ssg";
import adapter from "@hono/vite-dev-server/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import client from "honox/vite/client";
import { defineConfig } from "vite";

const entry = "./app/server.ts";

export default defineConfig(({ mode }) => {
    if (mode === "client") {
        return {
            plugins: [
                client({ input: ["/app/client.ts", "/app/style.css"] }),
                tailwindcss(),
            ],
        };
    }

    return {
        // クライアントビルドで生成した dist/static とマニフェストを消さない
        build: { emptyOutDir: false },
        plugins: [
            honox({ devServer: { adapter } }),
            tailwindcss(),
            ssg({ entry }),
        ],
    };
});
