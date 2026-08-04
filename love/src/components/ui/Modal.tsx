"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  children,
  hue = 38,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  hue?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: `radial-gradient(80% 80% at 50% 50%, hsl(${hue} 45% 12% / 0.85), rgba(5,5,5,0.94))`,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="glass relative z-10 w-full max-w-lg rounded-3xl p-8 md:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              data-cursor="hover"
              className="absolute right-5 top-5 text-secondary transition-colors hover:text-primary"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
