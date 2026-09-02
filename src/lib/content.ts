/**
 * ─────────────────────────────────────────────────────────────
 *  content.ts  —  The ONLY file you need to edit to make this
 *  experience yours. Change the password, the letters, the
 *  memories, the reasons. Everything below is placeholder poetry.
 * ─────────────────────────────────────────────────────────────
 */

export const config = {
  /** The password that unlocks the experience. Keep it meaningful. */
  password: "forever",
  /** A gentle hint shown under the lock. Set to "" to hide. */
  passwordHint: "the promise we made",

  /** Names / initials used across the story. */
  yourName: "You",
  partnerName: "My Love",
  initials: "A & J",
  /** The day it all began — used for the "how long we've known each other" clock. */
  sinceDate: "2021-06-14",
};

/* INTRO ─────────────────────────────────────────────────────── */
export const intro = {
  line: "Some memories deserve more than words.",
  cta: "Enter",
};

/* CHAPTER 1 — Private Access ────────────────────────────────── */
export const gate = {
  eyebrow: "Chapter I",
  title: "Private Access",
  prompt: "This place was made only for one person.",
  placeholder: "whisper the word",
  wrong: "Not quite. Take a breath and try again.",
};

/* CHAPTER 2 — Opening Letter ────────────────────────────────── */
export const letter = {
  eyebrow: "Chapter II",
  title: "An Opening Letter",
  hint: "Click the envelope",
  signature: "— always, me",
  lines: [
    "To the one who feels like home,",
    "I've started this letter a hundred times in my head.",
    "None of the words were ever big enough.",
    "So I built you a small universe instead —",
    "somewhere our memories could keep glowing.",
    "Stay a while. Wander slowly.",
    "Everything here is a way of saying:",
    "thank you for being you.",
  ],
};

/* CHAPTER 3 — Our Journey ───────────────────────────────────── */
export type Memory = {
  title: string;
  date: string;
  note: string;
  hue: number; // 0-360, drives the ambient color of the stop
};

export const journey = {
  eyebrow: "Chapter III",
  title: "Our Journey",
  subtitle: "A road across the sky, one memory at every stop.",
  stops: [
    { title: "The day we met", date: "Summer '21", note: "You laughed before I finished the joke. I was done for.", hue: 34 },
    { title: "First conversation", date: "That same night", note: "3am, and neither of us wanted to say goodnight.", hue: 210 },
    { title: "First date", date: "A week later", note: "Rain, one umbrella, and a walk that never really ended.", hue: 280 },
    { title: "The funny ones", date: "Always", note: "Inside jokes only we will ever understand.", hue: 48 },
    { title: "What we built", date: "Together", note: "Every small win felt bigger with you beside me.", hue: 150 },
    { title: "The hard days", date: "We stayed", note: "We learned that 'us' is a thing worth fighting for.", hue: 350 },
  ] as Memory[],
};

/* CHAPTER 4 — Memory Galaxy ─────────────────────────────────── */
export type Planet = {
  title: string;
  date: string;
  location: string;
  song: string;
  story: string;
  hue: number;
};

export const galaxy = {
  eyebrow: "Chapter IV",
  title: "Memory Galaxy",
  subtitle: "Drag to explore. Every planet is a moment we orbit.",
  planets: [
    { title: "Golden hour", date: "Aug 2021", location: "The pier", song: "our slow song", story: "The sky matched your eyes and I forgot my sentence.", hue: 32 },
    { title: "Road trip", date: "Oct 2021", location: "Somewhere north", song: "windows down anthem", story: "No map. No plan. Best day of the year.", hue: 200 },
    { title: "First snow", date: "Dec 2021", location: "Your window", song: "quiet piano", story: "You gasped like a kid. I fell a little deeper.", hue: 190 },
    { title: "That kitchen", date: "Spring 2022", location: "Home", song: "the dancing one", story: "We burned dinner and danced anyway.", hue: 300 },
    { title: "Sunrise hike", date: "Jun 2022", location: "The ridge", song: "big open sky", story: "We stopped talking. The view said enough.", hue: 140 },
    { title: "Just a Tuesday", date: "Whenever", location: "The couch", song: "no song, just us", story: "Ordinary, and somehow my favorite.", hue: 20 },
  ] as Planet[],
};

/* CHAPTER 5 — Reasons ───────────────────────────────────────── */
export const reasons = {
  eyebrow: "Chapter V",
  title: "Reasons I Appreciate You",
  subtitle: "Every star holds one. Reach out and touch it.",
  items: [
    "Thank you for believing in me.",
    "Thank you for always listening.",
    "Thank you for staying.",
    "Thank you for making ordinary days beautiful.",
    "Thank you for your patience with me.",
    "Thank you for your ridiculous, wonderful laugh.",
    "Thank you for being brave with me.",
    "Thank you for feeling like home.",
  ],
};

/* CHAPTER 6 — Little Things ──────────────────────────────────── */
export const room = {
  eyebrow: "Chapter VI",
  title: "Little Things",
  subtitle: "A room of ours. Touch anything.",
  objects: {
    coffee: { label: "Coffee", text: "Two cups, one always cooling because we're too busy talking." },
    flower: { label: "Flowers", text: "You keep them alive far longer than I ever could." },
    book: { label: "Book", text: "The one you dog-eared and left for me to find." },
    window: { label: "Window", text: "Golden light, and your silhouette I never get tired of." },
    clock: { label: "Clock", text: "How long we've known each other:" },
    lamp: { label: "Lamp", text: "Click to turn the room to night." },
  },
};

/* CHAPTER 7 — Constellation ──────────────────────────────────── */
export const constellation = {
  eyebrow: "Chapter VII",
  title: "Our Constellation",
  subtitle: "Connect the stars, in order.",
  reveal: "It was always a heart.",
};

/* CHAPTER 8 — Future Dreams ──────────────────────────────────── */
export const dreams = {
  eyebrow: "Chapter VIII",
  title: "Future Dreams",
  subtitle: "Throw the plane. Let the clouds open.",
  items: [
    { title: "Travel", text: "A list of cities we'll get lost in together." },
    { title: "A home", text: "Loud mornings, soft evenings, a door that's always ours." },
    { title: "The work", text: "Building things we're proud of, side by side." },
    { title: "Family", text: "Whatever that grows to mean for us." },
    { title: "The small goals", text: "A thousand tiny somedays, one at a time." },
  ],
};

/* CHAPTER 9 — Message Wall ───────────────────────────────────── */
export const wall = {
  eyebrow: "Chapter IX",
  title: "The Message Wall",
  subtitle: "Tap a note to turn it over.",
  notes: [
    "You steal the covers. I forgive you.",
    "I still get nervous before you call.",
    "Secret: I planned our 'accidental' first meeting.",
    "Your name is my favorite word to say.",
    "I saved every single one of your voice notes.",
    "You make me want to be someone worth staying for.",
    "I'd choose the long line if it meant standing with you.",
    "Confession: I'm writing this smiling like an idiot.",
  ],
};

/* CHAPTER 10 — Photo Cinema ──────────────────────────────────── */
export const cinema = {
  eyebrow: "Chapter X",
  title: "Photo Cinema",
  subtitle: "Sit back. The reel is rolling.",
  // Each frame is a caption + a hue for its procedural film still.
  frames: [
    { caption: "Reel 01 — the beginning", hue: 32 },
    { caption: "Reel 02 — the adventures", hue: 200 },
    { caption: "Reel 03 — the quiet ones", hue: 280 },
    { caption: "Reel 04 — the laughing fits", hue: 48 },
    { caption: "Reel 05 — us, still going", hue: 150 },
  ],
};

/* FINAL — The Heart ─────────────────────────────────────────── */
export const final = {
  eyebrow: "Final Chapter",
  title: "Thank you.",
  body: ["If I had to choose again,", "I'd still choose you."],
  buttonHint: "One more thing —",
};

/* ENDING ─────────────────────────────────────────────────────── */
export const ending = {
  message: "I Love You",
};
