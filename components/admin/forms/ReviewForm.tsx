import type { Review } from "@prisma/client";
import { saveReview } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  LocaleFields,
  STATUS_OPTIONS,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

export function ReviewForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: Review;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Sharhni tahrirlash" : "Yangi sharh"}>
      <form action={saveReview} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Ism">
            <input name="name" defaultValue={item?.name} className={fieldClass} required />
          </Field>
          <Field label="Mamlakat">
            <input
              name="country"
              defaultValue={item?.country}
              className={fieldClass}
              placeholder="Germaniya"
            />
          </Field>
          <Field label="Reyting (1–5)">
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              defaultValue={item?.rating ?? 5}
              className={fieldClass}
            />
          </Field>
          <Field label="Sana">
            <input
              name="date"
              type="date"
              defaultValue={(item?.date ?? new Date()).toISOString().slice(0, 10)}
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
        </div>
        <LocaleFields
          prefix="text"
          label="Sharh matni"
          values={item ? parseMap(item.text) : {}}
          locales={locales}
          multiline
          rows={4}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
