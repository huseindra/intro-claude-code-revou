"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, type Track } from "@/lib/store";
import { getEngine } from "@/lib/audio";

const TRACKS: { id: Track; label: string }[] = [
  { id: "piano", label: "Soft piano" },
  { id: "rain", label: "Rain" },
  { id: "cafe", label: "Cafe" },
];

/**
 * Floating glass music control with a spinning vinyl. Synthesizes ambient
 * audio in-browser (see lib/audio.ts) so there are no asset files to ship.
 */
export default function MusicPlayer() {
  const { playing, track, setPlaying, setTrack } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const engine = getEngine();
    if (!engine) return;
    if (playing) engine.play();
    else engine.pause();
  }, [playing]);

  const choose = async (t: Track) => {
    setTrack(t);
    const engine = getEngine();
    if (engine) await engine.setTrack(t, playing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass rounded-2xl p-2"
          >
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => choose(t.id)}
                className={`block w-40 rounded-xl px-4 py-2 text-left text-sm transition-colors ${
                  track === t.id
                    ? "bg-accent/20 text-highlight"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass flex items-center gap-3 rounded-full p-2 pr-4">
        <button
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause music" : "Play music"}
          className="relative grid h-12 w-12 place-items-center rounded-full"
        >
          {/* vinyl */}
          <span
            className={`absolute inset-0 rounded-full ${playing ? "vinyl-spin" : ""}`}
            style={{
              background:
                "repeating-radial-gradient(circle at center, #17181A 0 3px, #0b0b0c 3px 5px)",
              boxShadow: "0 0 24px -6px rgba(200,155,109,0.7)",
            }}
          />
          <span className="absolute h-3 w-3 rounded-full bg-accent" />
          <span className="relative text-highlight">
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M2 1.5v11l10-5.5z" />
              </svg>
            )}
          </span>
        </button>

        <button
          onClick={() => setOpen((o) => !o)}
          className="text-left"
          data-cursor="hover"
        >
          <div className="text-[10px] uppercase tracking-cinematic text-secondary">
            Ambience
          </div>
          <div className="text-sm text-primary">
            {TRACKS.find((t) => t.id === track)?.label}
          </div>
        </button>
      </div>

      <style>{`
        .vinyl-spin { animation: vinyl 4s linear infinite; }
        @keyframes vinyl { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
