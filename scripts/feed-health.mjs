#!/usr/bin/env node
/**
 * Smoke-check external news feeds. Exit 1 if any request is not OK.
 * Keep URLs aligned with lib/content/fetch-news.ts and fetch-reddit-elpaso.ts.
 */

const UA = "eptruth-feed-health/1.0";

const URLS = [
  "https://news.google.com/rss/search?q=%22data+center%22+(%22El+Paso%22+OR+%22West+Texas%22)&hl=en-US&gl=US&ceid=US:en",
  "https://www.reddit.com/user/Tru_Lie/submitted.rss",
];

async function main() {
  for (const url of URLS) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      redirect: "follow",
    });
    if (!res.ok) {
      console.error(`[feed-health] FAIL ${res.status} ${url}`);
      process.exit(1);
    }
  }
  console.log("[feed-health] OK", URLS.length, "feeds");
}

main().catch((e) => {
  console.error("[feed-health]", e);
  process.exit(1);
});
