// Synthesizer SFX RPG + Panggung Warkop memakai Web Audio API murni.

class RpgAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.lastStepAt = 0;
  }

  setMuted(value) {
    this.muted = Boolean(value);
  }

  ensureContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq, duration, type = 'triangle', volume = 0.12, delay = 0, endFreq = null) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
    }
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playNoise(duration, volume = 0.07, delay = 0, highpass = 2400) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const size = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = highpass;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  playFootstep(sprinting = false) {
    const now = performance.now();
    const interval = sprinting ? 210 : 310;
    if (now - this.lastStepAt < interval) return;
    this.lastStepAt = now;
    this.playTone(135 + Math.random() * 25, 0.04, 'sine', 0.035, 0, 80);
  }

  playClick() {
    this.playTone(500, 0.055, 'sine', 0.08, 0, 360);
  }

  playDialogueOpen() {
    this.playTone(440, 0.08, 'triangle', 0.1, 0);
    this.playTone(587.33, 0.1, 'triangle', 0.1, 0.06);
  }

  playCorrect() {
    this.playTone(523.25, 0.12, 'triangle', 0.14, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.14, 0.08);
    this.playTone(783.99, 0.22, 'sine', 0.15, 0.16);
  }

  playWrong() {
    this.playTone(300, 0.16, 'sawtooth', 0.08, 0, 260);
    this.playTone(245, 0.3, 'sawtooth', 0.08, 0.17, 170);
  }

  playRuneBreak() {
    this.playTone(659.25, 0.12, 'sine', 0.15, 0, 880);
    this.playTone(987.77, 0.2, 'triangle', 0.14, 0.07, 1318.5);
    this.playNoise(0.16, 0.07, 0.04, 3400);
  }

  playGateUnlock() {
    const notes = [392, 493.88, 587.33, 783.99, 987.77];
    notes.forEach((n, i) => {
      this.playTone(n, i === notes.length - 1 ? 0.55 : 0.15, 'triangle', 0.16, i * 0.08);
    });
    this.playNoise(0.3, 0.08, 0.18, 2200);
  }

  playChestOpen() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, 0.22, 'sine', 0.15, i * 0.075);
    });
  }

  playWaypoint() {
    this.playTone(440, 0.25, 'sine', 0.13, 0);
    this.playTone(659.25, 0.3, 'sine', 0.13, 0.1);
    this.playTone(880, 0.48, 'triangle', 0.14, 0.22);
  }

  playMicCue(starting = true) {
    if (starting) {
      this.playTone(440, 0.08, 'sine', 0.12, 0);
      this.playTone(660, 0.14, 'sine', 0.14, 0.08);
    } else {
      this.playTone(660, 0.08, 'sine', 0.12, 0);
      this.playTone(440, 0.16, 'sine', 0.14, 0.08);
    }
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => {
      this.playTone(n, i === notes.length - 1 ? 0.6 : 0.16, 'triangle', 0.15, i * 0.09);
    });
  }

  playRimshot() {
    // Ba-dum-tss! khas panggung Stand-Up Comedy
    this.playTone(170, 0.09, 'triangle', 0.17, 0, 110);
    this.playNoise(0.06, 0.09, 0, 1400);
    this.playTone(135, 0.12, 'triangle', 0.19, 0.14, 80);
    this.playNoise(0.32, 0.11, 0.28, 4200);
  }

  playStrike(heavy = false) {
    // Efek tebasan energi + benturan mantap!
    this.playNoise(heavy ? 0.22 : 0.13, heavy ? 0.16 : 0.11, 0, heavy ? 1200 : 2100);
    this.playTone(heavy ? 540 : 420, heavy ? 0.24 : 0.14, 'sawtooth', heavy ? 0.16 : 0.11, 0, heavy ? 110 : 140);
    this.playTone(heavy ? 880 : 660, 0.12, 'triangle', 0.14, 0.04, heavy ? 1320 : 880);
  }

  playShieldUp() {
    this.playTone(340, 0.18, 'sine', 0.13, 0, 680);
    this.playTone(510, 0.24, 'triangle', 0.12, 0.06, 920);
  }

  playSwap() {
    this.playTone(460, 0.06, 'sine', 0.08, 0, 560);
  }

  playMatch(combo = 1) {
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    const base = scale[Math.min(scale.length - 1, Math.max(0, combo - 1))];
    this.playTone(base, 0.13, 'triangle', 0.13, 0, base * 1.12);
    this.playTone(base * 1.25, 0.16, 'sine', 0.1, 0.05);
  }

  playBlast() {
    this.playNoise(0.24, 0.15, 0, 950);
    this.playTone(220, 0.28, 'sawtooth', 0.14, 0, 72);
    this.playTone(680, 0.16, 'triangle', 0.12, 0.04, 1180);
  }

  playRenovate() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((n, i) => {
      this.playTone(n, i === notes.length - 1 ? 0.45 : 0.14, 'triangle', 0.14, i * 0.07);
    });
  }
}

export const audio = new RpgAudio();
