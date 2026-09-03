import { prisma } from "@/lib/db/prisma";
import { updateBooking } from "@/lib/admin/actions";
import { parseListParams, containsOr, type SearchParams } from "@/lib/admin/list-query";
import { ListToolbar, Pagination } from "@/components/admin/ListToolbar";
import { fieldClass, labelClass, btnPrimary } from "@/components/admin/ui";
import { BOOKING_STATUS_LABELS, CHANNEL_LABELS } from "@/lib/admin/stats";

const statuses = ["new", "contacted", "confirmed", "closed", "spam"] as const;
const channels = ["whatsapp", "telegram"] as const;

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

export default async function BookingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = parseListParams(sp, { pageSize: 15, extraKeys: ["channel", "source"] });
  const { page, pageSize, skip, q, status, channel, source } = params as typeof params & {
    channel: string;
    source: string;
  };

  const where = {
    AND: [
      status ? { status: status as (typeof statuses)[number] } : {},
      channel ? { preferredChannel: channel as (typeof channels)[number] } : {},
      source ? { source: source as "web" | "telegram_bot" } : {},
      q
        ? {
            OR: containsOr(
              ["name", "phone", "fromPlace", "toPlace", "notes", "adminNote", "vehicleCategory"],
              q,
            ),
          }
        : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.bookingRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.bookingRequest.count({ where }),
  ]);

  const filterParams = {
    q: q || undefined,
    status: status || undefined,
    channel: channel || undefined,
    source: source || undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Arizalar</h1>
        <p className="mt-1 text-sm text-zinc-500">{total} ta ariza</p>
      </div>

      <ListToolbar
        action="/admin/bookings"
        q={q}
        searchPlaceholder="Ism, telefon, marshrut…"
        filters={[
          {
            name: "status",
            label: "Holat",
            value: status,
            options: statuses.map((s) => ({
              value: s,
              label: BOOKING_STATUS_LABELS[s] ?? s,
            })),
          },
          {
            name: "channel",
            label: "Kanal",
            value: channel,
            options: channels.map((c) => ({
              value: c,
              label: CHANNEL_LABELS[c] ?? c,
            })),
          },
          {
            name: "source",
            label: "Manba",
            value: source,
            options: [
              { value: "web", label: "Veb-sayt" },
              { value: "telegram_bot", label: "Telegram bot" },
            ],
          },
        ]}
      />

      {total === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 px-6 py-12 text-center text-sm text-zinc-500">
          {q || status || channel || source
            ? "Filter bo‘yicha ariza topilmadi."
            : "Arizalar yo‘q."}
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((b) => (
              <div key={b.id} className="rounded-xl border border-zinc-200 bg-white/40 p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{b.name}</p>
                    <p className="text-sm text-zinc-400">{b.phone}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusTone(b.status)}`}>
                    {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </div>
                <div className="mb-3 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <p>
                    <span className="text-zinc-500">Marshrut:</span>{" "}
                    {b.fromPlace ?? "—"} → {b.toPlace ?? "—"}
                  </p>
                  <p>
                    <span className="text-zinc-500">Sana:</span> {b.travelDate ?? "—"}
                  </p>
                  <p>
                    <span className="text-zinc-500">Yo‘lovchi:</span> {b.passengers ?? "—"}
                  </p>
                  <p>
                    <span className="text-zinc-500">Avto:</span> {b.vehicleCategory ?? "—"}
                  </p>
                  <p>
                    <span className="text-zinc-500">Kanal:</span>{" "}
                    {CHANNEL_LABELS[b.preferredChannel] ?? b.preferredChannel} / {b.source}
                  </p>
                  <p>
                    <span className="text-zinc-500">Kelgan:</span>{" "}
                    {b.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </p>
                  {b.notes && (
                    <p className="sm:col-span-2">
                      <span className="text-zinc-500">Izoh:</span> {b.notes}
                    </p>
                  )}
                  {b.priceHint != null && (
                    <p>
                      <span className="text-zinc-500">Narx taxmini:</span> {b.priceHint}
                    </p>
                  )}
                </div>
                <form action={updateBooking} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={b.id} />
                  <div>
                    <label className={labelClass}>Holat</label>
                    <select name="status" defaultValue={b.status} className={fieldClass}>
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {BOOKING_STATUS_LABELS[s] ?? s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label className={labelClass}>Admin izohi</label>
                    <input
                      name="adminNote"
                      defaultValue={b.adminNote ?? ""}
                      className={fieldClass}
                    />
                  </div>
                  <button type="submit" className={btnPrimary}>
                    Saqlash
                  </button>
                </form>
              </div>
            ))}
          </div>
          <Pagination
            basePath="/admin/bookings"
            page={page}
            total={total}
            pageSize={pageSize}
            params={filterParams}
          />
        </>
      )}
    </div>
  );
}
