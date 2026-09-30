import type { ImageLoaderProps } from "next/image";

// GitHub Pages serves the pre-optimized images without an image server.
export default function staticImageLoader({ src, width }: ImageLoaderProps) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src.replace("-1280.webp", width <= 640 ? "-640.webp" : "-1280.webp")}`;
}
