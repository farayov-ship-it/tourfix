import type { Locale } from "@prisma/client";
import { upsertLocale } from "@/lib/admin/actions";
import { Field, FormCard, fieldClass, btnPrimary } from "@/components/admin/ui";

export function LocaleForm({ item }: { item?: Locale }) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Tilni tahrirlash" : "Yangi til"}>
      <form action={upsertLocale} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Kod" hint="Masalan: uz, ru, en">
            <input
              name="code"
              defaultValue={item?.code}
              className={fieldClass}
              placeholder="uz"
              required
            />
          </Field>
          <Field label="Nomi (inglizcha)">
            <input name="name" defaultValue={item?.name} className={fieldClass} />
          </Field>
          <Field label="Mahalliy nomi">
            <input name="nativeName" defaultValue={item?.nativeName} className={fieldClass} />
          </Field>
          <Field label="Bayroq" hint="Emoji yoki GB, RU">
            <input name="flag" defaultValue={item?.flag} className={fieldClass} placeholder="🇺🇿" />
          </Field>
          <Field label="Tartib">
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? 0}
              className={fieldClass}
            />
          </Field>
          <Field label="Yo‘nalish">
            <select name="dir" defaultValue={item?.dir ?? "ltr"} className={fieldClass}>
              <option value="ltr">Chapdan o‘ng (LTR)</option>
              <option value="rtl">O‘ngdan chap (RTL)</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="enabled" defaultChecked={item?.enabled ?? true} className="rounded" />
            Saytda faol
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" name="isDefault" defaultChecked={item?.isDefault} className="rounded" />
            Asosiy til
          </label>
        </div>
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
