import { XMLParser } from "fast-xml-parser";
import type { NewsLink } from "@/content/schema";
import { NEWS_PAGE_REVALIDATE_SECONDS } from "@/lib/constants/news";

const REDDIT_USER = "Tru_Lie";
const SUBMITTED_ATOM = `https://www.reddit.com/user/${REDDIT_USER}/submitted.rss`;
const MAX_RESULTS = 20;

const USER_AGENT = "eptruth/1.0 (El Paso Hub news page; +https://github.com/)";

const LOG_PREFIX = "[eptruth/news] Reddit Atom";

/**
 * Hardcoded thumbnail overrides by Reddit post id (`/comments/{id}/` in the URL).
 * Values are paths under `public/` (served as static assets).
 */
const THUMBNAIL_OVERRIDES: Record<string, string> = {
  // https://www.reddit.com/r/ElPaso/comments/1s1mb9l/good_job_el_paso_we_took_one_small_step_towards
  "1s1mb9l": "/images/news/reddit-1s1mb9l.jpg",
};

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
  return fromFeed;
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

function isElPasoEntry(entry: Record<string, unknown>): boolean {
  const term = categoryTerm(entry);
  if (term && term.toLowerCase() === "elpaso") return true;
  return /\/r\/elpaso\//i.test(atomLinkHref(entry));
}

function thumbnailFromEntry(entry: Record<string, unknown>): string | undefined {
  const media = entry["media:thumbnail"] as { "@_url"?: string } | undefined;
  const url = media?.["@_url"];
  return typeof url === "string" ? url : undefined;
}

/** Fallback when Reddit omits `media:thumbnail` (first `<img>` in entry HTML). */
function firstImageFromContent(html: string): string | undefined {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!m?.[1]) return undefined;
  return m[1].replace(/&amp;/g, "&");
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

/**
 * Posts by REDDIT_USER filtered to r/ElPaso only (Atom category or URL).
 * Thumbnail URL (in order): optional `THUMBNAIL_OVERRIDES` by post id, then Atom
 * `media:thumbnail` `@url`, else first `<img src>` in `content`.
 * Reddit usually sends one preview per post; there is no multi-size picker in this feed.
 * Free, no Reddit API key.
 */
export async function fetchRedditElPasoPosts(): Promise<NewsLink[]> {
  const res = await fetch(SUBMITTED_ATOM, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: NEWS_PAGE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    console.warn(LOG_PREFIX, "HTTP", res.status, res.statusText);
    throw new Error(`Reddit Atom HTTP ${res.status}`);
  }

  const xml = await res.text();

  let entries: Record<string, unknown>[];
  try {
    entries = parseAtomEntries(xml);
  } catch (err) {
    console.warn(LOG_PREFIX, "parse error", err);
    throw err;
  }

  return entries
    .filter(isElPasoEntry)
    .slice(0, MAX_RESULTS)
    .map((entry, i): NewsLink => {
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
        publishedAt: toISODate(
          typeof entry.published === "string" ? entry.published : undefined,
        ),
        summary: htmlToPlain(html, 280),
        tags: ["reddit", "el-paso"],
        thumbnailUrl: thumb,
        mediaHint: video ? "video" : thumb ? "image" : undefined,
        provenance: "reddit",
      };
    });
}
