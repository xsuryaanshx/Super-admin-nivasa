import { motion } from "framer-motion";
import { Search, Command, Bell } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-wrap items-center justify-between gap-4 px-2 pt-2 pb-6"
    >
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--emerald)" }} />
          Live · Production
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight font-display">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="glass flex items-center gap-2 px-3 py-2 min-w-[280px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search landlords, buildings, tickets..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>
        <button className="glass h-10 w-10 grid place-items-center hover:scale-105 transition-transform relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: "var(--cyan)" }} />
        </button>
      </div>
    </motion.header>
  );
}
