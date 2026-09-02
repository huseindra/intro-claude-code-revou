/**
 * audio.ts — A tiny procedural ambient engine built on the Web Audio API.
 * No audio files required. It gently generates:
 *   • piano  — slow, random arpeggios in a warm pentatonic scale
 *   • rain   — filtered noise + soft droplets
 *   • cafe   — low murmur of brown noise + distant clinks
 *
 * Everything fades in/out so nothing ever feels abrupt.
 */

export type Track = "piano" | "rain" | "cafe";

// A soft, consonant scale (C major pentatonic across a couple octaves).
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private track: Track = "piano";
  private stopFns: Array<() => void> = [];
  private timer: number | null = null;
  private prng = 123456;

  // Deterministic-ish PRNG so we avoid Math.random (also nicer, repeatable feel).
  private rand() {
    this.prng = (this.prng * 1103515245 + 12345) & 0x7fffffff;
    return this.prng / 0x7fffffff;
  }

  private ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  private noiseBuffer(seconds = 2) {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      // brown-ish noise (softer than white)
      const white = this.rand() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  private note(freq: number, time: number, dur: number, gain: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;

    // gentle bell-like partial
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.0;
    const g2 = ctx.createGain();
    g2.gain.value = gain * 0.18;

    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    g2.gain.setValueAtTime(0, time);
    g2.gain.linearRampToValueAtTime(gain * 0.18, time + 0.04);
    g2.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.7);

    osc.connect(g).connect(this.master!);
    osc2.connect(g2).connect(this.master!);
    osc.start(time);
    osc.stop(time + dur + 0.1);
    osc2.start(time);
    osc2.stop(time + dur * 0.7 + 0.1);
  }

  private startPiano() {
    const ctx = this.ctx!;
    const schedule = () => {
      const now = ctx.currentTime;
      // a little cluster of 1-3 notes
      const count = 1 + Math.floor(this.rand() * 3);
      for (let i = 0; i < count; i++) {
        const f = SCALE[Math.floor(this.rand() * SCALE.length)];
        this.note(f, now + i * 0.18, 2.6 + this.rand() * 1.5, 0.12);
      }
    };
    schedule();
    this.timer = window.setInterval(schedule, 2600 + Math.floor(this.rand() * 1200));
    this.stopFns.push(() => {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
    });
  }

  private startRain() {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(3);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 300;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    src.connect(hp).connect(lp).connect(g).connect(this.master!);
    src.start();

    // occasional soft droplets
    const drip = () => {
      const now = ctx.currentTime;
      this.note(600 + this.rand() * 900, now, 0.25, 0.05);
    };
    this.timer = window.setInterval(drip, 700 + Math.floor(this.rand() * 500));
    this.stopFns.push(() => {
      try { src.stop(); } catch {}
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
    });
  }

  private startCafe() {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(3);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const g = ctx.createGain();
    g.gain.value = 0.6;
    src.connect(lp).connect(g).connect(this.master!);
    src.start();

    const clink = () => {
      const now = ctx.currentTime;
      this.note(1400 + this.rand() * 1200, now, 0.12, 0.03);
    };
    this.timer = window.setInterval(clink, 1500 + Math.floor(this.rand() * 1800));
    this.stopFns.push(() => {
      try { src.stop(); } catch {}
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
    });
  }

  private startTrack() {
    if (this.track === "piano") this.startPiano();
    else if (this.track === "rain") this.startRain();
    else this.startCafe();
  }

  private clearTrack() {
    this.stopFns.forEach((fn) => fn());
    this.stopFns = [];
  }

  async play() {
    this.ensure();
    await this.ctx!.resume();
    this.clearTrack();
    this.startTrack();
    const t = this.ctx!.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(this.master!.gain.value, t);
    this.master!.gain.linearRampToValueAtTime(0.6, t + 1.2);
  }

  pause() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.8);
    window.setTimeout(() => this.clearTrack(), 900);
  }

  async setTrack(track: Track, playing: boolean) {
    this.track = track;
    if (playing) await this.play();
  }
}

let engine: AmbientEngine | null = null;
export function getEngine() {
  if (typeof window === "undefined") return null;
  if (!engine) engine = new AmbientEngine();
  return engine;
}
