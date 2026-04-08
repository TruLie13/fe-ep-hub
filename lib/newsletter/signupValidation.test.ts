import { describe, expect, it } from "vitest";
import {
  formatUsPhone,
  isValidSignupEmail,
  isValidSignupName,
  sanitizePhoneDigits,
} from "./signupValidation";

describe("isValidSignupName", () => {
  it("accepts ASCII letters only", () => {
    expect(isValidSignupName("Jane")).toBe(true);
    expect(isValidSignupName("McDonald")).toBe(true);
  });
  it("rejects spaces, digits, punctuation", () => {
    expect(isValidSignupName("")).toBe(false);
    expect(isValidSignupName("Anne Marie")).toBe(false);
    expect(isValidSignupName("O'Brien")).toBe(false);
    expect(isValidSignupName("J2")).toBe(false);
  });
});

describe("isValidSignupEmail", () => {
  it("accepts common shapes", () => {
    expect(isValidSignupEmail("a@b.co")).toBe(true);
    expect(isValidSignupEmail("user.name+tag@example.com")).toBe(true);
  });
  it("rejects obvious non-emails", () => {
    expect(isValidSignupEmail("")).toBe(false);
    expect(isValidSignupEmail("nodomain")).toBe(false);
    expect(isValidSignupEmail("a@b")).toBe(false);
    expect(isValidSignupEmail("a @b.co")).toBe(false);
  });
});

describe("phone helpers", () => {
  it("sanitizes to digits capped at 10", () => {
    expect(sanitizePhoneDigits("(555) abc-123-4567")).toBe("5551234567");
    expect(sanitizePhoneDigits("123456789012")).toBe("1234567890");
  });
  it("drops leading US country code 1 when autofill sends 11 digits", () => {
    expect(sanitizePhoneDigits("+1 (555) 123-4567")).toBe("5551234567");
    expect(sanitizePhoneDigits("15551234567")).toBe("5551234567");
  });
  it("formats US display", () => {
    expect(formatUsPhone("")).toBe("");
    expect(formatUsPhone("555")).toBe("(555");
    expect(formatUsPhone("5551234")).toBe("(555) 123-4");
    expect(formatUsPhone("5551234567")).toBe("(555) 123-4567");
  });
});
