"use client";

import { btnDanger } from "@/components/admin/ui";

export function DeleteButton({
  action,
  id,
  label = "O‘chirish",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("O‘chirishni tasdiqlaysizmi?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={btnDanger}>
        {label}
      </button>
    </form>
  );
}
