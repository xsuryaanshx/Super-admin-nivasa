import { motion } from "framer-motion";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  icon: LucideIcon;
  accent?: "cyan" | "violet" | "emerald" | "blue";
  delay?: number;
}

const accentMap = {
  cyan: { color: "var(--cyan)", glow: "var(--shadow-glow-cyan)", grad: "linear-gradient(135deg, oklch(0.82 0.17 215 / 25%), transparent)" },
  violet: { color: "var(--violet)", glow: "var(--shadow-glow-violet)", grad: "linear-gradient(135deg, oklch(0.55 0.25 295 / 25%), transparent)" },
  emerald: { color: "var(--emerald)", glow: "var(--shadow-glow-emerald)", grad: "linear-gradient(135deg, oklch(0.7 0.16 160 / 25%), transparent)" },
  blue: { color: "var(--blue)", glow: "0 0 40px -8px oklch(0.55 0.22 265 / 60%)", grad: "linear-gradient(135deg, oklch(0.55 0.22 265 / 25%), transparent)" },
};

export function StatCard({ label, value, prefix, suffix, decimals, delta, icon: Icon, accent = "cyan", delay = 0 }: Props) {
  const a = accentMap[accent];
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="glass-strong relative p-5 overflow-hidden group"
    >
      <div
        className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: a.grad }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-display font-semibold tracking-tight">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          {delta !== undefined && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium"
                 style={{ color: positive ? "var(--emerald)" : "var(--rose)" }}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}% vs last month
            </div>
          )}
        </div>
        <div
          className="h-10 w-10 rounded-xl grid place-items-center"
          style={{
            background: "oklch(1 0 0 / 5%)",
            color: a.color,
            boxShadow: `inset 0 0 0 1px ${a.color.replace(")", " / 30%)")}`,
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}
