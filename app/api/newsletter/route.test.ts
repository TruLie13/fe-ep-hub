import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { verifyTurnstileToken } from "@/lib/newsletter/verifyTurnstile";

vi.mock("@/lib/newsletter/verifyTurnstile", () => ({
  verifyTurnstileToken: vi.fn(),
}));

const mockedVerifyTurnstileToken = vi.mocked(verifyTurnstileToken);

const originalEnv = {
  NEWSLETTER_SCRIPT_URL: process.env.NEWSLETTER_SCRIPT_URL,
  NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL: process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
};

function validBody(extra: Record<string, unknown> = {}) {
  return {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "",
    ...extra,
  };
}

async function postJson(body: unknown, headers: HeadersInit = {}) {
  const request = new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return POST(request as never);
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    delete process.env.NEWSLETTER_SCRIPT_URL;
    delete process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    mockedVerifyTurnstileToken.mockReset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NEWSLETTER_SCRIPT_URL = originalEnv.NEWSLETTER_SCRIPT_URL;
    process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL = originalEnv.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.TURNSTILE_SECRET_KEY = originalEnv.TURNSTILE_SECRET_KEY;
    vi.unstubAllGlobals();
  });

  it("returns ok for honeypot submissions", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const res = await postJson(validBody({ website: "bot-filled" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns not_configured when script URL is missing", async () => {
    const res = await postJson(validBody());
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ error: "not_configured" });
  });

  it("returns captcha_misconfigured when site key exists without secret", async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    process.env.NEWSLETTER_SCRIPT_URL = "https://example.com/gas";

    const res = await postJson(validBody());
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ error: "captcha_misconfigured" });
  });

  it("returns captcha when turnstile verification fails", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    process.env.NEWSLETTER_SCRIPT_URL = "https://example.com/gas";
    mockedVerifyTurnstileToken.mockResolvedValue(false);

    const res = await postJson(validBody({ turnstileToken: "bad-token" }), {
      "x-forwarded-for": "203.0.113.10",
    });
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "captcha" });
    expect(mockedVerifyTurnstileToken).toHaveBeenCalledWith("bad-token", "secret", "203.0.113.10");
  });

  it("maps upstream duplicate response to HTTP 409", async () => {
    process.env.NEWSLETTER_SCRIPT_URL = "https://example.com/gas";
    const fetchSpy = vi.fn(async () => ({
      ok: true,
      text: async () => JSON.stringify({ error: "duplicate" }),
    }));
    vi.stubGlobal("fetch", fetchSpy);

    const res = await postJson(validBody());
    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toEqual({ error: "duplicate" });
  });
});
