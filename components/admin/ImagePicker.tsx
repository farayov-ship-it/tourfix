"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Library, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaItem = { id: string; url: string; key: string; mime?: string | null };

type Props = {
  name?: string;
  defaultId?: string | null;
  defaultUrl?: string | null;
  label?: string;
  className?: string;
};

export default function ImagePicker({
  name = "imageId",
  defaultId,
  defaultUrl,
  label = "Rasm",
  className,
}: Props) {
  const [id, setId] = useState(defaultId ?? "");
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [error, setError] = useState("");

  const loadLibrary = useCallback(async () => {
    setLoadingLib(true);
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      setLibrary(Array.isArray(data) ? data : []);
    } catch {
      setError("Kutubxonani yuklab bo‘lmadi");
    } finally {
      setLoadingLib(false);
    }
  }, []);

  useEffect(() => {
    if (libraryOpen && library.length === 0) void loadLibrary();
  }, [libraryOpen, library.length, loadLibrary]);

  async function onFile(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yuklash xatosi");
      setId(data.id);
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yuklash xatosi");
    } finally {
      setUploading(false);
    }
  }

  function pick(item: MediaItem) {
    setId(item.id);
    setUrl(item.url);
    setLibraryOpen(false);
  }

  function clear() {
    setId("");
    setUrl("");
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <input type="hidden" name={name} value={id} />

      <div className="flex flex-wrap items-start gap-3">
        <div className="relative flex h-28 w-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-[11px] text-zinc-600">Rasm yo‘q</span>
          )}
          {url && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-zinc-800 hover:bg-red-600"
              aria-label="Olib tashlash"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {uploading ? "Yuklanmoqda…" : "Rasm yuklash"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100"
          >
            <Library className="h-3.5 w-3.5" />
            Kutubxonadan tanlash
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {libraryOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setLibraryOpen(false)} />
          <div className="relative z-10 flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-300 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h3 className="font-medium text-zinc-900">Media kutubxonasi</h3>
              <button type="button" onClick={() => setLibraryOpen(false)} className="rounded-lg p-1 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              {loadingLib ? (
                <p className="text-sm text-zinc-500">Yuklanmoqda…</p>
              ) : library.length === 0 ? (
                <p className="text-sm text-zinc-500">Hali rasm yo‘q. Avval yuklang.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {library.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => pick(m)}
                      className={cn(
                        "overflow-hidden rounded-lg border border-zinc-300 transition hover:border-amber-500",
                        id === m.id && "ring-2 ring-amber-500"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
