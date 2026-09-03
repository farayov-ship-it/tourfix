import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  FileEdit,
  Inbox,
  MessageSquare,
  Star,
  CalendarDays,
} from "lucide-react";
import { getDashboardStats, BOOKING_STATUS_LABELS, CHANNEL_LABELS } from "@/lib/admin/stats";
import {
  BookingsTrendChart,
  ChannelBarChart,
  StatusDonutChart,
} from "@/components/admin/dashboard/Charts";
import { btnGhost, btnPrimary } from "@/components/admin/ui";

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs text-zinc-500">o‘tgan haftaga teng</span>;
  }
  const up = value > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-700" : "text-red-600"}`}>
      <Icon className="h-3.5 w-3.5" />
      {up ? "+" : ""}
      {value}% haftaga
    </span>
  );
}

function KpiCard({
  label,
  value,
  href,
  hint,
  accent = "amber",
}: {
  label: string;
  value: string | number;
  href?: string;
  hint?: ReactNode;
  accent?: "amber" | "emerald" | "sky" | "rose";
}) {
  const tones = {
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    sky: "text-sky-600",
    rose: "text-rose-600",
  };
  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${tones[accent]}`}>{value}</p>
      {hint && <div className="mt-2">{hint}</div>}
    </>
  );
  const className =
    "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-300";
  if (href) {
    return (
      <Link href={href} className={`block ${className}`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function statusTone(status: string) {
  switch (status) {
    case "new":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-300";
    case "contacted":
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-300";
    case "confirmed":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300";
    case "spam":
      return "bg-rose-100 text-rose-900 ring-1 ring-rose-300";
    default:
      return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-300";
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const { kpis, charts, inventory, recentBookings, recentAudit } = stats;

  const attention: { text: string; href: string; tone: "amber" | "rose" | "sky" }[] = [];
  if (kpis.newBookings > 0) {
    attention.push({
      text: `${kpis.newBookings} ta yangi ariza javob kutmoqda`,
      href: "/admin/bookings",
      tone: "amber",
    });
  }
  if (kpis.blogDraft > 0) {
    attention.push({
      text: `${kpis.blogDraft} ta blog qoralamasi`,
      href: "/admin/blog",
      tone: "sky",
    });
  }
  if (kpis.routesDraft > 0) {
    attention.push({
      text: `${kpis.routesDraft} ta marshrut qoralamasi`,
      href: "/admin/routes",
      tone: "sky",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Arizalar, kontent va faoliyat — bir joyda
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/bookings" className={`${btnPrimary} inline-flex items-center gap-2`}>
            <Inbox className="h-4 w-4" />
            Arizalar
          </Link>
          <Link href="/admin/routes/new" className={`${btnGhost} inline-flex items-center gap-2`}>
            Marshrut qo‘shish
          </Link>
        </div>
      </div>

      {attention.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {attention.map((a) => (
            <Link
              key={a.text}
              href={a.href}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition hover:brightness-95 ${
                a.tone === "amber"
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : a.tone === "rose"
                    ? "border-rose-300 bg-rose-50 text-rose-900"
                    : "border-sky-300 bg-sky-50 text-sky-900"
              }`}
            >
              {a.text}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Yangi arizalar"
          value={kpis.newBookings}
          href="/admin/bookings"
          accent="amber"
          hint={
            <span className="text-xs text-zinc-600">
              Bugun: {kpis.bookingsToday}
            </span>
          }
        />
        <KpiCard
          label="Bu hafta"
          value={kpis.bookingsThisWeek}
          href="/admin/bookings"
          accent="sky"
          hint={<DeltaBadge value={kpis.weekDelta} />}
        />
        <KpiCard
          label="Tasdiqlangan (30 kun)"
          value={kpis.confirmedMonth}
          href="/admin/bookings"
          accent="emerald"
          hint={
            <span className="text-xs text-zinc-600">
              Jami 30 kun: {kpis.bookingsMonth}
            </span>
          }
        />
        <KpiCard
          label="O‘rtacha reyting"
          value={kpis.avgRating || "—"}
          href="/admin/reviews"
          accent="amber"
          hint={
            <span className="inline-flex items-center gap-1 text-xs text-zinc-600">
              <Star className="h-3 w-3 text-amber-600" />
              {kpis.reviewCount} sharh
            </span>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Arizalar dinamikasi (14 kun)"
          className="xl:col-span-2"
          action={
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600">
              <CalendarDays className="h-3.5 w-3.5" />
              oxirgi 2 hafta
            </span>
          }
        >
          <BookingsTrendChart data={charts.bookingsByDay} />
        </Panel>

        <Panel title="Holat bo‘yicha">
          <StatusDonutChart data={charts.statusChart} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Kanal (WhatsApp / Telegram)">
          <ChannelBarChart data={charts.channelChart} />
        </Panel>

        <Panel
          title="Oxirgi arizalar"
          className="xl:col-span-2"
          action={
            <Link href="/admin/bookings" className="text-xs font-semibold text-amber-700 hover:underline">
              Barchasi →
            </Link>
          }
        >
          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">Hali ariza kelmagan</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  <tr>
                    <th className="pb-2 font-semibold">Mijoz</th>
                    <th className="pb-2 font-semibold">Marshrut</th>
                    <th className="pb-2 font-semibold">Kanal</th>
                    <th className="pb-2 font-semibold">Holat</th>
                    <th className="pb-2 font-semibold">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="text-zinc-800">
                      <td className="py-2.5 pr-3">
                        <div className="font-medium text-zinc-900">{b.name}</div>
                        <div className="text-[11px] text-zinc-600">{b.phone}</div>
                      </td>
                      <td className="py-2.5 pr-3 text-zinc-700">
                        {(b.fromPlace || "—") + " → " + (b.toPlace || "—")}
                      </td>
                      <td className="py-2.5 pr-3 text-xs font-medium text-zinc-700">
                        {CHANNEL_LABELS[b.preferredChannel] ?? b.preferredChannel}
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusTone(b.status)}`}>
                          {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] font-medium text-zinc-600 whitespace-nowrap">
                        {b.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Kontent inventar" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {inventory.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg border border-zinc-200 bg-white/50 px-4 py-3 transition hover:border-amber-500/30"
              >
                <p className="text-xs font-medium text-zinc-600">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">{item.value}</p>
                <p className="text-[11px] font-medium text-zinc-600">{item.hint}</p>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel
          title="Tezkor amallar"
          action={
            kpis.drafts > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                <FileEdit className="h-3.5 w-3.5" />
                {kpis.drafts} draft
              </span>
            ) : undefined
          }
        >
          <div className="space-y-2">
            {[
              { href: "/admin/bookings", label: "Arizalarni ko‘rish", icon: Inbox },
              { href: "/admin/routes/new", label: "Yangi marshrut", icon: ClipboardList },
              { href: "/admin/blog/new", label: "Yangi maqola", icon: FileEdit },
              { href: "/admin/reviews/new", label: "Sharh qo‘shish", icon: MessageSquare },
              { href: "/admin/settings", label: "Sozlamalar", icon: Star },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-amber-500/40 hover:bg-amber-50/50"
              >
                <a.icon className="h-4 w-4 text-amber-700" />
                {a.label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="So‘nggi faoliyat"
        action={
          <Link href="/admin/audit" className="text-xs font-semibold text-amber-700 hover:underline">
            Audit →
          </Link>
        }
      >
        {recentAudit.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">Hali yozuv yo‘q</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {recentAudit.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <span className="font-medium text-zinc-800">{log.action}</span>
                  <span className="text-zinc-500"> · {log.entity}</span>
                  {log.entityId && (
                    <span className="ml-1 text-[11px] text-zinc-600">{log.entityId.slice(0, 8)}…</span>
                  )}
                  <div className="text-[11px] text-zinc-600">
                    {log.user?.name || log.user?.email || "tizim"}
                  </div>
                </div>
                <time className="text-[11px] text-zinc-500 whitespace-nowrap">
                  {log.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
