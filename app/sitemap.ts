import type { MetadataRoute } from "next";
import { siteUrl as base } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/story", "/recipients", "/events", "/give", "/get-involved", "/contact"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/give" ? 0.9 : 0.7,
  }));
}
