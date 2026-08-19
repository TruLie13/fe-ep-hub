import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

/**
 * MapLibre v6 workers must be served as sibling files from public/.
 * Turbopack hashes the worker URL without emitting maplibre-gl-shared.mjs
 * next to it, so tiles never load. See MapLibre Next.js / Turbopack docs.
 */
const dist = path.join(path.dirname(createRequire(import.meta.url).resolve("maplibre-gl/package.json")), "dist");
const dest = path.join(process.cwd(), "public", "maplibre");

mkdirSync(dest, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(path.join(dist, file), path.join(dest, file));
}
