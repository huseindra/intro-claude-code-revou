"use client";

import { create } from "zustand";

export type Track = "piano" | "rain" | "cafe";

type State = {
  /** Intro overlay dismissed ("Enter" clicked). */
  entered: boolean;
  /** Correct password submitted. */
  unlocked: boolean;
  /** Ambient audio playing. */
  playing: boolean;
  /** Selected ambient track. */
  track: Track;
  /** Chapter 6 night-mode toggle. */
  night: boolean;
  /** Whether the pointer is a fine pointer (desktop) → custom cursor. */
  finePointer: boolean;

  enter: () => void;
  unlock: () => void;
  setPlaying: (v: boolean) => void;
  setTrack: (t: Track) => void;
  toggleNight: () => void;
  setFinePointer: (v: boolean) => void;
};

export const useStore = create<State>((set) => ({
  entered: false,
  unlocked: false,
  playing: false,
  track: "piano",
  night: false,
  finePointer: false,

  enter: () => set({ entered: true }),
  unlock: () => set({ unlocked: true }),
  setPlaying: (v) => set({ playing: v }),
  setTrack: (t) => set({ track: t }),
  toggleNight: () => set((s) => ({ night: !s.night })),
  setFinePointer: (v) => set({ finePointer: v }),
}));
