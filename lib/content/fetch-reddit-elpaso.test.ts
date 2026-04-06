import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRedditElPasoPosts } from "./fetch-reddit-elpaso";

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

describe("fetchRedditElPasoPosts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses Atom and keeps only r/ElPaso entries", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(ATOM_EL_PASO_ENTRY, { status: 200 }),
    );

    const items = await fetchRedditElPasoPosts();

    expect(items.length).toBe(1);
    expect(items[0]?.headline).toBe("Community update");
    expect(items[0]?.outlet).toBe("r/ElPaso");
    expect(items[0]?.url).toContain("/r/ElPaso/");
    expect(items[0]?.provenance).toBe("reddit");
    expect(items[0]?.tags).toContain("reddit");
  });

  it("throws when HTTP fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 502 }),
    );

    await expect(fetchRedditElPasoPosts()).rejects.toThrow(/HTTP 502/);
  });
});
