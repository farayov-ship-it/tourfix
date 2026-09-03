export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-zinc-200" />
      <div className="h-4 w-72 rounded bg-zinc-200" />
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 h-10 rounded-lg bg-zinc-100" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-zinc-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
