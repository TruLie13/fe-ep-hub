import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchRedditElPasoPosts,
  newsLinksFromAtomXml,
  newsLinksFromRss2JsonItems,
} from "./fetch-reddit-elpaso";

const ATOM_EL_PASO_ENTRY = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Community update</title>
    <id>tag:reddit.com,item:abc</id>
    <published>2024-02-01T15:30:00Z</published>
    <link href="https://www.reddit.com/r/ElPaso/comments/xyz789/community_update/"/>
    <category term="elpaso"/>
    <content type="html"><![CDATA[<p>Discussion for r/ElPaso residents.</p>]]></content>
  </entry>
  <entry>
    <title>Other sub post</title>
    <id>tag:reddit.com,item:def</id>
    <published>2024-02-02T15:30:00Z</published>
    <link href="https://www.reddit.com/r/other/comments/aaa/other/"/>
    <content type="html"><![CDATA[<p>Not El Paso.</p>]]></content>
  </entry>
</feed>`;

const SNAPSHOT_LINKS = [
  {
    id: "reddit-snapshot-1",
    headline: "Snapshot post",
    url: "https://www.reddit.com/r/ElPaso/comments/snap1/snapshot_post/",
    outlet: "r/ElPaso",
    tags: ["reddit", "el-paso"],
    provenance: "reddit" as const,
  },
];

describe("newsLinksFromAtomXml", () => {
  it("keeps only r/ElPaso entries", () => {
    const items = newsLinksFromAtomXml(ATOM_EL_PASO_ENTRY);
    expect(items.length).toBe(1);
    expect(items[0]?.headline).toBe("Community update");
    expect(items[0]?.outlet).toBe("r/ElPaso");
    expect(items[0]?.url).toContain("/r/ElPaso/");
    expect(items[0]?.provenance).toBe("reddit");
    expect(items[0]?.tags).toContain("reddit");
  });
});

describe("newsLinksFromRss2JsonItems", () => {
  it("keeps only r/ElPaso links", () => {
    const items = newsLinksFromRss2JsonItems([
      {
        title: "From proxy",
        link: "https://www.reddit.com/r/ElPaso/comments/pxy/from_proxy/",
        guid: "proxy-1",
        pubDate: "2024-03-01T12:00:00Z",
        description: "<p>Hello</p>",
      },
      {
        title: "Other",
        link: "https://www.reddit.com/r/other/comments/zzz/other/",
        guid: "proxy-2",
      },
    ]);
    expect(items.length).toBe(1);
    expect(items[0]?.headline).toBe("From proxy");
    expect(items[0]?.id).toBe("reddit-proxy-1");
  });
});

describe("fetchRedditElPasoPosts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses direct Atom when available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(ATOM_EL_PASO_ENTRY, { status: 200 }),
    );

    const items = await fetchRedditElPasoPosts({
      loadSnapshot: () => [],
    });

    expect(items.length).toBe(1);
    expect(items[0]?.headline).toBe("Community update");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to rss2json when Atom fails", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "ok",
            items: [
              {
                title: "Proxy post",
                link: "https://www.reddit.com/r/ElPaso/comments/abc/proxy_post/",
                guid: "guid-abc",
                pubDate: "2024-04-01T12:00:00Z",
                description: "<p>Via proxy</p>",
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    const items = await fetchRedditElPasoPosts({
      loadSnapshot: () => [],
    });

    expect(items.length).toBe(1);
    expect(items[0]?.headline).toBe("Proxy post");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("falls back to snapshot when direct and proxy fail", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 502 }));

    const items = await fetchRedditElPasoPosts({
      loadSnapshot: () => SNAPSHOT_LINKS,
    });

    expect(items).toEqual(SNAPSHOT_LINKS);
  });

  it("throws when direct, proxy, and snapshot are all empty", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(new Response(null, { status: 502 }));

    await expect(
      fetchRedditElPasoPosts({ loadSnapshot: () => [] }),
    ).rejects.toThrow(/unavailable/);
  });
});
