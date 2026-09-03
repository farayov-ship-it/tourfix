import type { Guide, MediaAsset } from "@prisma/client";
import { saveGuide } from "@/lib/admin/actions";
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

type GuideWithImage = Guide & { image: MediaAsset | null };

function languagesDisplay(raw: string) {
  try {
    return (JSON.parse(raw) as string[]).join(", ");
  } catch {
    return raw;
  }
}

export function GuideForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: GuideWithImage;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Gidni tahrirlash" : "Yangi gid"}>
      <form action={saveGuide} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Ism familiya">
            <input name="name" defaultValue={item?.name} className={fieldClass} required />
          </Field>
          <Field label="Shahar">
            <input
              name="city"
              defaultValue={item?.city}
              className={fieldClass}
              placeholder="Samarqand"
            />
          </Field>
          <Field label="Tillar" hint="Vergul bilan: Ingliz, Rus, O'zbek">
            <input
              name="languages"
              defaultValue={item ? languagesDisplay(item.languages) : ""}
              className={fieldClass}
              placeholder="English, Russian, Uzbek"
            />
          </Field>
          <Field label="Reyting">
            <input
              name="rating"
              type="number"
              step="0.1"
              defaultValue={item?.rating ?? 5}
              className={fieldClass}
            />
          </Field>
          <Field label="Sharhlar soni">
            <input
              name="reviewsCount"
              type="number"
              defaultValue={item?.reviewsCount ?? 0}
              className={fieldClass}
            />
          </Field>
          <Field label="Kunlik narx (USD)">
            <input
              name="pricePerDay"
              type="number"
              step="0.01"
              defaultValue={item?.pricePerDay}
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
          <Field label="Havola kodi (URL)" hint="Bo‘sh — ismdan avtomatik">
            <input name="slug" defaultValue={item?.slug} className={fieldClass} />
          </Field>
        </div>
        <LocaleFields
          prefix="specialty"
          label="Mutaxassislik (tillar bo‘yicha)"
          values={item ? parseMap(item.specialty) : {}}
          locales={locales}
        />
        <ImagePicker
          name="imageId"
          label="Gid rasmi"
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
