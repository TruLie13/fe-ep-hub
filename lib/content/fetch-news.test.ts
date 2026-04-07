import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDataCenterNews, fetchNationalDataCenterNews } from "./fetch-news";

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

const RSS_NATIONAL_US_AND_NON_US = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Google News</title>
    <item>
      <title>U.S. grid warns about data center demand - Reuters</title>
      <link>https://news.google.com/rss/articles/CBMiexample?oc=5</link>
      <pubDate>Mon, 15 Jan 2024 18:00:00 GMT</pubDate>
      <description>Federal and state agencies review power needs.</description>
      <source url="https://www.reuters.com">Reuters</source>
    </item>
    <item>
      <title>Finland announces new data center project - Nordic Wire</title>
      <link>https://news.example.com/fi</link>
      <pubDate>Tue, 16 Jan 2024 18:00:00 GMT</pubDate>
      <description>A regional update from northern Europe.</description>
      <source url="https://example.com">Nordic Wire</source>
    </item>
    <item>
      <title>U.S. policy debate on data center subsidies - Unknown Blog</title>
      <link>https://unknownblog.example/us-policy</link>
      <pubDate>Tue, 16 Jan 2024 18:00:00 GMT</pubDate>
      <description>Congress and federal agencies discuss new rules.</description>
      <source url="https://unknownblog.example">Unknown Blog</source>
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

  it("uses national RSS query when fetching national coverage", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(RSS_NATIONAL_US_AND_NON_US, { status: 200 }),
    );

    const items = await fetchNationalDataCenterNews();

    expect(items.length).toBe(2);
    expect(items.some((x) => x.outlet === "Reuters")).toBe(true);
    expect(items.some((x) => x.outlet === "Unknown Blog")).toBe(true);
    const calledUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("news.google.com/rss/search?");
    expect(calledUrl).toContain("%22data+center%22");
    expect(calledUrl).toContain("-El+Paso");
  });
});
