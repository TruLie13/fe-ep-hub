import InstagramIcon from "@mui/icons-material/Instagram";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { Link } from "@mui/material";

const outboundProfileLinkSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  fontWeight: 600,
  verticalAlign: "baseline",
  textUnderlineOffset: "0.2em",
} as const;

/** Host + TLD only (no path), strips leading www. */
export function websiteHostDisplay(href: string): string {
  try {
    const u = new URL(href);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return href;
  }
}

/** Host + path for short links (e.g. linktr.ee/handle). */
export function linktreeDisplay(href: string): string {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./i, "");
    const path = u.pathname.replace(/\/$/, "");
    return path ? `${host}${path}` : host;
  } catch {
    return href;
  }
}

export function instagramHandleFromUrl(href: string): string {
  try {
    const part = new URL(href).pathname.split("/").filter(Boolean)[0];
    return part ? `@${part}` : "Instagram";
  } catch {
    return "Instagram";
  }
}

export type OutboundProfileLinkItem =
  | { kind: "website"; href: string; ariaLabel: string }
  | { kind: "linktree"; href: string; ariaLabel: string }
  | { kind: "instagram"; href: string; handle: string; ariaLabel: string };

type OutboundProfileLinkProps = {
  item: OutboundProfileLinkItem;
};

/**
 * External website / Instagram / Linktree row used on Take Action volunteer cards
 * and candidate profiles. Globe = website, Instagram glyph = social, chain = Linktree.
 */
export default function OutboundProfileLink({ item }: OutboundProfileLinkProps) {
  if (item.kind === "instagram") {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        underline="hover"
        aria-label={item.ariaLabel}
        sx={outboundProfileLinkSx}
      >
        <InstagramIcon sx={{ fontSize: "1.125rem", flexShrink: 0 }} aria-hidden />
        {item.handle}
      </Link>
    );
  }

  const label = item.kind === "website" ? websiteHostDisplay(item.href) : linktreeDisplay(item.href);
  const Icon = item.kind === "website" ? PublicRoundedIcon : LinkRoundedIcon;

  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      underline="hover"
      aria-label={item.ariaLabel}
      sx={outboundProfileLinkSx}
    >
      <Icon sx={{ fontSize: "1.125rem", flexShrink: 0 }} aria-hidden />
      {label}
    </Link>
  );
}
