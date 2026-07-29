"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { employees } from "@/lib/dashboard";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = employeeId.trim().toLowerCase();
    const employee = employees.find((item) => item.id.toLowerCase() === normalized);
    if (!employee) {
      setError("رقم الموظف غير صحيح");
      return;
    }
    localStorage.setItem("manzor_active_employee", employee.id);
    router.push(`/employee/${employee.id}`);
  }

  return (
    <main className="soft-grid flex min-h-screen items-center justify-center overflow-auto p-5" dir="rtl">
      <section className="glass-panel w-full max-w-md rounded-[36px] p-7 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 p-4">
          <Image src="/logo.png" width={90} height={90} alt="منظور" className="h-full w-full object-contain" priority />
        </div>
        <h1 className="mt-5 text-3xl font-black text-white">نظام الخطط والمهام</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">ادخل رقمك الوظيفي لفتح شاشتك الخاصة</p>

        <form onSubmit={submit} className="mt-7 space-y-4 text-right">
          <label className="block text-sm font-bold text-slate-200">رقم الموظف</label>
          <input
            value={employeeId}
            onChange={(event) => { setEmployeeId(event.target.value); setError(""); }}
            placeholder="ادخل رقم الايدي"
            className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-4 text-left text-lg font-bold text-white outline-none transition focus:border-cyan-300/60"
            dir="ltr"
            autoComplete="off"
          />
          {error && <p className="text-sm font-bold text-rose-300">{error}</p>}
          <button className="w-full rounded-2xl bg-gradient-to-l from-cyan-400 via-blue-500 to-purple-600 px-5 py-4 text-lg font-black text-white shadow-xl transition hover:scale-[1.01]">
            دخول
          </button>
        </form>

        <button onClick={() => router.push("/monitor")} className="mt-5 text-sm font-bold text-cyan-200 underline underline-offset-4">
          فتح شاشة المتابعة العامة
        </button>
      </section>
    </main>
  );
}
