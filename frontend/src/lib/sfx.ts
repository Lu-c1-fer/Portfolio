// Procedural Web Audio synth SFX. All sounds are generated, no audio files.
// Default: muted. Persisted in localStorage.

const STORAGE_KEY = "nes_sound_enabled";

let ctx: AudioContext | null = null;
let enabled = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
})();

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

type ToneOptions = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  gain?: number;
  when?: number;
};

function tone({ freq, dur = 0.08, type = "square", attack = 0.005, release = 0.05, gain = 0.08, when = 0 }: ToneOptions) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.linearRampToValueAtTime(0, t + dur + release);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + release + 0.02);
}

type SweepOptions = {
  from: number;
  to: number;
  dur?: number;
  gain?: number;
  type?: OscillatorType;
  when?: number;
};

function sweep({ from, to, dur = 0.12, gain = 0.07, type = "square", when = 0 }: SweepOptions) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export type SfxName =
  | "coin"
  | "blip"
  | "oneup"
  | "powerup"
  | "jump"
  | "bump"
  | "gameover"
  | "pause";

const SFX: Record<SfxName, () => void> = {
  coin() {
    tone({ freq: 988, dur: 0.06, gain: 0.06 });
    tone({ freq: 1319, dur: 0.1, gain: 0.06, when: 0.06 });
  },
  blip() {
    tone({ freq: 660, dur: 0.04, gain: 0.04 });
  },
  oneup() {
    const notes = [659, 784, 1047, 1319, 1568];
    notes.forEach((f, i) => tone({ freq: f, dur: 0.09, gain: 0.06, when: i * 0.07 }));
  },
  powerup() {
    sweep({ from: 392, to: 1568, dur: 0.35, gain: 0.07 });
  },
  jump() {
    sweep({ from: 523, to: 880, dur: 0.1, gain: 0.06 });
  },
  bump() {
    tone({ freq: 196, dur: 0.06, gain: 0.05, type: "triangle" });
  },
  gameover() {
    const notes = [523, 466, 392, 311, 261];
    notes.forEach((f, i) => tone({ freq: f, dur: 0.12, gain: 0.06, when: i * 0.1 }));
  },
  pause() {
    tone({ freq: 440, dur: 0.05, gain: 0.04 });
  },
};

function play(name: SfxName) {
  if (!enabled) return;
  SFX[name]?.();
}

function setEnabled(v: boolean) {
  enabled = v;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (enabled) {
    ensureCtx();
    tone({ freq: 880, dur: 0.05, gain: 0.05 });
  }
}

function isEnabled() {
  return enabled;
}

export const sfx = { play, setEnabled, isEnabled };
