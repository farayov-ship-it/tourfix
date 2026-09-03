import type { AdminUser } from "@prisma/client";
import { saveUser } from "@/lib/admin/actions";
import { Field, FormCard, fieldClass, btnPrimary } from "@/components/admin/ui";

export function UserForm({ item }: { item?: AdminUser }) {
  const isEdit = Boolean(item);
  return (
    <FormCard title={isEdit ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}>
      <form action={saveUser} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <input
              name="email"
              type="email"
              defaultValue={item?.email}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Ism">
            <input name="name" defaultValue={item?.name ?? ""} className={fieldClass} />
          </Field>
          <Field label="Rol">
            <select name="role" defaultValue={item?.role ?? "editor"} className={fieldClass}>
              <option value="editor">Muharrir (editor)</option>
              <option value="owner">Egasi (owner)</option>
            </select>
          </Field>
          <Field
            label={isEdit ? "Yangi parol" : "Parol"}
            hint={isEdit ? "Bo‘sh qoldirsangiz parol o‘zgarmaydi" : undefined}
          >
            <input
              name="password"
              type="password"
              className={fieldClass}
              required={!isEdit}
              autoComplete="new-password"
            />
          </Field>
        </div>
        <button type="submit" className={btnPrimary}>
          {isEdit ? "Saqlash" : "Qo‘shish"}
        </button>
      </form>
    </FormCard>
  );
}
