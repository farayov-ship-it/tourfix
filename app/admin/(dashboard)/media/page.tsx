import { prisma } from "@/lib/db/prisma";
import MediaUploader from "@/components/admin/MediaUploader";

export default async function MediaAdminPage() {
  const items = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media kutubxonasi</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Rasmlarni yuklang — keyin marshrut, avto, gid formalaridan tanlaysiz
        </p>
      </div>
      <MediaUploader
        initial={items.map((m) => ({
          id: m.id,
          url: m.url,
          key: m.key,
          mime: m.mime,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
