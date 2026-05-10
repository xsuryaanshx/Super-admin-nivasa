import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 1.4 }: Props) {
  const mv = useMotionValue(0);
  const out = useTransform(mv, (v) =>
    `${prefix}${v.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`
  );

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, duration, mv]);

  return <motion.span>{out}</motion.span>;
}
