import type { FaqItem } from "@prisma/client";
import { saveFaq } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  LocaleFields,
  STATUS_OPTIONS,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

export function FaqForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: FaqItem;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "FAQ tahrirlash" : "Yangi savol"}>
      <form action={saveFaq} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tartib">
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? defaultSortOrder}
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
        </div>
        <LocaleFields
          prefix="question"
          label="Savol"
          values={item ? parseMap(item.question) : {}}
          locales={locales}
        />
        <LocaleFields
          prefix="answer"
          label="Javob"
          values={item ? parseMap(item.answer) : {}}
          locales={locales}
          multiline
          rows={5}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
