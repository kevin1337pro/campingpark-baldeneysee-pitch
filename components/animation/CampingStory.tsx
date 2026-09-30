"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const Film = dynamic(() => import("./CampingDay"), {
  ssr: false,
  loading: () => (
    <div className="film-placeholder">Die Campinggeschichte lädt …</div>
  ),
});
export default function CampingStory() {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root}>
      {ready ? (
        <Film />
      ) : (
        <div className="film-placeholder">
          <span>Ein Tag am See.</span>
          <button
            type="button"
            className="button outline"
            onClick={() => setReady(true)}
          >
            Campinggeschichte laden
          </button>
          <small>24 Sekunden · ohne Ton</small>
        </div>
      )}
    </div>
  );
}
