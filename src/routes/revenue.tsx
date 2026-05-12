import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { StatCard } from "@/components/ui-fx/StatCard";
import { usePlatformMetrics, useRevenueSeries } from "@/lib/supabase-data";
import { IndianRupee, TrendingUp, Repeat, Wallet } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  Line, LineChart,
} from "recharts";

export const Route = createFileRoute("/revenue")({
  head: () => ({ meta: [{ title: "Revenue · Nivasa Admin" }] }),
  component: RevenuePage,
});

function RevenuePage() {
  const { data: metrics, isLoading } = usePlatformMetrics();
  const { data: revenueSeries = [] } = useRevenueSeries();

  const mrr = metrics?.monthlyRevenue ?? 0;
  const arr = mrr * 12;
  const activeLandlords = metrics?.activeLandlords ?? 1;

  return (
    <div className="space-y-6">
      <Topbar title="Revenue" subtitle="SaaS revenue intelligence and projections" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value={isLoading ? 0 : mrr} prefix="₹" delta={14.7} icon={IndianRupee} accent="emerald" />
        <StatCard label="ARR (projected)" value={isLoading ? 0 : arr} prefix="₹" delta={18.2} icon={TrendingUp} accent="cyan" delay={0.05} />
        <StatCard label="Net retention" value={108.4} suffix="%" decimals={1} delta={2.1} icon={Repeat} accent="violet" delay={0.1} />
        <StatCard
          label="Avg revenue per landlord"
          value={isLoading ? 0 : (activeLandlords > 0 ? Math.round(mrr / activeLandlords) : 0)}
          prefix="₹"
          delta={4.6}
          icon={Wallet}
          accent="blue"
          delay={0.15}
        />
      </div>

      <GlassPanel title="Revenue waterfall" subtitle="MRR vs new vs churn" delay={0.2}>
        <div className="h-80 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="rev-mrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rev-churn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false}
                     tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Area type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={2.5} fill="url(#rev-mrr)" />
              <Area type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} fill="url(#rev-churn)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      <GlassPanel title="Net new revenue" delay={0.3}>
        <div className="h-56 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries.map(r => ({ ...r, net: r.new - r.churn }))}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false}
                     tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Line type="monotone" dataKey="net" stroke="#00D1FF" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>
    </div>
  );
}
