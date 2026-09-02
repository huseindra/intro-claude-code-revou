"use client";

import { useMemo } from "react";

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Softly falling petals. Pure CSS animation, cheap and pretty. */
export function Petals({ count = 18, seed = 7 }: { count?: number; seed?: number }) {
  const items = useMemo(() => {
    const rand = seedRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      delay: rand() * 8,
      dur: 8 + rand() * 8,
      size: 8 + rand() * 12,
      hue: 20 + rand() * 30,
      drift: (rand() - 0.5) * 120,
      key: i,
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.key}
          className="petal absolute top-[-5%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.8,
            background: `radial-gradient(circle at 30% 30%, hsl(${p.hue} 70% 80%), hsl(${p.hue} 60% 55%))`,
            borderRadius: "60% 40% 55% 45%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            // @ts-expect-error custom prop
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        .petal { opacity: 0; animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes fall {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0; }
          10% { opacity: .9; }
          90% { opacity: .8; }
          100% { transform: translate(var(--drift), 110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Rising glowing hearts. */
export function Hearts({ count = 10, seed = 3 }: { count?: number; seed?: number }) {
  const items = useMemo(() => {
    const rand = seedRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      delay: rand() * 4,
      dur: 5 + rand() * 5,
      size: 10 + rand() * 16,
      key: i,
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h) => (
        <span
          key={h.key}
          className="heart absolute bottom-[-5%] text-highlight"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.dur}s`,
            filter: "drop-shadow(0 0 6px rgba(255,231,194,.8))",
          }}
        >
          ♥
        </span>
      ))}
      <style>{`
        .heart { opacity: 0; animation-name: rise; animation-timing-function: ease-in; animation-iteration-count: infinite; }
        @keyframes rise {
          0% { transform: translateY(0) scale(.6); opacity: 0; }
          15% { opacity: .9; }
          100% { transform: translateY(-90vh) scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Slow-drifting fireflies. */
export function Fireflies({ count = 30, seed = 11 }: { count?: number; seed?: number }) {
  const items = useMemo(() => {
    const rand = seedRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 6,
      dur: 4 + rand() * 6,
      size: 2 + rand() * 4,
      key: i,
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((f) => (
        <span
          key={f.key}
          className="firefly absolute rounded-full"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            background: "radial-gradient(circle, #FFE7C2, rgba(200,155,109,0))",
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
          }}
        />
      ))}
      <style>{`
        .firefly { animation-name: glow; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes glow {
          0%,100% { opacity: 0; transform: translate(0,0); }
          50% { opacity: 1; transform: translate(10px,-14px); }
        }
      `}</style>
    </div>
  );
}
