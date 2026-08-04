"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { wall } from "@/lib/content";

function Note({ text, index }: { text: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const rot = (index % 5) - 2; // slight scatter
  const hue = 34 + (index % 4) * 8;

  return (
    <motion.button
      onClick={() => setFlipped((f) => !f)}
      data-cursor="hover"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08 }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
      className="relative aspect-square"
      style={{ perspective: 900, rotate: `${rot}deg` }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* front */}
        <div
          className="absolute inset-0 grid place-items-center rounded-lg text-3xl shadow-[0_16px_30px_-12px_rgba(0,0,0,0.7)]"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(160deg, hsl(${hue} 45% 78%), hsl(${hue} 40% 64%))`,
            color: "#2a2620",
          }}
        >
          ♥
        </div>
        {/* back */}
        <div
          className="absolute inset-0 grid place-items-center rounded-lg p-4 text-center shadow-[0_16px_30px_-12px_rgba(0,0,0,0.7)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(160deg, #f6f0e6, #e7ddcd)",
          }}
        >
          <span className="font-hand text-xl leading-snug text-[#2a2620] md:text-2xl">
            {text}
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
}

export default function MessageWall() {
  return (
    <ChapterShell
      id="wall"
      eyebrow={wall.eyebrow}
      title={wall.title}
      subtitle={wall.subtitle}
      background={
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E10] to-[#050505]" />
      }
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {wall.notes.map((n, i) => (
          <Note key={i} text={n} index={i} />
        ))}
      </div>
    </ChapterShell>
  );
}
