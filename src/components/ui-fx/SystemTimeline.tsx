import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, IndianRupee, UserPlus, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";

type EventKind = "deploy" | "payment" | "signup" | "ai" | "alert" | "audit";

interface TLEvent {
  id: string;
  kind: EventKind;
  title: string;
  meta: string;
  ts: number;
}

const seedEvents: Omit<TLEvent, "id" | "ts">[] = [
  { kind: "deploy", title: "Edge nodes synced", meta: "ap-south-1 · 84ms" },
  { kind: "payment", title: "₹24,000 received", meta: "Iyer Holdings · Enterprise" },
  { kind: "signup", title: "New landlord onboarded", meta: "Verma Estates · Mumbai" },
  { kind: "ai", title: "AI churn model recalculated", meta: "v2.4.1 · 0 anomalies" },
  { kind: "audit", title: "Admin role verified", meta: "compliance check passed" },
  { kind: "alert", title: "Payments retry queue rising", meta: "+3.2× vs baseline" },
  { kind: "payment", title: "₹3,500 received", meta: "Sharma Group · Growth" },
  { kind: "deploy", title: "Realtime channel scaled", meta: "32k connections" },
];

const meta: Record<EventKind, { icon: typeof Activity; color: string }> = {
  deploy: { icon: Activity, color: "var(--cyan)" },
  payment: { icon: IndianRupee, color: "var(--emerald)" },
  signup: { icon: UserPlus, color: "var(--violet)" },
  ai: { icon: Sparkles, color: "var(--blue)" },
  audit: { icon: ShieldCheck, color: "var(--emerald)" },
  alert: { icon: AlertTriangle, color: "var(--amber)" },
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function SystemTimeline() {
  const [events, setEvents] = useState<TLEvent[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial population
    setEvents(
      seedEvents.slice(0, 5).map((e, i) => ({
        ...e,
        id: `tl-${Date.now()}-${i}`,
        ts: Date.now() - (5 - i) * 9000,
      })),
    );

    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % seedEvents.length;
      const next: TLEvent = { ...seedEvents[i], id: `tl-${Date.now()}`, ts: Date.now() };
      setEvents((prev) => [next, ...prev].slice(0, 8));
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-4 top-2 bottom-2 w-px" style={{ background: "linear-gradient(180deg, transparent, oklch(1 0 0 / 12%), transparent)" }} />
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const m = meta[e.kind];
            const Icon = m.icon;
            return (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 16, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                className="relative flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "oklch(1 0 0 / 3%)" }}
              >
                <div
                  className="relative z-10 h-8 w-8 rounded-full grid place-items-center shrink-0"
                  style={{
                    background: "oklch(0.13 0.012 250)",
                    color: m.color,
                    boxShadow: `inset 0 0 0 1px ${m.color}55, 0 0 14px ${m.color}33`,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{e.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{e.meta}</div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{fmt(e.ts)}</div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
