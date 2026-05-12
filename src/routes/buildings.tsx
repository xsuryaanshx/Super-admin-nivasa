import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { useBuildings } from "@/lib/supabase-data";
import { Building2, Wrench, MapPin, Loader2 } from "lucide-react";

export const Route = createFileRoute("/buildings")({
  head: () => ({ meta: [{ title: "Buildings · Nivasa Admin" }] }),
  component: BuildingsPage,
});

const healthMap = {
  excellent: { c: "var(--emerald)", l: "Excellent" },
  good: { c: "var(--cyan)", l: "Good" },
  "needs-attention": { c: "var(--amber)", l: "Needs attention" },
} as const;

function BuildingsPage() {
  const { data: buildings = [], isLoading, error } = useBuildings();

  return (
    <div className="space-y-6">
      <Topbar
        title="Buildings"
        subtitle={isLoading ? "Loading…" : `${buildings.length} buildings across the platform`}
      />

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "oklch(0.4 0.15 25 / 20%)", color: "var(--rose)" }}>
          Failed to load buildings: {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading buildings…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {buildings.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              No buildings found
            </div>
          ) : (
            buildings.map((b, i) => {
              const occPct = b.rooms > 0 ? Math.round((b.occupied / b.rooms) * 100) : 0;
              const h = healthMap[b.health];
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="glass-strong overflow-hidden group"
                >
                  <div className="relative h-28 overflow-hidden">
                    <div className="absolute inset-0"
                         style={{
                           background: `linear-gradient(135deg, oklch(0.4 0.15 ${b.imageHue}), oklch(0.2 0.08 ${(b.imageHue + 60) % 360}))`,
                         }} />
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 200 100">
                      {Array.from({ length: 6 }).map((_, k) => (
                        <rect key={k} x={20 + k * 28} y={30 + (k % 3) * 8} width="22" height={50 - (k % 3) * 8}
                              fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
                      ))}
                    </svg>
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider"
                         style={{ background: "oklch(0 0 0 / 50%)", color: h.c, boxShadow: `inset 0 0 0 1px ${h.c}` }}>
                      {h.l}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display font-semibold truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3" /> {b.city} · {b.landlord}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-medium">{b.occupied}/{b.rooms} · {occPct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 6%)" }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${occPct}%` }}
                          transition={{ delay: 0.2 + i * 0.02, duration: 0.8 }}
                          className="h-full" style={{ background: "var(--gradient-revenue)" }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" /> {b.rooms} rooms
                      </div>
                      <div className="flex items-center gap-1.5"
                           style={{ color: b.maintenanceOpen > 0 ? "var(--amber)" : "var(--muted-foreground)" }}>
                        <Wrench className="h-3.5 w-3.5" /> {b.maintenanceOpen} open
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
