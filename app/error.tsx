"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#faf7f0] px-4 text-center text-zinc-900">
      <h1 className="text-xl font-semibold">Sahifa yuklanmadi</h1>
      <p className="max-w-md text-sm text-zinc-600">
        Vaqtinchalik xato yuz berdi. Sahifani qayta yuklab ko‘ring.
      </p>
      {error?.digest ? (
        <p className="text-[11px] text-zinc-400">Kod: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-[#002040] px-4 py-2 text-sm font-semibold text-white"
      >
        Qayta urinish
      </button>
    </div>
  );
}
