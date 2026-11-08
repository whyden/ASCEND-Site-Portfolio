import type { NextConfig } from "next";

// The site is built as plain files (the "out" folder), so it can live on GitHub Pages.
// On GitHub Pages it sits in a sub-folder named after the repository: the deploy workflow
// passes that folder in NEXT_PUBLIC_BASE_PATH. With an own domain, leave it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  // Every page becomes its own folder with index.html: the safest form for static hosting.
  trailingSlash: true,
  // Plain files have no server to resize pictures, so they are prepared in advance in public/cases.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
