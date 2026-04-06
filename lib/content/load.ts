import fs from "node:fs";
import path from "node:path";

import type {
  DataCentersImpactsBundle,
  LocalGovernmentBundle,
  NewsBundle,
  Source,
  SourcesBundle,
} from "@/content/schema";

import { normalizeLocalGovernment } from "@/lib/content/normalize-local-government";

const contentRoot = path.join(process.cwd(), "content");

export function loadSourcesBundle(): SourcesBundle {
  const filePath = path.join(contentRoot, "sources", "index.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as SourcesBundle;
}

export function loadNewsBundle(): NewsBundle {
  const filePath = path.join(contentRoot, "data", "news.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as NewsBundle;
}

export function loadDataCentersImpacts(): DataCentersImpactsBundle {
  const filePath = path.join(contentRoot, "data", "data-centers-impacts.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<DataCentersImpactsBundle>;
  return {
    schemaVersion: parsed.schemaVersion ?? 1,
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    noiseTable: parsed.noiseTable,
    economicTable: parsed.economicTable,
  };
}

export function loadLocalGovernmentBundle(): LocalGovernmentBundle {
  const filePath = path.join(contentRoot, "data", "local-government.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return normalizeLocalGovernment(JSON.parse(raw) as unknown);
}

export function sourcesById(bundle: SourcesBundle): Map<string, Source> {
  return new Map(bundle.sources.map((s) => [s.id, s]));
}

export function pickSources(bundle: SourcesBundle, ids: string[]): Source[] {
  const map = sourcesById(bundle);
  return ids.map((id) => map.get(id)).filter((s): s is Source => Boolean(s));
}
