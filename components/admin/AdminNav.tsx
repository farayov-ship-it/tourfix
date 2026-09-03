"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  Car,
  Users,
  Map,
  Star,
  Image,
  Languages,
  Settings,
  MessageSquare,
  FileText,
  HelpCircle,
  Search,
  Building2,
  BookOpen,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Route,
  Car,
  Users,
  Map,
  Star,
  Image,
  Languages,
  Settings,
  MessageSquare,
  FileText,
  HelpCircle,
  Search,
  Building2,
  BookOpen,
  ScrollText,
};

export type AdminNavItem = {
  href: string;
  label: string;
  /** Lucide icon nomi — funksiya emas (RSC serializatsiya uchun) */
  icon: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname() || "/admin";

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = ICONS[item.icon] || LayoutDashboard;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "mb-0.5 flex items-center gap-2 rounded-lg border border-[#B08040]/45 bg-[#002040]/8 px-3 py-2 text-sm font-semibold text-[#002040] shadow-sm"
                : "mb-0.5 flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            }
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${active ? "text-[#B08040]" : "opacity-70"}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
