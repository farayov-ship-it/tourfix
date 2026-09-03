import type { Destination, MediaAsset } from "@prisma/client";
import { saveDestination } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  ImagePicker,
  LocaleFields,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

type DestinationWithImage = Destination & { image: MediaAsset | null };

export function DestinationForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: DestinationWithImage;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Manzilni tahrirlash" : "Yangi manzil"}>
      <form action={saveDestination} className="space-y-4">
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
          <Field label="Havola kodi (URL)" hint="Bo‘sh — nomdan avtomatik">
            <input name="slug" defaultValue={item?.slug} className={fieldClass} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={item?.featured ?? true}
            className="rounded"
          />
          Bosh sahifada ko‘rsatish
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={item?.published ?? true}
            className="rounded"
          />
          Saytda ko‘rinadi
        </label>
        <LocaleFields
          prefix="name"
          label="Nomi"
          values={item ? parseMap(item.name) : {}}
          locales={locales}
        />
        <LocaleFields
          prefix="tagline"
          label="Qisqa tavsif"
          values={item ? parseMap(item.tagline) : {}}
          locales={locales}
        />
        <ImagePicker
          name="imageId"
          label="Manzil rasmi"
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
