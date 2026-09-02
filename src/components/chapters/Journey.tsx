"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import Modal from "../ui/Modal";
import { journey, type Memory } from "@/lib/content";

/** A procedural "photo" so no image assets are required. */
function Photo({ hue, label }: { hue: number; label: string }) {
  return (
    <div
      className="relative grid h-full w-full place-items-center overflow-hidden"
      style={{
        background: `linear-gradient(150deg, hsl(${hue} 55% 32%), hsl(${
          (hue + 40) % 360
        } 45% 14%))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(60% 50% at 30% 20%, hsl(${hue} 80% 70% / .8), transparent)`,
        }}
      />
      <span className="relative font-serif-title text-4xl text-white/80">♥</span>
      <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-cinematic text-white/70">
        {label}
      </span>
    </div>
  );
}

function Polaroid({
  memory,
  index,
  onOpen,
}: {
  memory: Memory;
  index: number;
  onOpen: () => void;
}) {
  const left = index % 2 === 0;
  return (
    <div
      className={`relative flex w-full ${
        left ? "justify-start md:pr-[52%]" : "justify-end md:pl-[52%]"
      }`}
    >
      {/* node on the road */}
      <span className="absolute left-1/2 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-goldglow md:block" />
      <motion.button
        onClick={onOpen}
        data-cursor="hover"
        initial={{ opacity: 0, y: 60, rotate: left ? -6 : 6 }}
        whileInView={{ opacity: 1, y: 0, rotate: left ? -3 : 3 }}
        whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 rounded-sm bg-[#f4efe6] p-3 pb-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        <div className="h-56 w-full">
          <Photo hue={memory.hue} label={memory.date} />
        </div>
        <p className="mt-3 text-center font-hand text-2xl text-[#2a2620]">
          {memory.title}
        </p>
      </motion.button>
    </div>
  );
}

export default function Journey() {
  const [active, setActive] = useState<Memory | null>(null);

  return (
    <ChapterShell
      id="journey"
      eyebrow={journey.eyebrow}
      title={journey.title}
      subtitle={journey.subtitle}
      full={false}
      background={
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050505, #0b0c10 40%, #0E0E10 100%)",
          }}
        />
      }
    >
      <div className="relative py-10">
        {/* the winding road */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
        </div>

        <div className="flex flex-col gap-24">
          {journey.stops.map((m, i) => (
            <Polaroid key={i} memory={m} index={i} onOpen={() => setActive(m)} />
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} hue={active?.hue ?? 38}>
        {active && (
          <div>
            <div className="mb-5 h-64 w-full overflow-hidden rounded-xl">
              <Photo hue={active.hue} label={active.date} />
            </div>
            <p className="text-xs uppercase tracking-cinematic text-accent">
              {active.date}
            </p>
            <h3 className="mt-1 font-serif-title text-3xl text-primary">
              {active.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-secondary">
              {active.note}
            </p>
          </div>
        )}
      </Modal>
    </ChapterShell>
  );
}
