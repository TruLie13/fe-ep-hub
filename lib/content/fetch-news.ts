import { XMLParser } from "fast-xml-parser";
import type { NewsLink } from "@/content/schema";
import { NEWS_PAGE_REVALIDATE_SECONDS } from "@/lib/constants/news";

const GOOGLE_NEWS_RSS =
  "https://news.google.com/rss/search?" +
  "q=%22data+center%22+(%22El+Paso%22+OR+%22West+Texas%22)&hl=en-US&gl=US&ceid=US:en";
const GOOGLE_NEWS_RSS_NATIONAL =
  "https://news.google.com/rss/search?" +
  "q=%22data+center%22+(%22United+States%22+OR+U.S.+OR+federal+OR+state+OR+Congress+OR+DOE+OR+EPA+OR+FERC+OR+ERCOT+OR+PJM+OR+MISO)+(grid+OR+utility+OR+water+OR+cooling+OR+zoning+OR+permitting+OR+subsidy+OR+emissions+OR+noise)+-El+Paso+-%22West+Texas%22&hl=en-US&gl=US&ceid=US:en";

const LOG_PREFIX = "[eptruth/news] Google News RSS";

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  source?: string | { "#text": string; "@_url"?: string };
}

const RELEVANCE_PATTERN = /data\s*cent/i;
const US_CONTEXT_PATTERN =
  /\b(united\s+states|u\.s\.|us\b|america|american|federal|congress|state|doe|epa|ferc|ercot|pjm|miso)\b/i;

function isRelevant(item: RssItem): boolean {
  const text = `${item.title ?? ""} ${item.description ?? ""}`;
  return RELEVANCE_PATTERN.test(text);
}

function outletName(source: RssItem["source"]): string {
  if (!source) return "Google News";
  if (typeof source === "string") return source;
  return source["#text"] ?? "Google News";
}

/** Google News titles are formatted "Headline - Source Name". Strip the suffix. */
function cleanHeadline(raw: string, outlet: string): string {
  const suffix = ` - ${outlet}`;
  if (raw.endsWith(suffix)) return raw.slice(0, -suffix.length);
  const lastDash = raw.lastIndexOf(" - ");
  if (lastDash > 0) return raw.slice(0, lastDash);
  return raw;
}

function toISODate(rfc822: string | undefined): string | undefined {
  if (!rfc822) return undefined;
  try {
    return new Date(rfc822).toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

function stableId(url: string, index: number): string {
  const slug = url.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 60);
  return `rss-${index}-${slug}`;
}

/**
 * Fetch data-center news from Google News RSS.
 * Throws on HTTP or parse failure so the news page can show a section-level error.
 */
export async function fetchDataCenterNews(): Promise<NewsLink[]> {
  return fetchGoogleNewsRss(GOOGLE_NEWS_RSS);
}

export async function fetchNationalDataCenterNews(): Promise<NewsLink[]> {
  return fetchGoogleNewsRss(GOOGLE_NEWS_RSS_NATIONAL, true);
}

async function fetchGoogleNewsRss(
  url: string,
  usOnly = false,
): Promise<NewsLink[]> {
  const res = await fetch(url, {
    next: { revalidate: NEWS_PAGE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    console.warn(LOG_PREFIX, "HTTP", res.status, res.statusText);
    throw new Error(`Google News RSS HTTP ${res.status}`);
  }

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  let feed: { rss?: { channel?: { item?: RssItem | RssItem[] } } };
  try {
    feed = parser.parse(xml);
  } catch (err) {
    console.warn(LOG_PREFIX, "parse error", err);
    throw err;
  }

  const raw = feed?.rss?.channel?.item;
  const rawItems: RssItem[] = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const items = rawItems;

  const MAX_RESULTS = 20;

  return items
    .filter(isRelevant)
    .filter((item) => {
      if (!usOnly) return true;
      const text = `${item.title ?? ""} ${item.description ?? ""}`;
      return US_CONTEXT_PATTERN.test(text);
    })
    .slice(0, MAX_RESULTS)
    .map(
      (item, i): NewsLink => {
        const outlet = outletName(item.source);
        return {
          id: stableId(String(item.link ?? i), i),
          headline: cleanHeadline(String(item.title ?? "Untitled"), outlet),
          url: String(item.link ?? ""),
          outlet,
          publishedAt: toISODate(item.pubDate),
          summary: undefined,
          tags: ["data-center"],
          provenance: "rss",
        };
      },
    );
}
