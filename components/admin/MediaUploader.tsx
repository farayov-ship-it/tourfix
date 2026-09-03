"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  key: string;
  mime: string | null;
  createdAt: string;
};

export default function MediaUploader({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Xato");
        setItems((prev) => [
          {
            id: data.id,
            url: data.url,
            key: data.key,
            mime: data.mime ?? null,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yuklash xatosi");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-6 py-10 transition hover:border-amber-500/50">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        ) : (
          <ImagePlus className="h-8 w-8 text-amber-600" />
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-800">
            {uploading ? "Yuklanmoqda…" : "Rasm yuklash"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">JPG, PNG, WebP — max 8 MB. Bir nechtasini tanlash mumkin.</p>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => void onFiles(e.target.files)}
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt="" className="aspect-square w-full object-cover" />
            <div className="truncate px-2 py-1.5 text-[10px] text-zinc-500">{m.key}</div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-center text-sm text-zinc-500">Hali rasm yo‘q.</p>
      )}
    </div>
  );
}
