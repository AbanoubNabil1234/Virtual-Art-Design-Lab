import { Injectable } from '@angular/core';

export type UiSound =
  | 'click'
  | 'select'
  | 'check'
  | 'next'
  | 'prev'
  | 'start'
  | 'submit'
  | 'success'
  | 'back'
  | 'reset'
  | 'correct'
  | 'wrong'
  | 'lessonOpen';

@Injectable({ providedIn: 'root' })
export class ButtonSoundService {
  private ctx: AudioContext | null = null;
  private lastPlayAt = 0;
  private selectIndex = 0;

  play(kind: UiSound = 'click'): void {
    const now = performance.now();
    if (now - this.lastPlayAt < 40) return;
    this.lastPlayAt = now;

    try {
      const ctx = this.ensureContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      switch (kind) {
        case 'select':
          this.playSelect(ctx);
          break;
        case 'check':
          this.playCheck(ctx);
          break;
        case 'next':
          this.playWhoosh(ctx, 'up');
          break;
        case 'prev':
          this.playWhoosh(ctx, 'down');
          break;
        case 'start':
          this.playStart(ctx);
          break;
        case 'submit':
          this.playSubmit(ctx);
          break;
        case 'success':
          this.playSuccess(ctx);
          break;
        case 'back':
          this.playBack(ctx);
          break;
        case 'reset':
          this.playReset(ctx);
          break;
        case 'correct':
          this.playCorrect(ctx);
          break;
        case 'wrong':
          this.playWrong(ctx);
          break;
        case 'lessonOpen':
          this.playLessonOpen(ctx);
          break;
        default:
          this.playClick(ctx);
      }
    } catch {
      // Ignore audio failures (autoplay policies / unsupported APIs)
    }
  }

  /** @deprecated use play('click') */
  playClick(ctx?: AudioContext): void {
    const audio = ctx ?? this.ensureContext();
    const t = audio.currentTime;
    this.tone(audio, { type: 'square', freqStart: 1400, freqEnd: 520, peak: 0.28, duration: 0.07, start: t });
    this.tone(audio, { type: 'triangle', freqStart: 620, freqEnd: 180, peak: 0.32, duration: 0.09, start: t });
    this.tone(audio, { type: 'sine', freqStart: 160, freqEnd: 55, peak: 0.5, duration: 0.12, start: t });
    this.noiseBurst(audio, t, 0.22);
  }

  private playSelect(ctx: AudioContext): void {
    const pitches = [880, 988, 1047, 1175, 1319];
    const freq = pitches[this.selectIndex % pitches.length];
    this.selectIndex += 1;
    const t = ctx.currentTime;

    this.tone(ctx, { type: 'sine', freqStart: freq, freqEnd: freq * 0.85, peak: 0.38, duration: 0.09, start: t });
    this.tone(ctx, { type: 'triangle', freqStart: freq * 1.5, freqEnd: freq, peak: 0.18, duration: 0.07, start: t });
    this.noiseBurst(ctx, t, 0.12, 3200);
  }

  private playCheck(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'square', freqStart: 740, freqEnd: 980, peak: 0.3, duration: 0.06, start: t });
    this.tone(ctx, { type: 'sine', freqStart: 980, freqEnd: 1320, peak: 0.35, duration: 0.08, start: t + 0.05 });
    this.noiseBurst(ctx, t, 0.1, 2400);
  }

  private playWhoosh(ctx: AudioContext, dir: 'up' | 'down'): void {
    const t = ctx.currentTime;
    const a = dir === 'up' ? 420 : 720;
    const b = dir === 'up' ? 900 : 280;
    this.tone(ctx, { type: 'sawtooth', freqStart: a, freqEnd: b, peak: 0.22, duration: 0.12, start: t });
    this.tone(ctx, { type: 'sine', freqStart: a * 0.5, freqEnd: b * 0.5, peak: 0.28, duration: 0.14, start: t });
    this.noiseBurst(ctx, t, 0.16, dir === 'up' ? 1800 : 900);
  }

  private playStart(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'triangle', freqStart: 392, freqEnd: 523, peak: 0.35, duration: 0.1, start: t });
    this.tone(ctx, { type: 'triangle', freqStart: 523, freqEnd: 659, peak: 0.38, duration: 0.1, start: t + 0.09 });
    this.tone(ctx, { type: 'sine', freqStart: 659, freqEnd: 784, peak: 0.42, duration: 0.14, start: t + 0.18 });
    this.noiseBurst(ctx, t + 0.18, 0.18, 2000);
  }

  private playLessonOpen(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'sine', freqStart: 196, freqEnd: 392, peak: 0.28, duration: 0.18, start: t });
    this.tone(ctx, { type: 'triangle', freqStart: 392, freqEnd: 784, peak: 0.34, duration: 0.2, start: t + 0.08 });
    this.tone(ctx, { type: 'sine', freqStart: 988, freqEnd: 1319, peak: 0.3, duration: 0.12, start: t + 0.24 });
    this.noiseBurst(ctx, t + 0.2, 0.16, 3600);
  }

  private playSubmit(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'square', freqStart: 220, freqEnd: 180, peak: 0.4, duration: 0.08, start: t });
    this.tone(ctx, { type: 'sine', freqStart: 440, freqEnd: 660, peak: 0.36, duration: 0.12, start: t + 0.06 });
    this.tone(ctx, { type: 'sine', freqStart: 660, freqEnd: 880, peak: 0.4, duration: 0.16, start: t + 0.14 });
    this.noiseBurst(ctx, t, 0.2, 1500);
  }

  private playSuccess(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      this.tone(ctx, {
        type: 'sine',
        freqStart: freq,
        freqEnd: freq * 1.02,
        peak: 0.34,
        duration: 0.16,
        start: t + i * 0.08,
      });
    });
  }

  private playBack(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'triangle', freqStart: 700, freqEnd: 360, peak: 0.3, duration: 0.1, start: t });
    this.tone(ctx, { type: 'sine', freqStart: 360, freqEnd: 220, peak: 0.25, duration: 0.1, start: t + 0.05 });
  }

  private playReset(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'sawtooth', freqStart: 500, freqEnd: 200, peak: 0.22, duration: 0.1, start: t });
    this.tone(ctx, { type: 'square', freqStart: 300, freqEnd: 500, peak: 0.2, duration: 0.1, start: t + 0.08 });
    this.noiseBurst(ctx, t, 0.18, 1200);
  }

  private playCorrect(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'sine', freqStart: 660, freqEnd: 880, peak: 0.36, duration: 0.1, start: t });
    this.tone(ctx, { type: 'sine', freqStart: 880, freqEnd: 1175, peak: 0.4, duration: 0.14, start: t + 0.08 });
  }

  private playWrong(ctx: AudioContext): void {
    const t = ctx.currentTime;
    this.tone(ctx, { type: 'sawtooth', freqStart: 280, freqEnd: 140, peak: 0.3, duration: 0.16, start: t });
    this.tone(ctx, { type: 'square', freqStart: 180, freqEnd: 90, peak: 0.22, duration: 0.18, start: t + 0.04 });
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  private tone(
    ctx: AudioContext,
    opts: {
      type: OscillatorType;
      freqStart: number;
      freqEnd: number;
      peak: number;
      duration: number;
      start: number;
    }
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.freqStart, opts.start);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(opts.freqEnd, 40),
      opts.start + opts.duration
    );

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4200, opts.start);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.0001, opts.start);
    gain.gain.exponentialRampToValueAtTime(opts.peak, opts.start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, opts.start + opts.duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(opts.start);
    osc.stop(opts.start + opts.duration + 0.02);
  }

  private noiseBurst(ctx: AudioContext, start: number, peak: number, band = 2800): void {
    const duration = 0.045;
    const length = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const env = Math.exp(-i / (length * 0.12));
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = band;
    filter.Q.value = 0.9;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(start);
    src.stop(start + duration + 0.02);
  }
}
