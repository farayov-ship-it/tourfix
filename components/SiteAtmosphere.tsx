/** Subtle fixed atmosphere — colors follow data-theme */
export default function SiteAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="theme-atmosphere absolute inset-0 transition-[background] duration-500" />

      <svg
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: "var(--pattern-opacity)" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="uz-girih"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke="var(--pattern-stroke)"
              strokeWidth="0.7"
              opacity="0.55"
            />
            <path
              d="M28 12 L52 12 L68 28 L68 52 L52 68 L28 68 L12 52 L12 28 Z"
              fill="none"
              stroke="var(--pattern-stroke)"
              strokeWidth="0.75"
              opacity="0.7"
            />
            <path
              d="M40 18 L44 32 L58 28 L48 40 L58 52 L44 48 L40 62 L36 48 L22 52 L32 40 L22 28 L36 32 Z"
              fill="none"
              stroke="var(--pattern-stroke)"
              strokeWidth="0.9"
            />
            <path
              d="M40 30 L50 40 L40 50 L30 40 Z"
              fill="none"
              stroke="var(--pattern-stroke)"
              strokeWidth="0.55"
              opacity="0.65"
            />
            <circle
              cx="40"
              cy="40"
              r="2.2"
              fill="none"
              stroke="var(--pattern-stroke)"
              strokeWidth="0.5"
              opacity="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#uz-girih)" />
      </svg>

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sand-950/50 to-transparent" />
    </div>
  );
}
