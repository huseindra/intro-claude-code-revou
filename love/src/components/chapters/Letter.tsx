"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { Petals } from "../ui/Particles";
import { letter } from "@/lib/content";

/**
 * Chapter II — The envelope. Click to open it; the flap lifts, the letter
 * slides up and writes itself line by line while the sky warms to sunrise.
 */
export default function Letter({ onContinue }: { onContinue?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <ChapterShell
      id="letter"
      eyebrow={letter.eyebrow}
      title={letter.title}
      background={
        <>
          <div
            className="absolute inset-0 transition-opacity duration-[2000ms]"
            style={{
              opacity: open ? 1 : 0,
              background:
                "radial-gradient(120% 80% at 50% 110%, #C89B6D55 0%, #17181A 45%, #050505 100%)",
            }}
          />
          {open && <Petals count={16} seed={9} />}
        </>
      }
    >
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.button
              key="env"
              onClick={() => setOpen(true)}
              data-cursor="hover"
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative h-56 w-80 animate-floaty">
                {/* envelope body */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#211f1c] to-[#141210] shadow-glass" />
                {/* flap */}
                <div
                  className="absolute inset-x-0 top-0 h-28 origin-top rounded-t-xl bg-gradient-to-b from-[#2a2620] to-[#1c1915] transition-transform duration-700"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 85%)",
                  }}
                />
                {/* wax seal */}
                <div className="absolute left-1/2 top-[42%] grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-accent to-[#8a6842] text-highlight shadow-goldglow">
                  ♥
                </div>
              </div>
              <p className="mt-6 text-center text-xs uppercase tracking-cinematic text-accent">
                {letter.hint}
              </p>
            </motion.button>
          ) : (
            <motion.div
              key="paper"
              initial={{ opacity: 0, y: 60, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass w-full max-w-xl rounded-2xl p-8 md:p-12"
              style={{ perspective: 1000 }}
            >
              <div className="space-y-3">
                {letter.lines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.55, duration: 0.9 }}
                    className="font-hand text-2xl leading-relaxed text-primary md:text-3xl"
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + letter.lines.length * 0.55 }}
                  className="pt-4 text-right font-hand text-2xl text-accent"
                >
                  {letter.signature}
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + letter.lines.length * 0.55 }}
                onClick={onContinue}
                data-cursor="hover"
                className="mt-8 rounded-full border border-accent/40 px-8 py-2.5 text-sm uppercase tracking-cinematic text-highlight transition-all hover:border-accent hover:shadow-goldglow"
              >
                Continue →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterShell>
  );
}
