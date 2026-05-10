import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { aiInsights } from "@/lib/mock-data";
import { downloadCSV } from "@/lib/csv";
import { Sparkles, AlertCircle, Lightbulb, Info, ArrowRight, RefreshCw, Copy, Download, Share2 } from "lucide-react";

export const Route = createFileRoute("/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights · Nivasa Admin" }] }),
  component: AIPage,
});

const iconMap = { alert: AlertCircle, opportunity: Lightbulb, info: Info } as const;
const colorMap = { alert: "var(--rose)", opportunity: "var(--emerald)", info: "var(--cyan)" } as const;

const summaries = [
  "Across the last 30 days, Nivasa onboarded 142 new landlords (+12.4% MoM), with Bengaluru and Pune driving 38% of growth. MRR climbed to ₹6.2L with healthy net retention at 108.4%. Watch list: 3 Growth-tier accounts show usage decline, and payment retries spiked yesterday. Suggested next action: trigger upsell flow for 8 Scale customers nearing limits — projected lift ₹1.7L MRR.",
  "Quarterly intelligence: occupancy across the platform stabilised at 87.3% (+1.8pp QoQ). Enterprise tier now contributes 41% of MRR despite being 9% of accounts. Risk surface: AI Pipeline latency drifted to 312ms — recommend scaling inference replicas. Opportunity: Hyderabad expansion shows 2.4× signup velocity vs Q1.",
  "Live signal: 4 high-value renewals due in the next 14 days (₹62k combined MRR). Churn model flags 2 Growth accounts with <15% probability of renewal — proactive CSM touch recommended within 48h. Payments health restored after Razorpay retry storm.",
];

function AIPage() {
  const [variant, setVariant] = useState(0);
  const [typed, setTyped] = useState("");
  const [generating, setGenerating] = useState(false);
  const summary = summaries[variant];

  useEffect(() => {
    setTyped("");
    setGenerating(true);
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(summary.slice(0, i));
      if (i >= summary.length) {
        clearInterval(id);
        setGenerating(false);
      }
    }, 18);
    return () => clearInterval(id);
  }, [summary]);

  const regenerate = () => {
    setVariant((v) => (v + 1) % summaries.length);
    toast("Regenerating briefing", { description: "Nivasa AI is reanalyzing the last 30 days…" });
  };

  const copyBriefing = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Briefing copied", { description: "Pasted to your clipboard." });
    } catch {
      toast.error("Could not copy", { description: "Clipboard access denied." });
    }
  };

  const exportInsights = () => {
    const rows = aiInsights.map((i) => ({
      id: String(i.id),
      severity: i.severity,
      title: i.title,
      body: i.body,
    }));
    const header = "id,severity,title,body";
    const body = rows
      .map((r) =>
        [r.id, r.severity, `"${r.title.replace(/"/g, '""')}"`, `"${r.body.replace(/"/g, '""')}"`].join(","),
      )
      .join("\n");
    downloadCSV(`nivasa-ai-insights-${new Date().toISOString().slice(0, 10)}.csv`, `${header}\n${body}`);
    toast.success("AI insights exported", { description: `${rows.length} rows · CSV ready.` });
  };

  const shareBriefing = () => {
    toast("Briefing shared", { description: "Sent to #ami-leadership on Slack." });
  };

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
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Daily briefing</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={regenerate}
                  disabled={generating}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-white/5 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} /> Regenerate
                </button>
                <button onClick={copyBriefing} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-white/5">
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button onClick={shareBriefing} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-white/5">
                  <Share2 className="h-3 w-3" /> Share
                </button>
                <button
                  onClick={exportInsights}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-background"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>
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
