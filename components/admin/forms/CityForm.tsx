import type { City } from "@prisma/client";
import { saveCity } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  LocaleFields,
  parseMap,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

export function CityForm({
  item,
  locales,
  defaultSortOrder = 0,
}: {
  item?: City;
  locales: string[];
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Shaharni tahrirlash" : "Yangi shahar"}>
      <form action={saveCity} className="space-y-4">
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
          <input type="checkbox" name="isAirport" defaultChecked={item?.isAirport} className="rounded" />
          Aeroport
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
          label="Shahar nomi"
          values={item ? parseMap(item.name) : {}}
          locales={locales}
        />
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
