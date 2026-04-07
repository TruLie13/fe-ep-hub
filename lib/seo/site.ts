import type { Metadata } from "next";

export const SEO_SITE_URL = "https://elpasohub.org";
export const SEO_SITE_NAME = "El Paso Hub";

const PERSON = {
  "@type": "Person",
  name: "Jonathan Zayan",
  jobTitle: "Founder and Full Stack Engineer",
  sameAs: ["https://pi-que.com/", "https://www.linkedin.com/in/jzayan/"],
} as const;

const EL_PASO_HUB_ORG = {
  "@type": "Organization",
  name: "El Paso Hub",
  url: "https://elpasohub.org",
  address: {
    "@type": "PostalAddress",
    addressLocality: "El Paso",
    addressRegion: "TX",
    addressCountry: "US",
  },
} as const;

const PIQUE_ORG = {
  "@type": "Organization",
  name: "pi.que llc",
  url: "https://pi-que.com",
} as const;

const WEBSITE_ID = `${SEO_SITE_URL}/#website`;
const EL_PASO_HUB_ORGANIZATION_ID = `${SEO_SITE_URL}/#organization`;
const PIQUE_ORGANIZATION_ID = `${SEO_SITE_URL}/#builder-organization`;
const AUTHOR_ID = `${SEO_SITE_URL}/#author`;

type SchemaPageType =
  | "WebPage"
  | "CollectionPage"
  | "AboutPage"
  | "ContactPage";

export type PageSeo = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  schemaType?: SchemaPageType;
};

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SEO_SITE_URL),
    title: {
      default: `${SEO_SITE_NAME} | Responsible Data Center Policy`,
      template: `%s | ${SEO_SITE_NAME}`,
    },
    description:
      "A community education and advocacy site focused on responsible data center policy, water stewardship, and transparent local civic engagement.",
    applicationName: SEO_SITE_NAME,
    authors: [{ name: PERSON.name, url: PERSON.sameAs[1] }],
    creator: PERSON.name,
    publisher: EL_PASO_HUB_ORG.name,
    openGraph: {
      type: "website",
      siteName: SEO_SITE_NAME,
      locale: "en_US",
      title: `${SEO_SITE_NAME} | Responsible Data Center Policy`,
      description:
        "Plain-language resources and local civic information on data center impacts in El Paso.",
      url: SEO_SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SEO_SITE_NAME} | Responsible Data Center Policy`,
      description:
        "Learn the local impact of data centers, find official contacts, and support responsible technology growth.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildPageMetadata(page: PageSeo): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    authors: [{ name: PERSON.name, url: PERSON.sameAs[1] }],
    creator: PERSON.name,
    publisher: EL_PASO_HUB_ORG.name,
    openGraph: {
      type: "website",
      siteName: SEO_SITE_NAME,
      locale: "en_US",
      title: page.title,
      description: page.description,
      url: page.path,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildPageJsonLd(page: PageSeo) {
  const pageUrl = `${SEO_SITE_URL}${page.path === "/" ? "" : page.path}`;
  const pageId = `${pageUrl}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SEO_SITE_URL,
        name: SEO_SITE_NAME,
        publisher: { "@id": EL_PASO_HUB_ORGANIZATION_ID },
        creator: { "@id": PIQUE_ORGANIZATION_ID },
        author: { "@id": AUTHOR_ID },
      },
      {
        "@id": EL_PASO_HUB_ORGANIZATION_ID,
        ...EL_PASO_HUB_ORG,
        founder: { "@id": AUTHOR_ID },
      },
      {
        "@id": PIQUE_ORGANIZATION_ID,
        ...PIQUE_ORG,
        founder: { "@id": AUTHOR_ID },
      },
      {
        "@id": AUTHOR_ID,
        ...PERSON,
      },
      {
        "@type": page.schemaType ?? "WebPage",
        "@id": pageId,
        url: pageUrl,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@id": AUTHOR_ID },
        creator: { "@id": PIQUE_ORGANIZATION_ID },
        publisher: { "@id": EL_PASO_HUB_ORGANIZATION_ID },
      },
    ],
  };
}

export function buildSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SEO_SITE_URL,
        name: SEO_SITE_NAME,
        publisher: { "@id": EL_PASO_HUB_ORGANIZATION_ID },
        creator: { "@id": PIQUE_ORGANIZATION_ID },
        author: { "@id": AUTHOR_ID },
      },
      {
        "@id": EL_PASO_HUB_ORGANIZATION_ID,
        ...EL_PASO_HUB_ORG,
        founder: { "@id": AUTHOR_ID },
      },
      {
        "@id": PIQUE_ORGANIZATION_ID,
        ...PIQUE_ORG,
        founder: { "@id": AUTHOR_ID },
      },
      {
        "@id": AUTHOR_ID,
        ...PERSON,
      },
    ],
  };
}
