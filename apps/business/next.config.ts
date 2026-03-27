import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kebo/shared", "@kebo/ui"],
  reactCompiler: true,
  // Type checking is handled by `tsc --noEmit` with project references,
  // which correctly resolves cross-package @/ path aliases. Next.js's
  // built-in checker doesn't support project references.
  typescript: { ignoreBuildErrors: true },
  experimental: {
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
