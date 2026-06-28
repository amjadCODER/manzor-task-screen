type FooterStatsProps = {
  employees: number;
  current: number;
  completed: number;
  assigned: number;
  rate: number;
};

const stats = [
  { key: "employees", label: "الموظفين", suffix: "" },
  { key: "current", label: "المهام الجارية", suffix: "" },
  { key: "completed", label: "المهام المنجزة", suffix: "" },
  { key: "assigned", label: "إجمالي مهام اليوم", suffix: "" },
  { key: "rate", label: "نسبة الإنجاز", suffix: "%" },
] as const;

export function FooterStats(props: FooterStatsProps) {
  return (
    <section className="glass-panel grid shrink-0 grid-cols-5 gap-4 rounded-[30px] p-4">
      {stats.map((stat) => (
        <div key={stat.key} className="rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center">
          <p className="text-xs font-bold text-cyan-200">{stat.label}</p>
          <p className="mt-1 text-3xl font-black text-white">
            {props[stat.key]}{stat.suffix}
          </p>
        </div>
      ))}
    </section>
  );
}
