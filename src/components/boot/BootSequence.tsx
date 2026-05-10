import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const lines = [
  "› Initializing Nivasa Core v4.2.1",
  "› Loading platform telemetry stream...",
  "› Authenticating Ami Group control plane",
  "› Synchronizing landlord registry · 1,284 nodes",
  "› AI insights engine warm · 4 models online",
  "› All subsystems nominal — handing off to UI",
];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 320);
    const end = setTimeout(onDone, 3200);
    return () => {
      clearInterval(t);
      clearTimeout(end);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
      style={{ background: "oklch(0.05 0.01 250)" }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Ambient grid */}
      <motion.div
        className="absolute inset-0 grid-bg"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.4 }}
      />
      {/* radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.82 0.17 215 / 25%), transparent 50%), radial-gradient(circle at 30% 70%, oklch(0.55 0.25 295 / 25%), transparent 50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Wireframe building */}
      <motion.svg
        viewBox="0 0 400 300"
        className="absolute w-[640px] max-w-[80vw] opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <defs>
          <linearGradient id="wire" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#00D1FF" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        {[
          "M80 280 L80 120 L160 80 L160 240 Z",
          "M160 240 L160 80 L240 60 L240 220 Z",
          "M240 220 L240 60 L320 100 L320 260 Z",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="url(#wire)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 + i * 0.2, ease: "easeInOut" }}
          />
        ))}
        {/* windows */}
        {Array.from({ length: 24 }).map((_, i) => {
          const cx = 90 + (i % 6) * 38;
          const cy = 140 + Math.floor(i / 6) * 30;
          return (
            <motion.rect
              key={i}
              x={cx} y={cy} width="8" height="8"
              fill="#00D1FF"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              transition={{ delay: 1.2 + i * 0.03, duration: 0.6 }}
            />
          );
        })}
      </motion.svg>

      {/* Data stream lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-40"
          style={{
            top: `${20 + i * 14}%`,
            background: "linear-gradient(90deg, transparent, #00D1FF, transparent)",
          }}
          initial={{ x: "-30vw", opacity: 0 }}
          animate={{ x: "120vw", opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, delay: 0.4 + i * 0.2, repeat: 1 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.7, type: "spring" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="text-5xl md:text-6xl font-display font-semibold tracking-tight">
            <span className="text-gradient">Nivasa</span>
          </div>
          <div className="text-xs uppercase tracking-[0.5em] text-muted-foreground">
            by Ami Group · Admin Control Center
          </div>
        </motion.div>

        <div className="font-mono text-xs text-muted-foreground space-y-1 min-h-[120px] w-[440px] max-w-[88vw] text-left">
          {lines.slice(0, step).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={i === step - 1 ? "text-foreground" : ""}
              style={i === step - 1 ? { color: "var(--cyan)" } : undefined}
            >
              {l}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
