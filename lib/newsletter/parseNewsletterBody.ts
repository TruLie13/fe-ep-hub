import { isValidSignupEmail, isValidSignupName } from "@/lib/newsletter/signupValidation";

export type NewsletterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  /** Ten digits or empty */
  phone: string;
};

export function parseNewsletterBody(o: Record<string, unknown>): NewsletterPayload | null {
  if (typeof o.firstName !== "string" || typeof o.lastName !== "string" || typeof o.email !== "string") {
    return null;
  }
  const { firstName, lastName, email } = o;
  let phone = typeof o.phone === "string" ? o.phone.replace(/\D/g, "") : "";
  if (phone.length === 11 && phone.startsWith("1")) {
    phone = phone.slice(1);
  }
  phone = phone.slice(0, 10);

  if (!isValidSignupName(firstName) || !isValidSignupName(lastName)) return null;
  if (!isValidSignupEmail(email)) return null;
  if (phone.length !== 0 && phone.length !== 10) return null;

  return {
    firstName,
    lastName,
    email: email.trim(),
    phone,
  };
}
