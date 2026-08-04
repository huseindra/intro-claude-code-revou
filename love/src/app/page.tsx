"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useStore } from "@/lib/store";

import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import MusicPlayer from "@/components/MusicPlayer";
import Intro from "@/components/Intro";

import Gate from "@/components/chapters/Gate";
import Letter from "@/components/chapters/Letter";
import Journey from "@/components/chapters/Journey";
import Galaxy from "@/components/chapters/Galaxy";
import Reasons from "@/components/chapters/Reasons";
import Room from "@/components/chapters/Room";
import Constellation from "@/components/chapters/Constellation";
import Dreams from "@/components/chapters/Dreams";
import MessageWall from "@/components/chapters/MessageWall";
import Cinema from "@/components/chapters/Cinema";
import TheHeart from "@/components/chapters/TheHeart";
import Ending from "@/components/chapters/Ending";

const CHAPTERS = [
  { id: "letter", label: "Letter" },
  { id: "journey", label: "Journey" },
  { id: "galaxy", label: "Galaxy" },
  { id: "reasons", label: "Reasons" },
  { id: "room", label: "Room" },
  { id: "constellation", label: "Stars" },
  { id: "dreams", label: "Dreams" },
  { id: "wall", label: "Wall" },
  { id: "cinema", label: "Cinema" },
  { id: "the-heart", label: "Heart" },
];

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[210] h-0.5 w-full origin-left bg-gradient-to-r from-accent to-highlight"
      style={{ scaleX }}
    />
  );
}

function ChapterNav() {
  const [active, setActive] = useState("letter");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 }
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-[200] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {CHAPTERS.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          data-cursor="hover"
          className="group flex items-center gap-2"
        >
          <span
            className={`text-[10px] uppercase tracking-cinematic transition-all ${
              active === c.id ? "text-highlight opacity-100" : "text-secondary opacity-0 group-hover:opacity-100"
            }`}
          >
            {c.label}
          </span>
          <span
            className={`h-1.5 rounded-full transition-all ${
              active === c.id ? "h-4 w-1.5 bg-accent" : "w-1.5 bg-white/25 group-hover:bg-white/50"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

export default function Page() {
  const { entered, unlocked } = useStore();
  const [mounted, setMounted] = useState(false);

  // Canvas-heavy components are client only; wait for mount to avoid SSR.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-screen bg-bg" />;
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <CustomCursor />

      <AnimatePresence>{!entered && <Intro key="intro" />}</AnimatePresence>

      {entered && !unlocked && <Gate key="gate" />}

      {entered && unlocked && (
        <SmoothScroll>
          <ProgressBar />
          <ChapterNav />
          <MusicPlayer />

          <main className="relative">
            <Letter onContinue={() => scrollTo("journey")} />
            <Journey />
            <Galaxy />
            <Reasons />
            <Room />
            <Constellation />
            <Dreams />
            <MessageWall />
            <Cinema />
            <TheHeart />
            <Ending />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}
