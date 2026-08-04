"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { useStore } from "@/lib/store";
import { config, room } from "@/lib/content";

type Key = keyof typeof room.objects;

function useElapsed(since: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return null;
  const start = new Date(since).getTime();
  let s = Math.max(0, Math.floor((now - start) / 1000));
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return { days, h, m, s };
}

function Hotspot({
  x,
  y,
  label,
  active,
  onClick,
  children,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={label}
    >
      <span
        className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl transition-all md:h-20 md:w-20 ${
          active
            ? "scale-110 bg-accent/25 shadow-goldglow"
            : "bg-white/5 group-hover:bg-white/10 group-hover:scale-105"
        }`}
      >
        {children}
      </span>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-cinematic text-secondary opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

export default function Room() {
  const { night, toggleNight } = useStore();
  const [active, setActive] = useState<Key | null>(null);
  const elapsed = useElapsed(config.sinceDate);

  const objectEmoji: Record<Key, string> = {
    coffee: "☕",
    flower: "🌷",
    book: "📖",
    window: "🪟",
    clock: "🕰️",
    lamp: "💡",
  };

  const handle = (k: Key) => {
    if (k === "lamp") {
      toggleNight();
      setActive("lamp");
      return;
    }
    setActive(k);
  };

  return (
    <ChapterShell
      id="room"
      eyebrow={room.eyebrow}
      title={room.title}
      subtitle={room.subtitle}
      background={
        <motion.div
          className="absolute inset-0"
          animate={{
            background: night
              ? "radial-gradient(120% 100% at 50% 0%, #0a0b14, #050507 70%)"
              : "radial-gradient(120% 100% at 50% 0%, #201a12, #0E0E10 70%)",
          }}
          transition={{ duration: 1.2 }}
        />
      }
    >
      <div className="relative mx-auto mt-4 w-full max-w-3xl">
        <motion.div
          className="glass relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
          animate={{ filter: night ? "brightness(0.55)" : "brightness(1)" }}
          transition={{ duration: 1 }}
        >
          {/* floor / wall split */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-x-0 top-0 h-2/3"
              style={{
                background: night
                  ? "linear-gradient(#11131f,#0b0c14)"
                  : "linear-gradient(#241d15,#181310)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background: night
                  ? "linear-gradient(#0b0c14,#070810)"
                  : "linear-gradient(#181310,#100c09)",
              }}
            />
            {/* window light */}
            <motion.div
              className="absolute left-[18%] top-[16%] h-32 w-40 rounded-lg"
              animate={{
                boxShadow: night
                  ? "0 0 80px 20px rgba(120,140,255,0.15)"
                  : "0 0 90px 30px rgba(255,220,160,0.35)",
                background: night
                  ? "linear-gradient(#121730,#0a0c1a)"
                  : "linear-gradient(#ffe7c2,#c89b6d)",
              }}
              transition={{ duration: 1 }}
            />
          </div>

          {/* hotspots */}
          <Hotspot x={26} y={30} label={room.objects.window.label} active={active === "window"} onClick={() => handle("window")}>
            {objectEmoji.window}
          </Hotspot>
          <Hotspot x={62} y={62} label={room.objects.coffee.label} active={active === "coffee"} onClick={() => handle("coffee")}>
            {objectEmoji.coffee}
          </Hotspot>
          <Hotspot x={80} y={40} label={room.objects.flower.label} active={active === "flower"} onClick={() => handle("flower")}>
            {objectEmoji.flower}
          </Hotspot>
          <Hotspot x={44} y={70} label={room.objects.book.label} active={active === "book"} onClick={() => handle("book")}>
            {objectEmoji.book}
          </Hotspot>
          <Hotspot x={82} y={72} label={room.objects.clock.label} active={active === "clock"} onClick={() => handle("clock")}>
            {objectEmoji.clock}
          </Hotspot>
          <Hotspot x={20} y={64} label={room.objects.lamp.label} active={active === "lamp"} onClick={() => handle("lamp")}>
            {objectEmoji.lamp}
          </Hotspot>
        </motion.div>

        {/* note panel */}
        <div className="mt-6 min-h-[6rem]">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <p className="mb-1 text-xs uppercase tracking-cinematic text-accent">
                  {room.objects[active].label}
                </p>
                <p className="font-hand text-2xl text-primary md:text-3xl">
                  {room.objects[active].text}
                </p>
                {active === "clock" && elapsed && (
                  <p className="mt-3 font-serif-title text-2xl text-highlight md:text-4xl">
                    {elapsed.days.toLocaleString()} days · {elapsed.h}h {elapsed.m}m {elapsed.s}s
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ChapterShell>
  );
}
