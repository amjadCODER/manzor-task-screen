import Image from "next/image";
import { LiveClock } from "./LiveClock";

export function Header() {
  return (
    <header className="glass-panel relative z-10 flex shrink-0 items-center justify-between rounded-[32px] px-6 py-4">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl">
          <Image
            src="/logo.png"
            alt="منظور"
            width={72}
            height={72}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-cyan-200/80">
            MANZOR OPERATIONS CENTER
          </p>
          <h1 className="glow-text mt-1 text-3xl font-black tracking-tight text-white xl:text-5xl">
            شاشة متابعة المهام المباشرة
          </h1>
          <p className="mt-2 text-sm text-slate-300 xl:text-base">
            متابعة سير العمل اليومي حسب قوائم Microsoft To Do
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100 xl:block">
          النظام مباشر
        </div>
        <LiveClock />
      </div>
    </header>
  );
}
