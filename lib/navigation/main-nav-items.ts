import type { Dictionary } from "@/lib/i18n/dictionary";

export type MainNavItem = {
  href: string;
  label: string;
};

export function getMainNavItems(nav: Dictionary["nav"]): MainNavItem[] {
  return [
    { href: "/", label: nav.home },
    { href: "/learn", label: nav.learn },
    { href: "/data-center", label: nav.dataCenters },
    { href: "/local-government", label: nav.government },
    { href: "/city-meetings", label: nav.meetings },
    { href: "/news", label: nav.news },
    { href: "/support", label: nav.support },
  ];
}
