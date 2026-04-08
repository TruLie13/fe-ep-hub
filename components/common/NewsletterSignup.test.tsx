/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({
    onSuccess,
    onExpire,
    onError,
  }: {
    onSuccess?: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSuccess?.("token-123")}>
        Solve turnstile
      </button>
      <button type="button" onClick={() => onExpire?.()}>
        Expire turnstile
      </button>
      <button type="button" onClick={() => onError?.()}>
        Error turnstile
      </button>
    </div>
  ),
}));

const originalEnv = {
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_NEWSLETTER_ENABLED: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED,
  NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL: process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL,
};

async function loadSignup() {
  vi.resetModules();
  const mod = await import("./NewsletterSignup");
  return mod.default;
}

function fillValidFields() {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
}

describe("NewsletterSignup", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED;
    delete process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED = originalEnv.NEXT_PUBLIC_NEWSLETTER_ENABLED;
    process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL = originalEnv.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL;
  });

  it("shows config warning when newsletter is not configured", async () => {
    const NewsletterSignup = await loadSignup();
    render(<NewsletterSignup />);

    expect(screen.getByText(/Newsletter signups need a server env/i)).toBeInTheDocument();
  });

  it("submits valid form and shows success state", async () => {
    process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED = "true";
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);

    const NewsletterSignup = await loadSignup();
    render(<NewsletterSignup />);
    fillValidFields();
    fireEvent.click(screen.getByRole("button", { name: "Join the Hub" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.objectContaining({ method: "POST" }),
      );
    });
    expect(await screen.findByText("Welcome to the Hub")).toBeInTheDocument();
    expect(screen.getByText("Thanks for signing up!")).toBeInTheDocument();
  });

  it("shows duplicate email message when API returns duplicate", async () => {
    process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED = "true";
    const fetchMock = vi.fn(async () => ({ ok: false, json: async () => ({ error: "duplicate" }) }));
    vi.stubGlobal("fetch", fetchMock);

    const NewsletterSignup = await loadSignup();
    render(<NewsletterSignup />);
    fillValidFields();
    fireEvent.click(screen.getByRole("button", { name: "Join the Hub" }));

    expect(await screen.findByText("That email is already on our list. You do not need to sign up again.")).toBeInTheDocument();
  });

  it("requires turnstile token before submit when configured", async () => {
    process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED = "true";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);

    const NewsletterSignup = await loadSignup();
    render(<NewsletterSignup />);
    fillValidFields();

    const submit = screen.getByRole("button", { name: "Join the Hub" });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Solve turnstile" }));
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
