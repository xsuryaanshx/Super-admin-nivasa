import { Outlet } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { BootSequence } from "../boot/BootSequence";
import { useRouterState } from "@tanstack/react-router";

export function AppShell() {
  const [booted, setBooted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("nivasa-booted");
    if (seen) {
      setBooted(true);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {!booted && (
          <BootSequence
            onDone={() => {
              sessionStorage.setItem("nivasa-booted", "1");
              setBooted(true);
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
