import type { MetadataRoute } from "next";

const baseUrl = "https://elpasocivic.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/learn", "/local-government", "/pledge", "/news", "/city-meetings", "/take-action", "/contribute"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
    lastModified: new Date(),
  }));
}
