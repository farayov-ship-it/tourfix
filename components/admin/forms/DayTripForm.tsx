import type { DayTrip, MediaAsset } from "@prisma/client";
import { saveDayTrip } from "@/lib/admin/actions";
import { parseLocaleStringArrays } from "@/lib/locale-map";
import {
  Field,
  FormCard,
  ImagePicker,
  LocaleFields,
  STATUS_OPTIONS,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

type DayTripWithImage = DayTrip & { image: MediaAsset | null };

function highlightsValues(raw: string) {
  const map = parseLocaleStringArrays(raw);
  const values: Record<string, string> = {};
  for (const [k, arr] of Object.entries(map)) {
    values[k] = arr.join("\n");
  }
  return values;
}

export function DayTripForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: DayTripWithImage;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Sayohatni tahrirlash" : "Yangi kunlik sayohat"}>
      <form action={saveDayTrip} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Shahar">
            <input
              name="city"
              defaultValue={item?.city}
              className={fieldClass}
              placeholder="Samarqand"
            />
          </Field>
          <Field label="Davomiylik">
            <input
              name="duration"
              defaultValue={item?.duration}
              className={fieldClass}
              placeholder="8 soat"
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
          <Field label="Holat">
            <select name="status" defaultValue={item?.status ?? "published"} className={fieldClass}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tartib">
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? defaultSortOrder}
              className={fieldClass}
            />
          </Field>
          <Field label="Havola kodi (URL)" hint="Bo‘sh — nomdan avtomatik">
            <input name="slug" defaultValue={item?.slug} className={fieldClass} />
          </Field>
        </div>
        <LocaleFields
          prefix="title"
          label="Sarlavha"
          values={item ? parseMap(item.title) : {}}
          locales={locales}
        />
        <LocaleFields
          prefix="highlights"
          label="Diqqatga sazovor joylar (har qator — bitta band)"
          values={item ? highlightsValues(item.highlights) : {}}
          locales={locales}
          multiline
          rows={4}
        />
        <ImagePicker
          name="imageId"
          label="Sayohat rasmi"
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
