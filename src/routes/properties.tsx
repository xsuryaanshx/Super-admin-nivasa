import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";
import { useBuildings } from "@/lib/supabase-data";
import { Home, Loader2 } from "lucide-react";

export const Route = createFileRoute("/properties")({
  head: () => ({ meta: [{ title: "Properties · Nivasa Admin" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { data: buildings = [], isLoading } = useBuildings();
  const total = buildings.reduce((a, b) => a + b.rooms, 0);

  return (
    <div className="space-y-6">
      <Topbar
        title="Properties"
        subtitle={isLoading ? "Loading…" : `${total} property units indexed across the network`}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading properties…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {buildings.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              No properties found
            </div>
          ) : (
            buildings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-strong p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl grid place-items-center"
                       style={{ background: "oklch(1 0 0 / 5%)", color: "var(--cyan)" }}>
                    <Home className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{b.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{b.landlord} · {b.city}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { l: "Units", v: b.rooms },
                    { l: "Filled", v: b.occupied },
                    { l: "Vacant", v: b.rooms - b.occupied },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg py-2" style={{ background: "oklch(1 0 0 / 3%)" }}>
                      <div className="text-lg font-semibold">{m.v}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
