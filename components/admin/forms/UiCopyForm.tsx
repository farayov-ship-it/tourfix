import type { UiCopy } from "@prisma/client";
import { saveUiCopy } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  LocaleFields,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

export function UiCopyForm({
  item,
  locales,
}: {
  item?: UiCopy;
  locales: string[];
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Tarjimani tahrirlash" : "Yangi tarjima kaliti"}>
      <form action={saveUiCopy} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kalit" hint="Masalan: hero.title">
            <input
              name="key"
              defaultValue={item?.key}
              className={fieldClass}
              placeholder="nav.transfers"
              required
            />
          </Field>
          <Field label="Guruh" hint="Bo‘lim nomi">
            <input
              name="group"
              defaultValue={item?.group ?? "general"}
              className={fieldClass}
              placeholder="nav"
            />
          </Field>
        </div>
        <LocaleFields
          prefix="value"
          label="Matn (tillar bo‘yicha)"
          values={item ? JSON.parse(item.value || "{}") : {}}
          locales={locales}
          multiline
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
