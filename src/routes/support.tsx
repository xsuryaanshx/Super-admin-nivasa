import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { tickets } from "@/lib/mock-data";
import { LifeBuoy, AlertOctagon, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support Center · Nivasa Admin" }] }),
  component: SupportPage,
});

const priorityColor = { P1: "var(--rose)", P2: "var(--amber)", P3: "var(--cyan)" } as const;
const statusColor = { open: "var(--amber)", "in-progress": "var(--cyan)", resolved: "var(--emerald)" } as const;

function SupportPage() {
  const open = tickets.filter(t => t.status !== "resolved").length;
  const p1 = tickets.filter(t => t.priority === "P1" && t.status !== "resolved").length;
  const resolved = tickets.filter(t => t.status === "resolved").length;

  return (
    <div className="space-y-6">
      <Topbar title="Support Center" subtitle="Tickets, escalations and response analytics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Open tickets", v: open, i: LifeBuoy, c: "var(--cyan)" },
          { l: "P1 escalations", v: p1, i: AlertOctagon, c: "var(--rose)" },
          { l: "Avg first response", v: "12m", i: Clock, c: "var(--amber)" },
          { l: "Resolved (7d)", v: resolved + 18, i: CheckCircle2, c: "var(--emerald)" },
        ].map((m, i) => (
          <motion.div
            key={m.l}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-strong p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{m.l}</div>
              <m.i className="h-4 w-4" style={{ color: m.c }} />
            </div>
            <div className="mt-2 text-3xl font-display font-semibold">{m.v}</div>
          </motion.div>
        ))}
      </div>

      <GlassPanel title="Active tickets" delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium py-2 pr-3">Ticket</th>
                <th className="text-left font-medium py-2 pr-3">Subject</th>
                <th className="text-left font-medium py-2 pr-3">Landlord</th>
                <th className="text-left font-medium py-2 pr-3">Priority</th>
                <th className="text-left font-medium py-2 pr-3">Status</th>
                <th className="text-left font-medium py-2 pr-3">Agent</th>
                <th className="text-left font-medium py-2">Age</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="py-3 pr-3">{t.subject}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{t.landlord}</td>
                  <td className="py-3 pr-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: `${priorityColor[t.priority]}20`, color: priorityColor[t.priority] }}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: `${statusColor[t.status]}20`, color: statusColor[t.status] }}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">{t.agent}</td>
                  <td className="py-3 text-muted-foreground">{t.age}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
