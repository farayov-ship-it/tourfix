import type { MediaAsset, Route } from "@prisma/client";
import { saveRoute } from "@/lib/admin/actions";
import { Field, FormCard, ImagePicker, STATUS_OPTIONS, fieldClass, btnPrimary } from "@/components/admin/ui";

type RouteWithImage = Route & { image: MediaAsset | null };

export function RouteForm({
  item,
  defaultSortOrder = 0,
}: {
  item?: RouteWithImage;
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Marshrutni tahrirlash" : "Yangi marshrut"}>
      <form action={saveRoute} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Qayerdan">
            <input
              name="fromName"
              defaultValue={item?.fromName}
              className={fieldClass}
              placeholder="Toshkent"
              required
            />
          </Field>
          <Field label="Qayerga">
            <input
              name="toName"
              defaultValue={item?.toName}
              className={fieldClass}
              placeholder="Samarqand"
              required
            />
          </Field>
          <Field label="Narx (USD)">
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={item?.price}
              className={fieldClass}
            />
          </Field>
          <Field label="Davomiylik" hint="Masalan: 4.5–5 soat">
            <input
              name="duration"
              defaultValue={item?.duration}
              className={fieldClass}
              placeholder="4.5–5h"
            />
          </Field>
          <Field label="Masofa">
            <input
              name="distance"
              defaultValue={item?.distance}
              className={fieldClass}
              placeholder="315 km"
            />
          </Field>
          <Field label="Holat">
            <select name="status" defaultValue={item?.status ?? "published"} className={fieldClass}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tartib raqami">
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? defaultSortOrder}
              className={fieldClass}
            />
          </Field>
          <Field label="Havola kodi (URL)" hint="Bo‘sh qoldirsangiz nomdan avtomatik yaratiladi">
            <input
              name="slug"
              defaultValue={item?.slug}
              className={fieldClass}
              placeholder="toshkent-samarqand"
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="popular" defaultChecked={item?.popular} className="rounded" />
          Mashhur marshrut
        </label>
        <ImagePicker
          name="imageId"
          label="Marshrut rasmi"
          defaultId={item?.imageId}
          defaultUrl={item?.image?.url}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
