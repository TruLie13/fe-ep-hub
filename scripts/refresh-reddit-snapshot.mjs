#!/usr/bin/env node
/**
 * Refresh content/data/reddit-elpaso.json from Reddit's Atom feed.
 * Run from a machine Reddit allows (usually local), then commit the JSON.
 * Keep mapping aligned with lib/content/fetch-reddit-elpaso.ts.
 */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const REDDIT_USER = "Tru_Lie";
const SUBMITTED_ATOM = `https://www.reddit.com/user/${REDDIT_USER}/submitted.rss`;
const MAX_RESULTS = 20;
const USER_AGENT = "eptruth/1.0 (El Paso Hub news page; +https://elpasohub.org)";

const THUMBNAIL_OVERRIDES = {
  "1s1mb9l": "/images/news/reddit-1s1mb9l.jpg",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "content", "data", "reddit-elpaso.json");

function redditPostIdFromUrl(postUrl) {
  const m = postUrl.match(/\/comments\/([a-z0-9]+)\//i);
  return m?.[1];
}

function applyThumbnailOverride(postUrl, fromFeed) {
  const id = redditPostIdFromUrl(postUrl);
  if (id && THUMBNAIL_OVERRIDES[id]) return THUMBNAIL_OVERRIDES[id];
  return fromFeed;
}

function parseAtomEntries(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: {
      maxEntityCount: 20_000,
      maxTotalExpansions: 20_000,
      maxExpandedLength: 2_000_000,
    },
  });
  const parsed = parser.parse(xml);
  const raw = parsed.feed?.entry;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function atomLinkHref(entry) {
  return entry.link?.["@_href"] ?? "";
}

function categoryTerm(entry) {
  const cat = entry.category;
  if (!cat) return undefined;
  if (Array.isArray(cat)) return cat.map((c) => c["@_term"]).find(Boolean);
  return cat["@_term"];
}

function isElPasoEntry(entry) {
  const term = categoryTerm(entry);
  if (term && String(term).toLowerCase() === "elpaso") return true;
  return /\/r\/elpaso\//i.test(atomLinkHref(entry));
}

function thumbnailFromEntry(entry) {
  const url = entry["media:thumbnail"]?.["@_url"];
  return typeof url === "string" ? url : undefined;
}

function firstImageFromContent(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!m?.[1]) return undefined;
  return m[1].replace(/&amp;/g, "&");
}

function contentHtml(entry) {
  const c = entry.content;
  return typeof c?.["#text"] === "string" ? c["#text"] : "";
}

function isVideoPost(html) {
  return /v\.redd\.it/i.test(html);
}

function htmlToPlain(html, maxLen) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return undefined;
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function toISODate(published) {
  if (!published) return undefined;
  try {
    return new Date(published).toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

function newsLinksFromAtomXml(xml) {
  return parseAtomEntries(xml)
    .filter(isElPasoEntry)
    .slice(0, MAX_RESULTS)
    .map((entry, i) => {
      const url = atomLinkHref(entry);
      const html = contentHtml(entry);
      const thumbRaw = thumbnailFromEntry(entry) ?? firstImageFromContent(html);
      const thumb = applyThumbnailOverride(url, thumbRaw);
      const video = isVideoPost(html);
      return {
        id: `reddit-${String(entry.id ?? i)}`,
        headline: String(entry.title ?? "Untitled"),
        url,
        outlet: "r/ElPaso",
        publishedAt: toISODate(typeof entry.published === "string" ? entry.published : undefined),
        summary: htmlToPlain(html, 280),
        tags: ["reddit", "el-paso"],
        thumbnailUrl: thumb,
        mediaHint: video ? "video" : thumb ? "image" : undefined,
        provenance: "reddit",
      };
    });
}

async function main() {
  const res = await fetch(SUBMITTED_ATOM, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
  });
  if (!res.ok) {
    console.error(`[refresh-reddit-snapshot] Atom HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const links = newsLinksFromAtomXml(xml);
  if (links.length === 0) {
    console.error("[refresh-reddit-snapshot] No r/ElPaso posts in feed");
    process.exit(1);
  }

  const bundle = {
    schemaVersion: 1,
    fetchedAt: new Date().toISOString(),
    links,
  };
  writeFileSync(OUT_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  console.log(`[refresh-reddit-snapshot] Wrote ${links.length} links → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error("[refresh-reddit-snapshot]", e);
  process.exit(1);
});
