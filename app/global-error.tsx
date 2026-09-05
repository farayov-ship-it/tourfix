"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uz">
      <body className="flex min-h-screen items-center justify-center bg-[#111] px-4 text-center text-white">
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">Sayt yuklanmadi</h1>
          <p className="text-sm text-white/70">Brauzer keshini tozalab yoki qayta yuklang.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[#B08040] px-4 py-2 text-sm font-semibold text-white"
          >
            Qayta urinish
          </button>
        </div>
      </body>
    </html>
  );
}
