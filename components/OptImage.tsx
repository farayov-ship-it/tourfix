"use client";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  zoom?: boolean;
  /** Fill parent (parent must be position:relative + sized) */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

/**
 * Lightweight image — direct CDN URL (no Next optimizer breakage).
 * Zoom is clipped inside an overflow-hidden wrapper so hover never opens a gap.
 */
export default function OptImage({
  src,
  alt,
  className,
  imgClassName,
  zoom = false,
  fill = false,
  priority = false,
}: Props) {
  const zoomClass = zoom
    ? "transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.045]"
    : "";

  // Fill parent — clip zoom inside wrapper so siblings (card footer) stay sealed
  if (fill) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover",
            zoomClass,
            imgClassName
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-sand-900", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-auto w-full object-cover", zoomClass, imgClassName)}
      />
    </div>
  );
}
