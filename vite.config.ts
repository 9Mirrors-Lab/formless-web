/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { loadEndorsementDoc } from "./src/lib/endorsementDoc";
import {
  parseSonikaInquiryNotifyPayload,
  sendSonikaInquiryNotifyEmail,
} from "./src/lib/sonikaInquiryEmail";
import { streamGoogleDriveMedia } from "./src/lib/streamGoogleDriveMedia";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as unknown);
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

function sonikaInquiryNotifyProxy(): Plugin {
  const attach = (middlewares: {
    use: (
      path: string,
      fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void,
    ) => void;
  }) => {
    middlewares.use(
      "/api/notify-sonika-inquiry",
      (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const method = (req.method ?? "GET").toUpperCase();
        if (method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Allow", "POST, OPTIONS");
          res.end();
          return;
        }
        if (method !== "POST") {
          next();
          return;
        }

        void readJsonBody(req)
          .then(async (body) => {
            const parsed = parseSonikaInquiryNotifyPayload(body);
            if (!parsed.ok) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: parsed.error }));
              return;
            }

            const result = await sendSonikaInquiryNotifyEmail(parsed.payload);
            if (!result.ok) {
              res.statusCode = result.status ?? 502;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: result.error }));
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ ok: true, id: result.id ?? null }));
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
                    : "Inquiry notify proxy failed.",
              }),
            );
          });
      },
    );
  };

  return {
    name: "sonika-inquiry-notify-proxy",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          continuityv2: path.resolve(__dirname, "continuityv2.html"),
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      googleDriveMediaProxy(),
      endorsementDocProxy(),
      sonikaInquiryNotifyProxy(),
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
  };
});
