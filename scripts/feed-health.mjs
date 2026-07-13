#!/usr/bin/env node
/**
 * Smoke-check external news feeds. Exit 1 if Google News fails, or if both
 * Reddit Atom and rss2json fail. Keep URLs aligned with lib/content fetchers.
 *
 * Reddit Atom often fails from datacenter IPs; rss2json is the production bandaid.
 */

const UA = "eptruth-feed-health/1.0 (+https://elpasohub.org)";

const GOOGLE_NEWS =
  "https://news.google.com/rss/search?q=%22data+center%22+(%22El+Paso%22+OR+%22West+Texas%22)&hl=en-US&gl=US&ceid=US:en";
const REDDIT_ATOM = "https://www.reddit.com/user/Tru_Lie/submitted.rss";
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(REDDIT_ATOM)}`;

async function check(label, url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  if (!res.ok) {
    console.error(`[feed-health] FAIL ${label} ${res.status} ${url}`);
    return false;
  }
  console.log(`[feed-health] OK ${label}`);
  return true;
}

async function main() {
  const googleOk = await check("google-news", GOOGLE_NEWS);
  const atomOk = await check("reddit-atom", REDDIT_ATOM);
  const proxyOk = await check("rss2json", RSS2JSON);

  if (!googleOk) process.exit(1);
  if (!atomOk && !proxyOk) {
    console.error("[feed-health] FAIL Reddit: both Atom and rss2json failed");
    process.exit(1);
  }
  if (!atomOk) {
    console.warn(
      "[feed-health] WARN Reddit Atom blocked; rss2json OK (expected on some hosts)",
    );
  }
  console.log("[feed-health] OK");
}

main().catch((e) => {
  console.error("[feed-health]", e);
  process.exit(1);
});
