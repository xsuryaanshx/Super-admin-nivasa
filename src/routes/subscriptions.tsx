import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { tiers } from "@/lib/mock-data";
import { useLandlords, useRevenueSeries } from "@/lib/supabase-data";
import { Check, AlertTriangle, RefreshCw } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions · Nivasa Admin" }] }),
  component: SubsPage,
});

function SubsPage() {
  const { data: landlords = [] } = useLandlords();
  const { data: revenueSeries = [] } = useRevenueSeries();

  const failed = landlords.filter((l) => l.paymentStatus === "failed");
  const pending = landlords.filter((l) => l.paymentStatus === "pending");

  return (
    <div className="space-y-6">
      <Topbar title="Subscriptions" subtitle="SaaS revenue, plans and renewal health" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-strong p-5 relative overflow-hidden ${t.highlight ? "neon-border" : ""}`}
          >
            {t.highlight && (
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-50"
                   style={{ background: "var(--gradient-violet)" }} />
            )}
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-display font-semibold">₹{t.price.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {landlords.filter((l) => l.plan === t.name).length} active accounts
              </div>
              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5" style={{ color: "var(--emerald)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassPanel className="lg:col-span-2" title="Revenue contribution by month" delay={0.2}>
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false}
                       tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                         contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }} />
                <defs>
                  <linearGradient id="bar-mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#00D1FF" />
                  </linearGradient>
                </defs>
                <Bar dataKey="mrr" fill="url(#bar-mrr)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Renewals & failures" delay={0.25}>
          <div className="space-y-3">
            <Row icon={<AlertTriangle className="h-4 w-4" />} color="var(--rose)" label="Failed payments" value={failed.length.toString()} />
            <Row icon={<RefreshCw className="h-4 w-4" />} color="var(--amber)" label="Retry pending" value={pending.length.toString()} />
            <Row icon={<Check className="h-4 w-4" />} color="var(--emerald)" label="Active accounts" value={(landlords.length - failed.length).toString()} />
          </div>
          {landlords.length > 0 && (
            <div className="mt-4 text-xs text-muted-foreground">
              {landlords.filter(l => l.plan === "Scale").length} Scale tier landlords — consider Enterprise upsell opportunities.
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}

function Row({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
         style={{ background: "oklch(1 0 0 / 3%)" }}>
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
