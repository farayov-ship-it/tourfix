"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@turkuztan.uz");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (!res || res.error) {
        setError("Email yoki parol noto'g'ri. Default: admin@turkuztan.uz / admin123");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Login xatosi. Server ishlayotganini tekshiring.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center bg-[#faf7f0] px-4 text-zinc-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-[#002040]/12 bg-white p-8 shadow-lg"
      >
        <div className="mb-2 flex justify-center">
          <BrandLogo variant="full" darkText priority />
        </div>
        <p className="text-center text-sm text-zinc-500">Admin panelga kiring</p>

        <label className="mt-6 block text-xs font-medium text-zinc-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#B08040] focus:ring-2 focus:ring-[#B08040]/20"
          required
        />

        <label className="mt-4 block text-xs font-medium text-zinc-600">Parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#B08040] focus:ring-2 focus:ring-[#B08040]/20"
          required
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-[#002040] py-2.5 text-sm font-semibold text-white transition hover:bg-[#001830] disabled:opacity-60"
        >
          {loading ? "Kirilmoqda…" : "Kirish"}
        </button>

        <p className="mt-4 text-center text-[11px] text-zinc-500">
          Default: admin@turkuztan.uz / admin123
        </p>
      </form>
    </div>
  );
}
