import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { cases } from "@/data/cases";

// Built once together with the site: there is no server to make it on request.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    { url: `${site.url}/cases` },
    ...cases.map((item) => ({ url: `${site.url}/cases/${item.slug}` })),
  ];
}
