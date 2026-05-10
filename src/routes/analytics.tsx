import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { landlordGrowth, occupancyByCity, planDistribution, revenueSeries } from "@/lib/mock-data";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  RadialBar, RadialBarChart, PolarAngleAxis, Bar, BarChart,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Platform Analytics · Nivasa Admin" }] }),
  component: AnalyticsPage,
});

const COLORS = ["#00D1FF", "#7C3AED", "#10B981", "#2563EB"];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Topbar title="Platform Analytics" subtitle="Intelligence center · live signals across the Nivasa network" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassPanel className="lg:col-span-2" title="Landlord & building growth" subtitle="Cumulative · last 12 months" delay={0.05}>
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={landlordGrowth}>
                <defs>
                  <linearGradient id="g-l" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D1FF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00D1FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="landlords" stroke="#00D1FF" strokeWidth={2} fill="url(#g-l)" />
                <Area type="monotone" dataKey="buildings" stroke="#7C3AED" strokeWidth={2} fill="url(#g-b)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Plan distribution" delay={0.1}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={planDistribution.map((p, i) => ({ ...p, fill: COLORS[i] }))}>
                <PolarAngleAxis type="number" domain={[0, Math.max(...planDistribution.map(p => p.count)) * 1.2]} tick={false} />
                <RadialBar dataKey="count" background={{ fill: "oklch(1 0 0 / 4%)" }} cornerRadius={8} />
                <Tooltip contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {planDistribution.map((p, i) => (
              <div key={p.plan} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{p.plan}</span>
                <span className="ml-auto font-medium">{p.count}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Occupancy heatmap by city" delay={0.15}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {occupancyByCity.map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, oklch(0.82 0.17 215 / ${c.occupancy / 100 * 0.4}), oklch(0.55 0.25 295 / ${c.occupancy / 100 * 0.3}))`,
                boxShadow: `inset 0 0 0 1px oklch(0.82 0.17 215 / ${c.occupancy / 100 * 0.5})`,
              }}
            >
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.city}</div>
              <div className="text-3xl font-display font-semibold mt-1">{c.occupancy}%</div>
              <div className="text-xs text-muted-foreground mt-1">{c.buildings} buildings</div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel title="Churn signal — last 12 months" delay={0.2}>
        <div className="h-56 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                       contentStyle={{ background: "oklch(0.13 0.012 250 / 95%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="churn" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>
    </div>
  );
}
