type DonutProps = {
  value: number;
  label: string;
  size?: "sm" | "md";
};

export function Donut({ value, label, size = "md" }: DonutProps) {
  const dimension = size === "sm" ? "h-24 w-24" : "h-32 w-32";
  const inner = size === "sm" ? "h-16 w-16" : "h-24 w-24";
  const text = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${dimension} flex items-center justify-center rounded-full shadow-[0_0_40px_rgba(34,211,238,0.18)]`}
        style={{
          background: `conic-gradient(from 180deg, #22d3ee 0%, #38bdf8 ${Math.max(value - 12, 0)}%, #8b5cf6 ${value}%, rgba(255,255,255,0.1) ${value}% 100%)`,
        }}
      >
        <div className={`${inner} flex items-center justify-center rounded-full border border-white/10 bg-[#071225]/95`}>
          <span className={`${text} font-black text-white`}>{value}%</span>
        </div>
      </div>
      <p className="text-center text-sm font-bold text-slate-200">{label}</p>
    </div>
  );
}
