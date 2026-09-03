import type { SeoPage } from "@prisma/client";
import { saveSeo } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  LocaleFields,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

export function SeoForm({
  item,
  locales,
}: {
  item?: SeoPage;
  locales: string[];
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "SEO tahrirlash" : "Yangi SEO sahifa"}>
      <form action={saveSeo} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <Field label="Sahifa kodi" hint="Masalan: home, transfers, guides">
          <input
            name="path"
            defaultValue={item?.path}
            className={fieldClass}
            placeholder="home"
            required
          />
        </Field>
        <LocaleFields
          prefix="title"
          label="Sarlavha (meta title)"
          values={item ? parseMap(item.title) : {}}
          locales={locales}
        />
        <LocaleFields
          prefix="description"
          label="Tavsif (meta description)"
          values={item ? parseMap(item.description) : {}}
          locales={locales}
          multiline
          rows={3}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
