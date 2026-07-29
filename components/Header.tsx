import Image from "next/image";
import { LiveClock } from "./LiveClock";

export function Header() {
  return (
    <header className="glass-panel relative z-10 flex shrink-0 items-center justify-between rounded-[24px] px-4 py-3 sm:rounded-[32px] sm:px-6 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2 sm:h-20 sm:w-20 sm:rounded-3xl sm:p-3">
          <Image src="/logo.png" alt="منظور" width={72} height={72} priority className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.42em] text-cyan-200/80 sm:block">MANZOR OPERATIONS CENTER</p>
          <h1 className="glow-text text-xl font-black tracking-tight text-white sm:mt-1 sm:text-3xl xl:text-5xl">شاشة متابعة المهام المباشرة</h1>
          <p className="mt-1 text-xs text-slate-300 sm:mt-2 sm:text-sm xl:text-base">متابعة الخطط والمهام اليومية للفريق</p>
        </div>
      </div>
      <div className="hidden items-center gap-5 md:flex"><div className="hidden rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100 xl:block">النظام مباشر</div><LiveClock /></div>
    </header>
  );
}
