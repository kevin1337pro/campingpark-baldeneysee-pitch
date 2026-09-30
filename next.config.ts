import type { NextConfig } from "next";
const pagesBuild = process.env.GITHUB_PAGES === "1";
const basePath = pagesBuild ? "/campingpark-baldeneysee-pitch" : "";
const config: NextConfig = {
  devIndicators: false,
  turbopack: { root: process.cwd() },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(pagesBuild ? { output: "export", trailingSlash: true } : {}),
  images: pagesBuild
    ? {
        loader: "custom",
        loaderFile: "./lib/static-image-loader.ts",
        deviceSizes: [640, 1280],
        imageSizes: [],
      }
    : { formats: ["image/avif", "image/webp"] },
  ...(!pagesBuild
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
              ],
            },
          ];
        },
      }
    : {}),
};
export default config;
