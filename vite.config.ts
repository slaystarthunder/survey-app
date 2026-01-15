// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

import fs from "node:fs/promises";
import path from "node:path";

const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".vite",
  ".turbo",
  ".next",
  "coverage",
]);

const EXCLUDE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".pdf",
  ".zip",
  ".map",
]);

// Extra safety: avoid exporting obvious secret/credential files.
const EXCLUDE_FILENAMES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
]);

async function walk(
  dirAbs: string,
  rootAbs: string,
  out: Record<string, string>
) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });

  for (const e of entries) {
    const abs = path.join(dirAbs, e.name);
    const rel = path.relative(rootAbs, abs).split(path.sep).join("/");

    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      await walk(abs, rootAbs, out);
      continue;
    }

    if (EXCLUDE_FILENAMES.has(e.name)) continue;

    // crude additional guard
    const lower = e.name.toLowerCase();
    if (lower.includes("serviceaccount") || lower.includes("privatekey")) continue;

    const ext = path.extname(e.name).toLowerCase();
    if (EXCLUDE_EXT.has(ext)) continue;

    try {
      const text = await fs.readFile(abs, "utf-8");
      out[rel] = text;
    } catch {
      // ignore binary/unreadable files
    }
  }
}

function devSnapshotPlugin() {
  return {
    name: "dev-snapshot",
    apply: "serve" as const, // dev only (never in production build)
    configureServer(server: any) {
      server.middlewares.use("/__dev/snapshot", async (_req: any, res: any) => {
        try {
          const rootAbs: string = server.config.root ?? process.cwd();
          const files: Record<string, string> = {};
          await walk(rootAbs, rootAbs, files);

          const payload = {
            type: "maps-of-needs-code-snapshot",
            exportedAt: new Date().toISOString(),
            root: rootAbs,
            fileCount: Object.keys(files).length,
            files,
          };

          const json = JSON.stringify(payload, null, 2);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(json);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify(
              { error: err?.message ?? String(err) },
              null,
              2
            )
          );
        }
      });
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), devSnapshotPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@infra": fileURLToPath(new URL("./src/infra", import.meta.url)),
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
    },
  },
});
