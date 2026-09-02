"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "./StarField";
import { useStore } from "@/lib/store";
import { intro } from "@/lib/content";
import { getEngine } from "@/lib/audio";

/**
 * Black screen, drifting stars, a single line, an "Enter" button. On enter
 * the camera warps forward through the stars and hands off to the gate.
 */
export default function Intro() {
  const enter = useStore((s) => s.enter);
  const setPlaying = useStore((s) => s.setPlaying);
  const [warp, setWarp] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setWarp(1);
    // gently start the ambience on the first real interaction
    const engine = getEngine();
    if (engine) {
      engine.play();
      setPlaying(true);
    }
    window.setTimeout(() => enter(), 1600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] bg-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 1.2, delay: leaving ? 0.9 : 0 }}
    >
      <StarField count={1600} warp={warp} hue={40} />
      <div className="pointer-events-none absolute inset-0 vignette" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence>
          {!leaving && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(12px)" }}
                transition={{ duration: 2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-title max-w-2xl text-3xl font-light leading-tight text-primary md:text-5xl"
              >
                {intro.line}
              </motion.h1>

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 2.4 }}
                onClick={handleEnter}
                data-cursor="hover"
                className="group mt-14 rounded-full border border-accent/40 px-10 py-3 text-sm uppercase tracking-cinematic text-highlight transition-all hover:border-accent hover:shadow-goldglow"
              >
                <span className="inline-block transition-transform group-hover:tracking-[0.3em]">
                  {intro.cta}
                </span>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
