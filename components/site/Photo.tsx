import Image from "next/image";
export default function Photo({
  name,
  alt,
  priority = false,
  className = "",
}: {
  name: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={`/images/camping/${name}-1280.webp`}
        alt={alt}
        fill
        sizes={priority ? "100vw" : "(max-width: 700px) 100vw, 60vw"}
        priority={priority}
      />
    </div>
  );
}
