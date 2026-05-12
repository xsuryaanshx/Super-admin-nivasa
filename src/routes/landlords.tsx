import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import type { Landlord } from "@/lib/mock-data";
import { useLandlords } from "@/lib/supabase-data";
import { toCSV, downloadCSV } from "@/lib/csv";
import { BadgeCheck, Building2, IndianRupee, Search, X, ArrowUpDown, Filter, Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/landlords")({
  head: () => ({
    meta: [
      { title: "Landlords · Nivasa Admin" },
      { name: "description", content: "Operate and analyze every landlord on the Nivasa platform." },
    ],
  }),
  component: LandlordsPage,
});

const planColor: Record<Landlord["plan"], string> = {
  Starter: "var(--blue)", Growth: "var(--cyan)", Scale: "var(--violet)", Enterprise: "var(--emerald)",
};

function LandlordsPage() {
  const { data: landlords = [], isLoading, error } = useLandlords();
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"revenue" | "occupancy" | "tenants">("revenue");
  const [selected, setSelected] = useState<Landlord | null>(null);

  const filtered = useMemo(() => {
    return landlords
      .filter((l) =>
        (plan === "all" || l.plan === plan) &&
        (q === "" || l.org.toLowerCase().includes(q.toLowerCase()) ||
         l.name.toLowerCase().includes(q.toLowerCase()) ||
         l.city.toLowerCase().includes(q.toLowerCase()))
      )
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [landlords, q, plan, sortBy]);

  return (
    <div className="space-y-6">
      <Topbar
        title="Landlords"
        subtitle={isLoading ? "Loading…" : `${filtered.length} of ${landlords.length} accounts`}
      />

      <GlassPanel delay={0.05}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[220px]"
               style={{ background: "oklch(1 0 0 / 4%)" }}>
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
                   placeholder="Search by org, name or city"
                   className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
               style={{ background: "oklch(1 0 0 / 4%)" }}>
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={plan} onChange={(e) => setPlan(e.target.value)}
                    className="bg-transparent outline-none text-sm">
              <option value="all" className="bg-card">All plans</option>
              {(["Starter", "Growth", "Scale", "Enterprise"] as const).map((p) =>
                <option key={p} value={p} className="bg-card">{p}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
               style={{ background: "oklch(1 0 0 / 4%)" }}>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent outline-none text-sm">
              <option value="revenue" className="bg-card">Revenue</option>
              <option value="occupancy" className="bg-card">Occupancy</option>
              <option value="tenants" className="bg-card">Tenants</option>
            </select>
          </div>
          <button
            onClick={() => {
              const csv = toCSV(filtered as unknown as Record<string, unknown>[], [
                "id", "org", "name", "email", "city", "plan", "buildings",
                "tenants", "occupancy", "revenue", "paymentStatus", "verified", "joinedAt",
              ]);
              downloadCSV(`nivasa-landlords-${new Date().toISOString().slice(0, 10)}.csv`, csv);
              toast.success("Export ready", { description: `${filtered.length} landlords exported as CSV.` });
            }}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-background"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </GlassPanel>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "oklch(0.4 0.15 25 / 20%)", color: "var(--rose)" }}>
          Failed to load landlords: {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading landlords…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              No landlords found
            </div>
          ) : (
            filtered.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(l)}
                className="glass-strong p-5 text-left relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition"
                     style={{ background: planColor[l.plan] }} />
                <div className="relative flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl grid place-items-center text-sm font-semibold"
                       style={{ background: "var(--gradient-primary)" }}>{l.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-medium truncate">{l.org}</div>
                      {l.verified && <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "var(--cyan)" }} />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{l.name} · {l.city}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: `${planColor[l.plan]}20`, color: planColor[l.plan], boxShadow: `inset 0 0 0 1px ${planColor[l.plan]}40` }}>
                    {l.plan}
                  </span>
                </div>

                <div className="relative mt-5 grid grid-cols-3 gap-3">
                  <Mini label="Buildings" value={l.buildings.toString()} />
                  <Mini label="Tenants" value={l.tenants.toString()} />
                  <Mini label="Occupancy" value={`${l.occupancy}%`} />
                </div>

                <div className="relative mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-semibold">{l.revenue.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-muted-foreground">MRR</span>
                  </div>
                  <PaymentChip status={l.paymentStatus} />
                </div>

                <div className="relative mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 6%)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.occupancy}%` }}
                    transition={{ delay: 0.2 + i * 0.02, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                </div>
              </motion.button>
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && <DetailPanel landlord={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-2.5 py-2" style={{ background: "oklch(1 0 0 / 3%)" }}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function PaymentChip({ status }: { status: Landlord["paymentStatus"] }) {
  const map = {
    paid: { c: "var(--emerald)", l: "Paid" },
    pending: { c: "var(--amber)", l: "Pending" },
    failed: { c: "var(--rose)", l: "Failed" },
  };
  const s = map[status];
  return (
    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
          style={{ background: `${s.c}20`, color: s.c }}>
      {s.l}
    </span>
  );
}

function DetailPanel({ landlord, onClose }: { landlord: Landlord; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed right-0 top-0 z-50 h-full w-full sm:w-[460px] p-4"
      >
        <div className="glass-strong h-full p-6 overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-lg hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl grid place-items-center text-base font-semibold"
                 style={{ background: "var(--gradient-primary)" }}>{landlord.avatar}</div>
            <div>
              <div className="text-lg font-display font-semibold">{landlord.org}</div>
              <div className="text-sm text-muted-foreground">{landlord.name} · {landlord.email}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Mini label="Plan" value={landlord.plan} />
            <Mini label="MRR" value={`₹${landlord.revenue.toLocaleString("en-IN")}`} />
            <Mini label="Buildings" value={landlord.buildings.toString()} />
            <Mini label="Tenants" value={landlord.tenants.toString()} />
            <Mini label="Occupancy" value={`${landlord.occupancy}%`} />
            <Mini label="Last Active" value={landlord.lastActive} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="rounded-xl px-3 py-2.5 text-sm font-medium text-background"
                    style={{ background: "var(--gradient-primary)" }}>
              View buildings
            </button>
            <button className="rounded-xl px-3 py-2.5 text-sm font-medium border border-border hover:bg-white/5">
              Send message
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" /> Joined {landlord.joinedAt} · ID {landlord.id}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
