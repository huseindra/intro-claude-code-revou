"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "../StarField";
import { Petals, Hearts } from "../ui/Particles";
import { ending, final } from "@/lib/content";

export default function Ending() {
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0 idle, 1 shower, 2 constellation

  const trigger = () => {
    setStage(1);
    window.setTimeout(() => setStage(2), 2600);
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg">
      <div className="absolute inset-0">
        <StarField count={1200} warp={stage >= 1 ? 0.4 : 0} hue={42} />
      </div>
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* idle heart button */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mb-8 text-xs uppercase tracking-cinematic text-accent">
              {final.buttonHint}
            </p>
            <motion.button
              onClick={trigger}
              data-cursor="hover"
              className="grid h-24 w-24 place-items-center rounded-full text-5xl text-highlight"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(200,155,109,0.35), rgba(23,24,26,0.6))",
                boxShadow: "0 0 60px -6px rgba(200,155,109,0.7)",
              }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Send love"
            >
              ♡
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* petal + heart shower */}
      {stage >= 1 && (
        <>
          <Petals count={40} seed={1} />
          <Hearts count={20} seed={6} />
        </>
      )}

      {/* final constellation message */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.h2
              initial={{ scale: 0.8, opacity: 0, filter: "blur(16px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 text-center font-serif-title text-5xl md:text-8xl"
            >
              <span className="gold-text">{ending.message}</span>
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* fade to black tail */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
