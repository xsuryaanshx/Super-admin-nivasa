import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Home,
  CreditCard,
  TrendingUp,
  BarChart3,
  LifeBuoy,
  Sparkles,
  Bell,
  Settings,
  Zap,
} from "lucide-react";

const items = [
  { to: "/", label: "Platform Overview", icon: LayoutDashboard },
  { to: "/landlords", label: "Landlords", icon: Users },
  { to: "/buildings", label: "Buildings", icon: Building2 },
  { to: "/properties", label: "Properties", icon: Home },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/revenue", label: "Revenue", icon: TrendingUp },
  { to: "/analytics", label: "Platform Analytics", icon: BarChart3 },
  { to: "/support", label: "Support Center", icon: LifeBuoy },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col p-4 gap-6"
    >
      <div className="glass-strong p-5 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none"
             style={{ background: "radial-gradient(circle at 20% 0%, var(--cyan), transparent 60%)" }} />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl"
             style={{ background: "var(--gradient-primary)" }}>
          <Zap className="h-5 w-5 text-background" />
        </div>
        <div className="relative">
          <div className="font-display text-base font-semibold leading-tight tracking-tight">Nivasa</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">by Ami Group</div>
        </div>
      </div>

      <nav className="glass flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {items.map((it, i) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <motion.div
              key={it.to}
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 + i * 0.025 }}
            >
              <Link
                to={it.to}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.82 0.17 215 / 18%), oklch(0.55 0.25 295 / 18%))",
                      boxShadow: "inset 0 0 0 1px oklch(0.82 0.17 215 / 30%), 0 0 24px -8px oklch(0.82 0.17 215 / 60%)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`relative h-4 w-4 transition-colors ${active ? "text-cyan" : ""}`}
                      style={active ? { color: "var(--cyan)" } : undefined} />
                <span className="relative font-medium tracking-tight">{it.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="glass p-4 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-50"
             style={{ background: "var(--gradient-violet)" }} />
        <div className="relative flex items-center gap-3">
          <div className="h-9 w-9 rounded-full grid place-items-center font-semibold text-sm"
               style={{ background: "var(--gradient-primary)" }}>AG</div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">Ami Group Admin</div>
            <div className="text-xs text-muted-foreground truncate">superadmin@amigroup.in</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
