import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Built once together with the site: there is no server to make it on request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
