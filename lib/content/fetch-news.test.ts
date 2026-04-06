import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDataCenterNews } from "./fetch-news";

const RSS_WITH_RELEVANT_AND_NOISE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Google News</title>
    <item>
      <title>New data center in West Texas - Example Times</title>
      <link>https://news.example.com/a</link>
      <pubDate>Mon, 15 Jan 2024 18:00:00 GMT</pubDate>
      <description>Construction near El Paso region.</description>
      <source url="https://example.com">Example Times</source>
    </item>
    <item>
      <title>Local sports roundup</title>
      <link>https://news.example.com/b</link>
      <pubDate>Tue, 16 Jan 2024 18:00:00 GMT</pubDate>
      <description>Scores unrelated to infrastructure.</description>
    </item>
  </channel>
</rss>`;

describe("fetchDataCenterNews", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses RSS and keeps only data-center-relevant items", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(RSS_WITH_RELEVANT_AND_NOISE, { status: 200 }),
    );

    const items = await fetchDataCenterNews();

    expect(items.length).toBe(1);
    expect(items[0]?.headline).toContain("data center");
    expect(items[0]?.url).toBe("https://news.example.com/a");
    expect(items[0]?.outlet).toBe("Example Times");
    expect(items[0]?.provenance).toBe("rss");
    expect(items[0]?.tags).toContain("data-center");
  });

  it("throws when HTTP fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 503 }),
    );

    await expect(fetchDataCenterNews()).rejects.toThrow(/HTTP 503/);
  });
});
