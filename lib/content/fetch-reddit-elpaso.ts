import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import type { NewsLink, RedditElPasoSnapshotBundle } from "@/content/schema";
import { NEWS_PAGE_REVALIDATE_SECONDS } from "@/lib/constants/news";
import { sanitizeThumbnailUrl } from "@/lib/content/sanitize-thumbnail-url";

export { sanitizeThumbnailUrl } from "@/lib/content/sanitize-thumbnail-url";

const REDDIT_USER = "Tru_Lie";
export const SUBMITTED_ATOM = `https://www.reddit.com/user/${REDDIT_USER}/submitted.rss`;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBMITTED_ATOM)}`;
const MAX_RESULTS = 20;

const USER_AGENT = "eptruth/1.0 (El Paso Hub news page; +https://elpasohub.org)";

const LOG_PREFIX = "[eptruth/news] Reddit";

/**
 * Hardcoded thumbnail overrides by Reddit post id (`/comments/{id}/` in the URL).
 * Values are paths under `public/` (served as static assets).
 */
const THUMBNAIL_OVERRIDES: Record<string, string> = {
  // https://www.reddit.com/r/ElPaso/comments/1s1mb9l/good_job_el_paso_we_took_one_small_step_towards
  "1s1mb9l": "/images/news/reddit-1s1mb9l.jpg",
};

interface Rss2JsonItem {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  thumbnail?: string;
  description?: string;
  content?: string;
}

function redditPostIdFromUrl(postUrl: string): string | undefined {
  const m = postUrl.match(/\/comments\/([a-z0-9]+)\//i);
  return m?.[1];
}

function applyThumbnailOverride(
  postUrl: string,
  fromFeed: string | undefined,
): string | undefined {
  const id = redditPostIdFromUrl(postUrl);
  if (id && THUMBNAIL_OVERRIDES[id]) {
    return THUMBNAIL_OVERRIDES[id];
  }
  return fromFeed ? sanitizeThumbnailUrl(fromFeed) : undefined;
}

function parseAtomEntries(xml: string): Record<string, unknown>[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: {
      maxEntityCount: 20_000,
      maxTotalExpansions: 20_000,
      maxExpandedLength: 2_000_000,
    },
  });
  const parsed = parser.parse(xml) as { feed?: { entry?: unknown } };
  const raw = parsed.feed?.entry;
  if (!raw) return [];
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [raw as Record<string, unknown>];
}

function atomLinkHref(entry: Record<string, unknown>): string {
  const link = entry.link as { "@_href"?: string } | undefined;
  return link?.["@_href"] ?? "";
}

function categoryTerm(entry: Record<string, unknown>): string | undefined {
  const cat = entry.category as { "@_term"?: string } | Array<{ "@_term"?: string }> | undefined;
  if (!cat) return undefined;
  if (Array.isArray(cat)) {
    return cat.map((c) => c["@_term"]).find(Boolean);
  }
  return cat["@_term"];
}

function isElPasoUrl(url: string): boolean {
  return /\/r\/elpaso\//i.test(url);
}

function isElPasoEntry(entry: Record<string, unknown>): boolean {
  const term = categoryTerm(entry);
  if (term && term.toLowerCase() === "elpaso") return true;
  return isElPasoUrl(atomLinkHref(entry));
}

function thumbnailFromEntry(entry: Record<string, unknown>): string | undefined {
  const media = entry["media:thumbnail"] as { "@_url"?: string } | undefined;
  const url = media?.["@_url"];
  return typeof url === "string" ? sanitizeThumbnailUrl(url) : undefined;
}

/** Fallback when Reddit omits `media:thumbnail` (first `<img>` in entry HTML). */
function firstImageFromContent(html: string): string | undefined {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!m?.[1]) return undefined;
  return sanitizeThumbnailUrl(m[1]);
}

function contentHtml(entry: Record<string, unknown>): string {
  const c = entry.content as { "#text"?: string } | undefined;
  return typeof c?.["#text"] === "string" ? c["#text"] : "";
}

function isVideoPost(html: string): boolean {
  return /v\.redd\.it/i.test(html);
}

function htmlToPlain(html: string, maxLen: number): string | undefined {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return undefined;
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function toISODate(published: string | undefined): string | undefined {
  if (!published) return undefined;
  try {
    return new Date(published).toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

function toNewsLink(args: {
  id: string;
  headline: string;
  url: string;
  published?: string;
  html: string;
  thumbRaw?: string;
}): NewsLink {
  const thumb = applyThumbnailOverride(args.url, args.thumbRaw);
  const video = isVideoPost(args.html);
  return {
    id: args.id,
    headline: args.headline,
    url: args.url,
    outlet: "r/ElPaso",
    publishedAt: toISODate(args.published),
    summary: htmlToPlain(args.html, 280),
    tags: ["reddit", "el-paso"],
    thumbnailUrl: thumb,
    mediaHint: video ? "video" : thumb ? "image" : undefined,
    provenance: "reddit",
  };
}

/** Pure Atom → NewsLink mapping (r/ElPaso only). Exported for tests and refresh tooling. */
export function newsLinksFromAtomXml(xml: string): NewsLink[] {
  return parseAtomEntries(xml)
    .filter(isElPasoEntry)
    .slice(0, MAX_RESULTS)
    .map((entry, i) => {
      const url = atomLinkHref(entry);
      const html = contentHtml(entry);
      return toNewsLink({
        id: `reddit-${String(entry.id ?? i)}`,
        headline: String(entry.title ?? "Untitled"),
        url,
        published: typeof entry.published === "string" ? entry.published : undefined,
        html,
        thumbRaw: thumbnailFromEntry(entry) ?? firstImageFromContent(html),
      });
    });
}

/** Pure rss2json items → NewsLink mapping (r/ElPaso only). */
export function newsLinksFromRss2JsonItems(items: Rss2JsonItem[]): NewsLink[] {
  return items
    .filter((item) => typeof item.link === "string" && isElPasoUrl(item.link))
    .slice(0, MAX_RESULTS)
    .map((item, i) => {
      const url = item.link as string;
      const html = item.content || item.description || "";
      const thumbRaw =
        (typeof item.thumbnail === "string" && item.thumbnail) ||
        firstImageFromContent(html);
      return toNewsLink({
        id: `reddit-${String(item.guid ?? i)}`,
        headline: String(item.title ?? "Untitled"),
        url,
        published: item.pubDate,
        html,
        thumbRaw: thumbRaw || undefined,
      });
    });
}

export function loadRedditElPasoSnapshot(): NewsLink[] {
  const filePath = path.join(process.cwd(), "content", "data", "reddit-elpaso.json");
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<RedditElPasoSnapshotBundle>;
    if (!Array.isArray(parsed.links)) return [];
    return parsed.links
      .filter(
        (link): link is NewsLink =>
          Boolean(link) &&
          typeof link.id === "string" &&
          typeof link.headline === "string" &&
          typeof link.url === "string",
      )
      .map((link) =>
        link.thumbnailUrl
          ? { ...link, thumbnailUrl: sanitizeThumbnailUrl(link.thumbnailUrl) }
          : link,
      );
  } catch (err) {
    console.warn(LOG_PREFIX, "snapshot read failed", err);
    return [];
  }
}

async function fetchFromAtom(): Promise<NewsLink[]> {
  const res = await fetch(SUBMITTED_ATOM, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: NEWS_PAGE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Reddit Atom HTTP ${res.status}`);
  }

  const xml = await res.text();
  if (!xml.includes("<feed") && !xml.trimStart().startsWith("<?xml")) {
    throw new Error("Reddit Atom returned non-XML body");
  }

  return newsLinksFromAtomXml(xml);
}

async function fetchFromRss2Json(): Promise<NewsLink[]> {
  const res = await fetch(RSS2JSON_URL, {
    next: { revalidate: NEWS_PAGE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`rss2json HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    status?: string;
    message?: string;
    items?: Rss2JsonItem[];
  };

  if (data.status !== "ok" || !Array.isArray(data.items)) {
    throw new Error(`rss2json error: ${data.message ?? "invalid response"}`);
  }

  return newsLinksFromRss2JsonItems(data.items);
}

/**
 * Posts by REDDIT_USER filtered to r/ElPaso only.
 * Cascade: direct Atom → rss2json proxy → checked-in snapshot.
 * Throws only when every path yields no posts.
 */
export async function fetchRedditElPasoPosts(
  options?: { loadSnapshot?: () => NewsLink[] },
): Promise<NewsLink[]> {
  const loadSnapshot = options?.loadSnapshot ?? loadRedditElPasoSnapshot;

  try {
    const items = await fetchFromAtom();
    if (items.length > 0) {
      console.info(LOG_PREFIX, "source", "direct");
      return items;
    }
    console.warn(LOG_PREFIX, "direct returned no r/ElPaso posts");
  } catch (err) {
    console.warn(LOG_PREFIX, "direct failed", err);
  }

  try {
    const items = await fetchFromRss2Json();
    if (items.length > 0) {
      console.info(LOG_PREFIX, "source", "proxy");
      return items;
    }
    console.warn(LOG_PREFIX, "proxy returned no r/ElPaso posts");
  } catch (err) {
    console.warn(LOG_PREFIX, "proxy failed", err);
  }

  const snap = loadSnapshot();
  if (snap.length > 0) {
    console.info(LOG_PREFIX, "source", "snapshot");
    return snap;
  }

  throw new Error("Reddit posts unavailable from direct, proxy, and snapshot");
}
