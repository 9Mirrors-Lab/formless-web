/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { loadEndorsementDoc } from "./src/lib/endorsementDoc";
import { streamGoogleDriveMedia } from "./src/lib/streamGoogleDriveMedia";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function repoStaticPlugin(mount: string, rootDir: string): Plugin {
  const root = path.resolve(__dirname, rootDir);
  return {
    name: `repo-static:${mount}`,
    configureServer(server) {
      server.middlewares.use(mount, (req, res, next) => {
        if (!req.url) return next();
        let rel = decodeURIComponent(req.url.split("?")[0] ?? "/");
        if (rel === "/") return next();
        const file = path.normalize(path.join(root, rel));
        if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
          return next();
        }
        const ext = path.extname(file).toLowerCase();
        const types: Record<string, string> = {
          ".html": "text/html; charset=utf-8",
          ".css": "text/css; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".svg": "image/svg+xml",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp",
        };
        res.setHeader("Content-Type", types[ext] ?? "application/octet-stream");
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

function endorsementDocProxy(): Plugin {
  const attach = (middlewares: {
    use: (
      path: string,
      fn: (req: IncomingMessage, res: ServerResponse) => void,
    ) => void;
  }) => {
    middlewares.use("/api/endorsements", (req: IncomingMessage, res: ServerResponse) => {
      const refresh =
        new URL(req.url ?? "", "http://localhost/api/endorsements").searchParams.get(
          "refresh",
        ) === "1";
      void loadEndorsementDoc({ refresh })
        .then((payload) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
          res.end(JSON.stringify(payload));
        })
        .catch((error: unknown) => {
          if (res.headersSent) return;
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Endorsement doc proxy failed.",
            }),
          );
        });
    });
  };

  return {
    name: "endorsement-doc-proxy",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

function googleDriveMediaProxy(): Plugin {
  const attach = (middlewares: {
    use: (path: string, fn: (req: IncomingMessage, res: ServerResponse) => void) => void;
  }) => {
    middlewares.use("/api/drive/media", (req: IncomingMessage, res: ServerResponse) => {
      const fileId = new URL(req.url ?? "", "http://localhost").searchParams.get("id");
      void streamGoogleDriveMedia(req, res, fileId).catch((error: unknown) => {
        if (res.headersSent) return;
        res.statusCode = 502;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(error instanceof Error ? error.message : "Drive proxy failed.");
      });
    });
  };

  return {
    name: "google-drive-media-proxy",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    googleDriveMediaProxy(),
    endorsementDocProxy(),
    repoStaticPlugin("/repo-docs", "docs"),
    repoStaticPlugin("/repo-design", "design"),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    passWithNoTests: true,
  },
});
