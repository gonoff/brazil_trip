import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Use webpack for production builds (required for Serwist/PWA)
  // Turbopack is still used in development mode
  turbopack: {},
};

export default withSerwist(nextConfig);
