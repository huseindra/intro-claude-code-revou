"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { cinema } from "@/lib/content";

export default function Cinema() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setI((v) => (v + 1) % cinema.frames.length);
    }, 4500);
    return () => clearInterval(id);
  }, [playing]);

  const frame = cinema.frames[i];

  return (
    <ChapterShell
      id="cinema"
      eyebrow={cinema.eyebrow}
      title={cinema.title}
      subtitle={cinema.subtitle}
      background={<div className="absolute inset-0 bg-[#020203]" />}
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          {/* letterbox */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[8%] bg-black" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[8%] bg-black" />

          <AnimatePresence mode="popLayout">
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.18 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 4.6, ease: "linear" } }}
              style={{
                background: `radial-gradient(80% 80% at 40% 30%, hsl(${frame.hue} 55% 45%), hsl(${
                  (frame.hue + 40) % 360
                } 40% 10%))`,
              }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-serif-title text-6xl text-white/20">♥</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* film grain */}
          <div className="grain pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-60" />
          {/* flicker */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 bg-white"
            animate={{ opacity: [0, 0.04, 0, 0.02, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* projector vignette */}
          <div className="vignette pointer-events-none absolute inset-0 z-10" />

          {/* caption */}
          <div className="absolute bottom-[10%] left-0 right-0 z-20 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="font-hand text-2xl text-highlight md:text-3xl"
              >
                {frame.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => setPlaying((p) => !p)}
            data-cursor="hover"
            className="text-xs uppercase tracking-cinematic text-secondary transition-colors hover:text-primary"
          >
            {playing ? "❚❚ pause reel" : "▶ play reel"}
          </button>
          <div className="flex gap-2">
            {cinema.frames.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Frame ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  k === i ? "w-6 bg-accent" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
