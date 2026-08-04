# For You — A Private Universe 🤍

An intimate, cinematic, single-page web experience built as a private
appreciation site for one person. It opens on a black sky of drifting stars,
asks for a password, and then unfolds — chapter by chapter, like a movie —
through letters, memory galaxies, a room of little things, a constellation you
draw by hand, a growing tree of light, and a final "I love you" written in the
stars.

> _"Some memories deserve more than words."_

---

## ✨ Make it yours (start here)

**Everything you'll want to change lives in one file:**
[`src/lib/content.ts`](./src/lib/content.ts)

That single file holds:

| What | Where in `content.ts` |
|------|------------------------|
| **The password** + hint | `config.password`, `config.passwordHint` |
| Names / initials / the date you met | `config` |
| The opening letter | `letter.lines` |
| Journey timeline stops | `journey.stops` |
| Memory Galaxy planets | `galaxy.planets` |
| Reasons you appreciate them | `reasons.items` |
| Room object notes | `room.objects` |
| Constellation reveal | `constellation.reveal` |
| Future dreams | `dreams.items` |
| Message-wall notes | `wall.notes` |
| Photo-cinema captions | `cinema.frames` |
| The final letter | `final`, `ending.message` |

The default password is **`forever`**. Change it before you share the link.

> **No image or audio files are required.** Every "photo" is rendered
> procedurally (gradients + WebGL), and the ambient music (soft piano, rain,
> cafe) is synthesized live in the browser with the Web Audio API. To use your
> own photos later, swap the procedural `Photo`/planet backgrounds in the
> relevant chapter components for `next/image`.

---

## 🎬 The chapters

1. **Intro** — black sky, drifting stars, one line, an *Enter* that warps you forward.
2. **Chapter I · Private Access** — a glass card, a floating 3D lock that glows as you type and swings open on the right word.
3. **Chapter II · Opening Letter** — an envelope that opens; the letter writes itself line by line as the sky warms to sunrise, with falling petals.
4. **Chapter III · Our Journey** — a winding road of floating polaroids; click one for a cinematic memory.
5. **Chapter IV · Memory Galaxy** — draggable, zoomable planets you can orbit; each opens a memory with its date, place and song.
6. **Chapter V · Reasons** — a floating crystal ringed by stars; tap one and it bursts into hearts and a message.
7. **Chapter VI · Little Things** — an interactive room; a lamp toggles night mode, a clock counts how long you've known each other, live.
8. **Chapter VII · Constellation** — connect the stars in order and they become a heart.
9. **Chapter VIII · Future Dreams** — throw a paper plane and the clouds open onto floating dream-islands.
10. **Chapter IX · Message Wall** — a wall of notes you flip over, one confession at a time.
11. **Chapter X · Photo Cinema** — a flickering film projector with grain, letterbox, and a slow Ken Burns drift.
12. **Final · The Heart** — a glowing tree grows leaves of light in a sunset garden, and a last letter appears.
13. **Ending** — a single ♡. Press it for a shower of petals and *I Love You* in gold.

---

## 🛠 Tech

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **TailwindCSS** — glassmorphism, the exact palette, cinematic type
- **Three.js / React Three Fiber / Drei** — the 3D lock, galaxy, crystal, tree
- **Framer Motion** — transitions, reveals, the finale
- **GSAP + Lenis** — buttery smooth scrolling wired into ScrollTrigger
- **Web Audio API** — procedural ambient soundtrack (no audio assets)
- A custom glowing-heart cursor that trails sparkles (desktop)
- Fully responsive; honours `prefers-reduced-motion`

---

## 🚀 Run it

```bash
cd love
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

The default password is `forever` — set your own in `src/lib/content.ts`.

---

## 📱 Notes

- **Music** starts on the first interaction (the *Enter* button) and can be
  paused / switched (piano · rain · cafe) from the floating player, bottom-right.
- **Mobile** keeps the magic — the custom cursor is desktop-only, touch drives
  the galaxy, and layouts reflow gracefully.
- The page is marked `noindex` — it's meant to be private.

Made with love, and a lot of WebGL. 🤍
