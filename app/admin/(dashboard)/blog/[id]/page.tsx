import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { BlogForm } from "@/components/admin/forms/BlogForm";
import { BackLink } from "@/components/admin/ListUI";
import { getEnabledLocaleCodes } from "@/lib/admin/locales";
import { parseMap } from "@/components/admin/ui-styles";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, locales] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id }, include: { cover: true } }),
    getEnabledLocaleCodes(),
  ]);
  if (!post) notFound();

  const title = parseMap(post.title);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Maqolani tahrirlash</h1>
          <p className="mt-1 text-sm text-zinc-500">{title.uz || title.en || post.slug}</p>
        </div>
        <BackLink href="/admin/blog" label="Blogga qaytish" />
      </div>
      <BlogForm item={post} locales={locales} />
    </div>
  );
}
