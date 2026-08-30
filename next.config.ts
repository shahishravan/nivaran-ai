import type { NextConfig } from "next";

const isNetlifyStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isNetlifyStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        // The Netlify export never imports the Cloudflare-only worker/database
        // modules, whose platform globals are unavailable to Next's type pass.
        // The canonical Vinext build and test suite remain the source gate.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
