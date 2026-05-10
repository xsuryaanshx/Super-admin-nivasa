import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { aiInsights } from "@/lib/mock-data";
import { Sparkles, AlertCircle, Lightbulb, Info, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights · Nivasa Admin" }] }),
  component: AIPage,
});

const iconMap = { alert: AlertCircle, opportunity: Lightbulb, info: Info } as const;
const colorMap = { alert: "var(--rose)", opportunity: "var(--emerald)", info: "var(--cyan)" } as const;

const summary = "Across the last 30 days, Nivasa onboarded 142 new landlords (+12.4% MoM), with Bengaluru and Pune driving 38% of growth. MRR climbed to ₹6.2L with healthy net retention at 108.4%. Watch list: 3 Growth-tier accounts show usage decline, and payment retries spiked yesterday. Suggested next action: trigger upsell flow for 8 Scale customers nearing limits — projected lift ₹1.7L MRR.";

function AIPage() {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(summary.slice(0, i));
      if (i >= summary.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <Topbar title="AI Insights" subtitle="Predictive intelligence · Nivasa AI v2.4" />

      <GlassPanel className="relative overflow-hidden" delay={0.05}>
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-8 py-4">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="h-32 w-32 rounded-full blur-xl"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-20 w-20 rounded-full grid place-items-center animate-pulse-glow"
                   style={{ background: "linear-gradient(135deg, oklch(0.82 0.17 215), oklch(0.55 0.25 295))" }}>
                <Sparkles className="h-8 w-8 text-background" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Daily briefing</div>
            <p className="mt-2 text-base md:text-lg leading-relaxed font-display">
              {typed}
              <motion.span
                animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-5 ml-1 align-middle"
                style={{ background: "var(--cyan)" }}
              />
            </p>
          </div>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights.map((ins, i) => {
          const Icon = iconMap[ins.severity as keyof typeof iconMap];
          const c = colorMap[ins.severity as keyof typeof colorMap];
          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-strong p-5 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-30"
                   style={{ background: c }} />
              <div className="relative flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center"
                     style={{ background: "oklch(1 0 0 / 5%)", color: c, boxShadow: `inset 0 0 0 1px ${c}40` }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-display font-semibold">{ins.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{ins.body}</p>
                  <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: c }}>
                    Investigate <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <GlassPanel title="Ask Nivasa AI" subtitle="Natural language query across the platform" delay={0.3}>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
             style={{ background: "oklch(1 0 0 / 4%)", boxShadow: "inset 0 0 0 1px oklch(0.82 0.17 215 / 25%)" }}>
          <Sparkles className="h-4 w-4" style={{ color: "var(--cyan)" }} />
          <input
            placeholder="e.g. Which landlords are most likely to churn this quarter?"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-background"
                  style={{ background: "var(--gradient-primary)" }}>
            Ask
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Top 10 landlords by revenue", "Cities with highest occupancy", "Predicted churn next 30 days", "Plans nearing usage limits"].map((q) => (
            <button key={q} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-white/5">
              {q}
            </button>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
