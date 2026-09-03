import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import BrandLogo from "@/components/BrandLogo";

const nav = [
  { href: "/admin", label: "Boshqaruv", icon: "LayoutDashboard" },
  { href: "/admin/bookings", label: "Arizalar", icon: "MessageSquare" },
  { href: "/admin/routes", label: "Marshrutlar", icon: "Route" },
  { href: "/admin/vehicles", label: "Avtopark", icon: "Car" },
  { href: "/admin/guides", label: "Gidlar", icon: "Users" },
  { href: "/admin/day-trips", label: "Kunlik sayohatlar", icon: "Map" },
  { href: "/admin/destinations", label: "Manzillar", icon: "Building2" },
  { href: "/admin/reviews", label: "Sharhlar", icon: "Star" },
  { href: "/admin/blog", label: "Blog", icon: "BookOpen" },
  { href: "/admin/media", label: "Rasmlar", icon: "Image" },
  { href: "/admin/translations", label: "Tarjimalar", icon: "FileText" },
  { href: "/admin/faq", label: "Savol-javob", icon: "HelpCircle" },
  { href: "/admin/seo", label: "SEO", icon: "Search" },
  { href: "/admin/cities", label: "Shaharlar", icon: "Building2" },
  { href: "/admin/locales", label: "Tillar", icon: "Languages", ownerOnly: true },
  { href: "/admin/settings", label: "Sozlamalar", icon: "Settings", ownerOnly: true },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: "Users", ownerOnly: true },
  { href: "/admin/audit", label: "Jurnal", icon: "ScrollText", ownerOnly: true },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = session.user.role;
  const items = nav
    .filter((n) => !n.ownerOnly || role === "owner")
    .map(({ href, label, icon }) => ({ href, label, icon }));

  return (
    <div className="admin-shell min-h-screen bg-zinc-100 text-zinc-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-4">
            <Link href="/admin" className="block">
              <BrandLogo variant="full" darkText priority />
            </Link>
            <p className="mt-2 truncate text-xs font-medium text-zinc-600">
              {session.user.email} · {role}
            </p>
          </div>
          <AdminNav items={items} />
          <div className="border-t border-zinc-200 p-3">
            <Link
              href="/uz"
              className="mb-2 block rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            >
              ← Saytga qaytish
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Chiqish
              </button>
            </form>
          </div>
        </aside>
        <main className="flex-1 overflow-x-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
