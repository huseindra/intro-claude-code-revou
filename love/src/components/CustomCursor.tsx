"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

type Spark = { x: number; y: number; life: number; vx: number; vy: number; el: HTMLDivElement };

/**
 * A tiny glowing heart that follows the pointer and leaves a trail of
 * fading sparkles. Grows on hover of interactive elements. Desktop only.
 */
export default function CustomCursor() {
  const finePointer = useStore((s) => s.finePointer);
  const setFinePointer = useStore((s) => s.setFinePointer);
  const heartRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setFinePointer(fine);
    if (!fine) return;
    document.body.classList.add("custom-cursor");
    return () => document.body.classList.remove("custom-cursor");
  }, [setFinePointer]);

  useEffect(() => {
    if (!finePointer) return;
    const heart = heartRef.current!;
    const ring = ringRef.current!;
    const layer = layerRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let lastSpark = 0;
    const sparks: Spark[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = e.target as HTMLElement;
      hovering = !!el.closest(
        "a,button,input,[data-cursor='hover'],[role='button']"
      );
      // spawn sparkles as the pointer moves
      const now = performance.now();
      if (now - lastSpark > 28) {
        lastSpark = now;
        spawnSpark(mx, my);
      }
    };

    const spawnSpark = (x: number, y: number) => {
      const el = document.createElement("div");
      el.className = "cc-spark";
      layer.appendChild(el);
      sparks.push({
        x,
        y,
        life: 1,
        vx: (seededRand() - 0.5) * 0.6,
        vy: (seededRand() - 0.5) * 0.6 - 0.2,
        el,
      });
    };

    let seed = 991;
    const seededRand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    let raf = 0;
    const loop = () => {
      hx += (mx - hx) * 0.22;
      hy += (my - hy) * 0.22;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      const scale = hovering ? 1.9 : 1;
      heart.style.transform = `translate3d(${hx - 9}px, ${hy - 8}px, 0) scale(${scale})`;
      ring.style.transform = `translate3d(${rx - 22}px, ${ry - 22}px, 0) scale(${hovering ? 1.5 : 1})`;
      ring.style.opacity = hovering ? "0.9" : "0.35";

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.03;
        s.x += s.vx;
        s.y += s.vy;
        if (s.life <= 0) {
          s.el.remove();
          sparks.splice(i, 1);
          continue;
        }
        s.el.style.opacity = String(s.life);
        s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) scale(${s.life})`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      sparks.forEach((s) => s.el.remove());
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={layerRef} className="absolute inset-0" />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-11 w-11 rounded-full border border-accent/60"
        style={{ transition: "opacity .2s" }}
      />
      <div
        ref={heartRef}
        className="absolute left-0 top-0 text-[18px] leading-none will-change-transform"
        style={{
          filter: "drop-shadow(0 0 6px rgba(255,231,194,0.9))",
          transition: "transform .08s",
        }}
      >
        <span style={{ color: "#FFE7C2" }}>♥</span>
      </div>
      <style>{`
        .cc-spark {
          position: absolute;
          left: 0; top: 0;
          width: 4px; height: 4px;
          margin: -2px 0 0 -2px;
          border-radius: 999px;
          background: radial-gradient(circle, #FFE7C2, rgba(200,155,109,0));
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
