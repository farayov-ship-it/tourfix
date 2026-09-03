import { UserForm } from "@/components/admin/forms/UserForm";
import { BackLink } from "@/components/admin/ListUI";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Yangi foydalanuvchi</h1>
        <BackLink href="/admin/users" />
      </div>
      <UserForm />
    </div>
  );
}
