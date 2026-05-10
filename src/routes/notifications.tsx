import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { activityFeed } from "@/lib/mock-data";
import { Bell, IndianRupee, UserPlus, LifeBuoy, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Nivasa Admin" }] }),
  component: NotifPage,
});

const iconMap = { signup: UserPlus, payment: IndianRupee, upgrade: TrendingDown, ticket: LifeBuoy, system: Sparkles };
const colorMap = { signup: "var(--cyan)", payment: "var(--emerald)", upgrade: "var(--violet)", ticket: "var(--amber)", system: "var(--blue)" };

function NotifPage() {
  const expanded = [...activityFeed, ...activityFeed.map((e, i) => ({ ...e, id: e.id + "-2", time: `${i + 5}h ago` }))];
  return (
    <div className="space-y-6">
      <Topbar title="Notifications" subtitle={`${expanded.length} signals from the last 24h`} />
      <GlassPanel delay={0.05}>
        <div className="space-y-1">
          {expanded.map((e, i) => {
            const Icon = iconMap[e.type];
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.03]"
              >
                <div className="h-9 w-9 rounded-lg grid place-items-center"
                     style={{ background: "oklch(1 0 0 / 4%)", color: colorMap[e.type] }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.meta}</div>
                </div>
                <div className="text-xs text-muted-foreground">{e.time}</div>
              </motion.div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}
