import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseNewsletterBody } from "@/lib/newsletter/parseNewsletterBody";
import { parseGasWebAppResponse } from "@/lib/newsletter/parseGasWebAppResponse";
import { verifyTurnstileToken } from "@/lib/newsletter/verifyTurnstile";

function newsletterScriptUrl(): string {
  return (
    process.env.NEWSLETTER_SCRIPT_URL?.trim() ||
    process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL?.trim() ||
    ""
  );
}

function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = raw as Record<string, unknown>;

  const hp = typeof o.website === "string" ? o.website.trim() : "";
  if (hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const payload = parseNewsletterBody(o);
  if (!payload) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (turnstileSiteKey && !turnstileSecret) {
    return NextResponse.json({ error: "captcha_misconfigured" }, { status: 503 });
  }
  if (turnstileSecret) {
    const token = typeof o.turnstileToken === "string" ? o.turnstileToken.trim() : "";
    if (
      !token ||
      !(await verifyTurnstileToken(token, turnstileSecret, clientIp(request)))
    ) {
      return NextResponse.json({ error: "captcha" }, { status: 400 });
    }
  }

  const scriptUrl = newsletterScriptUrl();
  if (!scriptUrl) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = JSON.stringify({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
  });

  try {
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body,
    });

    const text = await upstream.text();
    const gas = parseGasWebAppResponse(text);

    if (gas.kind === "duplicate") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }
    if (gas.kind === "ok") {
      return NextResponse.json({ ok: true });
    }

    if (!upstream.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
