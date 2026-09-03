import type { MediaAsset, Vehicle } from "@prisma/client";
import { saveVehicle } from "@/lib/admin/actions";
import {
  Field,
  FormCard,
  ImagePicker,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  fieldClass,
  btnPrimary,
} from "@/components/admin/ui";

type VehicleWithImage = Vehicle & { image: MediaAsset | null };

export function VehicleForm({
  item,
  defaultSortOrder = 0,
}: {
  item?: VehicleWithImage;
  defaultSortOrder?: number;
}) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Avtomobilni tahrirlash" : "Yangi avtomobil"}>
      <form action={saveVehicle} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nomi">
            <input
              name="name"
              defaultValue={item?.name}
              className={fieldClass}
              placeholder="Chevrolet Cobalt"
              required
            />
          </Field>
          <Field label="Kategoriya">
            <select name="category" defaultValue={item?.category ?? "economy"} className={fieldClass}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="O‘rindiqlar soni">
            <input
              name="capacity"
              type="number"
              defaultValue={item?.capacity ?? 4}
              className={fieldClass}
            />
          </Field>
          <Field label="Narxdan (USD)">
            <input
              name="priceFrom"
              type="number"
              step="0.01"
              defaultValue={item?.priceFrom}
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
          <Field label="Havola kodi (URL)" hint="Bo‘sh qoldirsangiz nomdan yaratiladi">
            <input name="slug" defaultValue={item?.slug} className={fieldClass} />
          </Field>
        </div>
        <ImagePicker
          name="imageId"
          label="Avtomobil rasmi"
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
