"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { dreams } from "@/lib/content";

export default function Dreams() {
  const [thrown, setThrown] = useState(false);

  return (
    <ChapterShell
      id="dreams"
      eyebrow={dreams.eyebrow}
      title={dreams.title}
      subtitle={dreams.subtitle}
      background={
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0a1020 0%, #141b2e 40%, #1c2333 100%)",
          }}
        >
          {/* soft clouds */}
          {[
            { x: 10, y: 20, s: 1 },
            { x: 70, y: 15, s: 1.3 },
            { x: 40, y: 60, s: 1.1 },
            { x: 80, y: 70, s: 0.9 },
          ].map((c, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-2xl"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: 220 * c.s,
                height: 120 * c.s,
                background:
                  "radial-gradient(circle, rgba(200,155,109,0.18), transparent 70%)",
              }}
            />
          ))}
        </div>
      }
    >
      <div className="relative">
        {/* the plane */}
        <div className="relative mb-12 h-24">
          <AnimatePresence>
            {!thrown ? (
              <motion.button
                key="throw"
                onClick={() => setThrown(true)}
                data-cursor="hover"
                className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-4"
                exit={{ opacity: 0 }}
              >
                <span className="text-5xl" style={{ filter: "drop-shadow(0 0 10px rgba(255,231,194,.5))" }}>
                  ✈️
                </span>
                <span className="rounded-full border border-accent/40 px-6 py-2 text-xs uppercase tracking-cinematic text-highlight transition-all hover:border-accent hover:shadow-goldglow">
                  Throw it →
                </span>
              </motion.button>
            ) : (
              <motion.span
                key="flying"
                className="absolute top-1/2 text-5xl"
                initial={{ left: "0%", y: 0, rotate: -10 }}
                animate={{ left: "92%", y: [-10, -50, -10, -30, 0], rotate: [-10, 8, -6, 4, 0] }}
                transition={{ duration: 3, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0 0 10px rgba(255,231,194,.5))" }}
              >
                ✈️
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* dream islands */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.items.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={
                thrown
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 40, scale: 0.9 }
              }
              transition={{ delay: thrown ? 0.6 + i * 0.35 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass animate-floaty rounded-3xl p-7"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <p className="mb-2 text-xs uppercase tracking-cinematic text-accent">
                Dream {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-serif-title text-2xl text-primary">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{d.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
