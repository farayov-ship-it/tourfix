import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** full = emblem + matn; icon = katta emblem; mark = kichik emblem */
  variant?: "icon" | "full" | "mark";
  className?: string;
  priority?: boolean;
  /** Matn rangini tema o‘rniga majburiy (admin light UI) */
  darkText?: boolean;
};

export const BRAND = {
  name: "TurkUztan",
  tagline: "TRAVEL",
  src: "/brand/turkuztan-logo.png",
  navy: "#002040",
  gold: "#B08040",
} as const;

export default function BrandLogo({
  variant = "full",
  className,
  priority,
  darkText = false,
}: BrandLogoProps) {
  const emblem = (size: "sm" | "md") => (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_1px_rgba(176,128,64,0.35)]",
        size === "sm" ? "h-9 w-9" : "h-11 w-11 sm:h-12 sm:w-12",
      )}
    >
      <Image
        src={BRAND.src}
        alt={variant === "full" ? "" : BRAND.name}
        width={size === "sm" ? 36 : 48}
        height={size === "sm" ? 36 : 48}
        className="h-[92%] w-[92%] object-contain"
        priority={priority}
      />
    </span>
  );

  if (variant === "mark") {
    return <span className={className}>{emblem("sm")}</span>;
  }

  if (variant === "icon") {
    return <span className={className}>{emblem("md")}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {emblem("md")}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight sm:text-xl",
            darkText ? "text-[#002040]" : "text-sand-50",
          )}
        >
          {BRAND.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-[0.32em]",
            darkText ? "text-[#B08040]" : "text-gold-500",
          )}
        >
          {BRAND.tagline}
        </span>
      </span>
    </span>
  );
}

/** Logo ostidagi tillarang chiziq + romb (faqat logo temasida CSS ko‘rsatadi) */
export function BrandOrnament({ className }: { className?: string }) {
  return (
    <div className={cn("brand-ornament hidden [[data-theme=logo]_&]:flex", className)} aria-hidden>
      <span className="brand-ornament-mark" />
    </div>
  );
}
