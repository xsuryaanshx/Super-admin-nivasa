import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users, Building2, Home, BedDouble, UsersRound, IndianRupee,
  CreditCard, TrendingDown, Activity, CircleDot, UserPlus, LifeBuoy, Sparkles,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui-fx/StatCard";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { SystemTimeline } from "@/components/ui-fx/SystemTimeline";
import { systemStatus } from "@/lib/mock-data";
import {
  usePlatformMetrics,
  useRevenueSeries,
  useActivityFeed,
  useLandlords,
} from "@/lib/supabase-data";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Platform Overview · Nivasa Admin" },
      { name: "description", content: "Platform-wide SaaS analytics and live activity for Nivasa by Ami Group." },
    ],
  }),
  component: Overview,
}));

const activityIcon = {
  signup: UserPlus, payment: IndianRupee, upgrade: TrendingDown, ticket: LifeBuoy, system: Sparkles,
} as const;
const activityColor = {
  signup: "var(--cyan)", payment: "var(--emerald)", upgrade: "var(--violet)",
  ticket: "var(--amber)", system: "var(--blue)",
} as const;

function Overview() {
  const { data: metrics, isLoading: loadingMetrics } = usePlatformMetrics();
  const { data: revenueSeries = [] } = useRevenueSeries();
  const { data: activityFeed = [] } = useActivityFeed();
  const { data: landlords = [] } = useLandlords();

  const recentLandlords = [...landlords]
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Topbar title="Platform Overview" subtitle="Real-time intelligence across the Nivasa ecosystem" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Landlords" value={loadingMetrics ? 0 : (metrics?.activeLandlords ?? 0)} delta={12.4} icon={Users} accent="cyan" delay={0.0} />
        <StatCard label="Total Buildings" value={loadingMetrics ? 0 : (metrics?.totalBuildings ?? 0)} delta={8.2} icon={Building2} accent="violet" delay={0.05} />
        <StatCard label="Total Properties" value={loadingMetrics ? 0 : (metrics?.totalProperties ?? 0)} delta={5.1} icon={Home} accent="blue" delay={0.1} />
        <StatCard label="Total Rooms" value={loadingMetrics ? 0 : (metrics?.totalRooms ?? 0)} delta={6.8} icon={BedDouble} accent="cyan" delay={0.15} />
        <StatCard label="Total Tenants" value={loadingMetrics ? 0 : (metrics?.totalTenants ?? 0)} delta={9.4} icon={UsersRound} accent="emerald" delay={0.2} />
        <StatCard label="Monthly SaaS Revenue" value={loadingMetrics ? 0 : (metrics?.monthlyRevenue ?? 0)} prefix="₹" delta={14.7} icon={IndianRupee} accent="emerald" delay={0.25} />
        <StatCard label="Active Subscriptions" value={loadingMetrics ? 0 : (metrics?.activeSubscriptions ?? 0)} delta={3.6} icon={CreditCard} accent="violet" delay={0.3} />
        <StatCard label="Churn Rate" value={loadingMetrics ? 0 : (metrics?.churnRate ?? 0)} suffix="%" decimals={1} delta={-0.4} icon={TrendingDown} accent="blue" delay={0.35} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassPanel
          className="lg:col-span-2"
          title="SaaS Revenue Trajectory"
          subtitle="MRR · New · Churn — last 12 months"
          delay={0.35}
        >
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="g-mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D1FF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00D1FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-new" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false}
                       tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.13 0.012 250 / 95%)",
                    border: "1px solid oklch(1 0 0 / 12%)",
                    borderRadius: 12, fontSize: 12,
                  }}
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Area type="monotone" dataKey="mrr" stroke="#00D1FF" strokeWidth={2} fill="url(#g-mrr)" />
                <Area type="monotone" dataKey="new" stroke="#7C3AED" strokeWidth={2} fill="url(#g-new)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Live System Status" subtitle="All regions" delay={0.4}>
          <div className="space-y-3">
            {systemStatus.map((s, i) => {
              const ok = s.status === "operational";
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: "oklch(1 0 0 / 3%)" }}
                >
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-3.5 w-3.5" style={{ color: ok ? "var(--emerald)" : "var(--amber)" }} />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono">{s.latency}ms</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: ok ? "oklch(0.7 0.16 160 / 15%)" : "oklch(0.78 0.16 75 / 15%)",
                            color: ok ? "var(--emerald)" : "var(--amber)",
                          }}>
                      {s.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-3 w-3" /> Updated 4 seconds ago
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Live System Timeline" subtitle="Streaming events · auto-refresh" delay={0.45}>
        <SystemTimeline />
      </GlassPanel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassPanel className="lg:col-span-2" title="Platform Activity" subtitle="Live event stream" delay={0.5}>
          <div className="space-y-2">
            {activityFeed.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">No recent activity</div>
            ) : (
              activityFeed.map((e, i) => {
                const Icon = activityIcon[e.type] ?? Sparkles;
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.04 }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.03] transition"
                  >
                    <div className="h-8 w-8 rounded-lg grid place-items-center"
                         style={{ background: "oklch(1 0 0 / 4%)", color: activityColor[e.type] ?? "var(--blue)" }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{e.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{e.meta}</div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{e.time}</div>
                  </motion.div>
                );
              })
            )}
          </div>
        </GlassPanel>

        <GlassPanel title="Recently Joined Landlords" delay={0.55}>
          <div className="space-y-2">
            {recentLandlords.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">No landlords yet</div>
            ) : (
              recentLandlords.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.03]"
                >
                  <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold"
                       style={{ background: "var(--gradient-violet)" }}>
                    {l.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{l.org}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.city} · {l.plan}</div>
                  </div>
                  {l.verified && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: "oklch(0.82 0.17 215 / 15%)", color: "var(--cyan)" }}>
                      verified
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
