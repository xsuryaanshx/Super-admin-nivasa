import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { type SupportTicket } from "@/lib/mock-data";
import { useSupportTickets } from "@/lib/supabase-data";
import { toCSV, downloadCSV } from "@/lib/csv";
import { LifeBuoy, AlertOctagon, Clock, CheckCircle2, Filter, Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support Center · Nivasa Admin" }] }),
  component: SupportPage,
});

const priorityColor = { P1: "var(--rose)", P2: "var(--amber)", P3: "var(--cyan)" } as const;
const statusColor = { open: "var(--amber)", "in-progress": "var(--cyan)", resolved: "var(--emerald)" } as const;

function SupportPage() {
  const { data: tickets = [], isLoading } = useSupportTickets();
  const [statusFilter, setStatusFilter] = useState<"all" | SupportTicket["status"]>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | SupportTicket["priority"]>("all");

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (statusFilter === "all" || t.status === statusFilter) &&
          (priorityFilter === "all" || t.priority === priorityFilter),
      ),
    [tickets, statusFilter, priorityFilter],
  );

  const open = tickets.filter((t) => t.status !== "resolved").length;
  const p1 = tickets.filter((t) => t.priority === "P1" && t.status !== "resolved").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-6">
      <Topbar title="Support Center" subtitle="Tickets, escalations and response analytics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Open tickets", v: open, i: LifeBuoy, c: "var(--cyan)" },
          { l: "P1 escalations", v: p1, i: AlertOctagon, c: "var(--rose)" },
          { l: "Avg first response", v: "12m", i: Clock, c: "var(--amber)" },
          { l: "Resolved (7d)", v: resolved, i: CheckCircle2, c: "var(--emerald)" },
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

      <GlassPanel delay={0.15}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "oklch(1 0 0 / 4%)" }}>
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-transparent outline-none text-sm"
            >
              <option value="all" className="bg-card">All statuses</option>
              <option value="open" className="bg-card">Open</option>
              <option value="in-progress" className="bg-card">In progress</option>
              <option value="resolved" className="bg-card">Resolved</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "oklch(1 0 0 / 4%)" }}>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
              className="bg-transparent outline-none text-sm"
            >
              <option value="all" className="bg-card">All priorities</option>
              <option value="P1" className="bg-card">P1</option>
              <option value="P2" className="bg-card">P2</option>
              <option value="P3" className="bg-card">P3</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground ml-1">
            {filtered.length} of {tickets.length} tickets
          </div>
          <button
            onClick={() => {
              const csv = toCSV(filtered as unknown as Record<string, unknown>[], ["id", "subject", "landlord", "priority", "status", "agent", "age"]);
              downloadCSV(`nivasa-tickets-${new Date().toISOString().slice(0, 10)}.csv`, csv);
              toast.success("Tickets exported", { description: `${filtered.length} rows · CSV ready.` });
            }}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-background"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </GlassPanel>

      <GlassPanel title={`Active tickets · ${filtered.length}`} delay={0.2}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading tickets…</span>
          </div>
        ) : (
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No tickets found.
                    </td>
                  </tr>
                )}
                {filtered.map((t, i) => (
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
        )}
      </GlassPanel>
    </div>
  );
}
