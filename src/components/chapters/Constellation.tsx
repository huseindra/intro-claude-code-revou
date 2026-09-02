"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { Hearts } from "../ui/Particles";
import { constellation } from "@/lib/content";

/** Heart-shaped set of points (parametric heart), sampled into ~12 stars. */
function heartPoints(n: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    pts.push({ x: 50 + x * 1.9, y: 50 - y * 1.9 });
  }
  return pts;
}

export default function Constellation() {
  const points = useMemo(() => heartPoints(12), []);
  const [order, setOrder] = useState<number[]>([]);
  const done = order.length === points.length;

  const nextIndex = order.length; // stars must be tapped in sequence
  const click = (i: number) => {
    if (done) return;
    if (i === nextIndex) setOrder((o) => [...o, i]);
  };
  const reset = () => setOrder([]);

  return (
    <ChapterShell
      id="constellation"
      eyebrow={constellation.eyebrow}
      title={constellation.title}
      subtitle={constellation.subtitle}
      background={
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060c] to-[#050505]" />
      }
    >
      <div className="relative mx-auto w-full max-w-xl">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full"
          animate={done ? { rotate: [0, 360] } : {}}
          transition={done ? { duration: 40, repeat: Infinity, ease: "linear" } : {}}
        >
          {/* connecting lines */}
          {order.slice(1).map((idx, k) => {
            const a = points[order[k]];
            const b = points[idx];
            return (
              <motion.line
                key={k}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={done ? "#FFE7C2" : "#C89B6D"}
                strokeWidth={0.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
          {/* closing line when complete */}
          {done && (
            <motion.line
              x1={points[order[order.length - 1]].x}
              y1={points[order[order.length - 1]].y}
              x2={points[order[0]].x}
              y2={points[order[0]].y}
              stroke="#FFE7C2"
              strokeWidth={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {points.map((p, i) => {
            const connected = order.includes(i);
            const isNext = i === nextIndex && !done;
            return (
              <g key={i} onClick={() => click(i)} style={{ cursor: "pointer" }}>
                <circle cx={p.x} cy={p.y} r={3.4} fill="transparent" />
                {isNext && (
                  <circle cx={p.x} cy={p.y} r={2.4} fill="none" stroke="#FFE7C2" strokeWidth={0.3}>
                    <animate attributeName="r" values="1.6;2.8;1.6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={connected ? 1.3 : 0.9}
                  fill={connected ? "#FFE7C2" : isNext ? "#FFFFFF" : "#8a8a8a"}
                  style={{ filter: connected || isNext ? "drop-shadow(0 0 2px #FFE7C2)" : "none" }}
                />
              </g>
            );
          })}
        </motion.svg>

        {done && <Hearts count={6} seed={5} />}

        <div className="mt-8 text-center">
          <AnimatePresence>
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <p className="font-serif-title text-3xl text-highlight md:text-4xl">
                  {constellation.reveal}
                </p>
              </motion.div>
            ) : (
              <button
                onClick={reset}
                data-cursor="hover"
                className="text-xs uppercase tracking-cinematic text-secondary transition-colors hover:text-primary"
              >
                {order.length ? "start over" : "tap the glowing star to begin"}
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ChapterShell>
  );
}
