import type { BlogPost, MediaAsset } from "@prisma/client";
import { saveBlogPost } from "@/lib/admin/actions";
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

type BlogWithCover = BlogPost & { cover: MediaAsset | null };

export function BlogForm({
  item,
  locales,
}: {
  item?: BlogWithCover;
  locales: string[];
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Maqolani tahrirlash" : "Yangi maqola"}>
      <form action={saveBlogPost} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Holat">
            <select name="status" defaultValue={item?.status ?? "draft"} className={fieldClass}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Havola kodi (URL)" hint="Bo‘sh — sarlavhadan avtomatik">
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
          prefix="excerpt"
          label="Qisqa matn"
          values={item ? parseMap(item.excerpt) : {}}
          locales={locales}
          multiline
          rows={2}
        />
        <LocaleFields
          prefix="body"
          label="Asosiy matn"
          values={item ? parseMap(item.body) : {}}
          locales={locales}
          multiline
          rows={isEdit ? 10 : 8}
        />
        <ImagePicker
          name="coverId"
          label="Muqova rasmi"
          defaultId={item?.coverId}
          defaultUrl={item?.cover?.url}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
