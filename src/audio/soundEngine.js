/**
 * Natural Acoustic Wind Chime & Ambient Atmosphere Sound Engine
 * Replaces synthetic piano/organ chord music with authentic, natural wind chime acoustics:
 * - Handcrafted physical modeling of acoustic tubular wind chimes (inharmonic vibrational modes & wooden striker transients).
 * - Calibrated strictly in the soothing mid and low registers (146 Hz - 392 Hz, D3 to G4) with zero harsh high notes.
 * - Organic wind breeze atmosphere with natural gust-driven chime clusters.
 * - Spatial acoustic convolution reverb for an immersive outdoor landscape feel.
 * - Neural voiceover integration with automated ambient ducking.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isVoicePlaying = false;
    this.isInitialized = false;
    this.listeners = new Set();

    // Master volume
    this.TARGET_VOLUME = 0.38;

    // Audio Graph Nodes
    this.masterGain = null;
    this.chimeGain = null;
    this.ambienceGain = null;
    this.convolver = null;
    this.voiceGain = null;
    this.voiceBuffer = null;
    this.voiceSource = null;
    this.windSource = null;
    this.windFilter = null;
    this.chimeTimeout = null;
    this.oscillators = [];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener({ isPlaying: this.isPlaying, isVoicePlaying: this.isVoicePlaying });
    return () => this.listeners.delete(listener);
  }

  _notify() {
    this.listeners.forEach((fn) =>
      fn({ isPlaying: this.isPlaying, isVoicePlaying: this.isVoicePlaying })
    );
  }

  // ─── Initialization ──────────────────────────────────────────────────────────

  init() {
    if (this.isInitialized && this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported in this environment');
        return;
      }

      this.ctx = new AudioCtx();

      // 1. Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 2. Chime bus gain
      this.chimeGain = this.ctx.createGain();
      this.chimeGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.chimeGain.connect(this.masterGain);

      // 3. Ambience breeze bus gain
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // 4. Voiceover gain
      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(1.15, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      // 5. Spatial acoustic convolution reverb
      this._buildReverb();

      // 6. Natural breeze atmosphere (replaces synthetic piano chords)
      this._buildNaturalWindAmbience();

      // 7. Generative natural wind chimes
      this._startNaturalChimes();

      // 8. Preload voiceover buffer
      this._loadVoiceover();

      // 9. Gesture unlock for autoplay policy
      this._setupUserGestureUnlock();

      this.isInitialized = true;
    } catch (e) {
      console.warn('SoundEngine init error:', e);
    }
  }

  async _loadVoiceover() {
    if (this.voiceBuffer || !this.ctx) return;
    try {
      const response = await fetch('./audio/george_intro.mp3?v=2');
      const arrayBuffer = await response.arrayBuffer();
      this.voiceBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('Could not preload voiceover:', e);
    }
  }

  _setupUserGestureUnlock() {
    const unlockAndPlay = async () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch (_) {}
      }
      window.removeEventListener('pointerdown', unlockAndPlay);
      window.removeEventListener('click', unlockAndPlay);
      window.removeEventListener('scroll', unlockAndPlay);
      window.removeEventListener('touchstart', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
    };

    window.addEventListener('pointerdown', unlockAndPlay, { passive: true });
    window.addEventListener('click', unlockAndPlay, { passive: true });
    window.addEventListener('scroll', unlockAndPlay, { passive: true });
    window.addEventListener('touchstart', unlockAndPlay, { passive: true });
    window.addEventListener('keydown', unlockAndPlay, { passive: true });
  }

  async startAudio() {
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch (e) {
      console.warn('Could not resume audio context:', e);
    }

    this.isPlaying = true;

    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value > 0.001 ? this.masterGain.gain.value : 0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.TARGET_VOLUME, now + 1.2);
    }

    this._notify();
  }

  stopAudio() {
    if (!this.ctx || !this.masterGain) return;

    this.stopVoiceover();
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);

    this._notify();
  }

  toggleMute() {
    this.init();
    if (this.isPlaying) {
      this.stopAudio();
      return false;
    } else {
      this.startAudio();
      this.playVoiceover();
      return true;
    }
  }

  // ─── Voiceover Integration & Automatic Ducking ────────────────────────────

  async playVoiceover() {
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch (_) {}

    if (!this.isPlaying) {
      await this.startAudio();
    }

    if (!this.voiceBuffer) {
      await this._loadVoiceover();
    }

    if (!this.voiceBuffer) return;

    if (this.voiceSource) {
      try {
        this.voiceSource.stop();
      } catch (_) {}
      this.voiceSource = null;
    }

    const now = this.ctx.currentTime;

    // Duck natural wind and chimes down so voice is crystal clear
    if (this.chimeGain) {
      this.chimeGain.gain.cancelScheduledValues(now);
      this.chimeGain.gain.setValueAtTime(this.chimeGain.gain.value, now);
      this.chimeGain.gain.linearRampToValueAtTime(0.25, now + 0.5);
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
      this.ambienceGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.voiceBuffer;

    if (this.convolver) {
      const voiceReverb = this.ctx.createGain();
      voiceReverb.gain.setValueAtTime(0.14, now);
      source.connect(voiceReverb);
      voiceReverb.connect(this.convolver);
    }

    source.connect(this.voiceGain);

    source.onended = () => {
      this.isVoicePlaying = false;
      this.voiceSource = null;
      // Restore natural audio levels
      if (this.ctx) {
        const endNow = this.ctx.currentTime;
        if (this.chimeGain) {
          this.chimeGain.gain.cancelScheduledValues(endNow);
          this.chimeGain.gain.setValueAtTime(this.chimeGain.gain.value, endNow);
          this.chimeGain.gain.linearRampToValueAtTime(0.85, endNow + 1.2);
        }
        if (this.ambienceGain) {
          this.ambienceGain.gain.cancelScheduledValues(endNow);
          this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, endNow);
          this.ambienceGain.gain.linearRampToValueAtTime(0.7, endNow + 1.2);
        }
      }
      this._notify();
    };

    source.start(now + 0.1);
    this.voiceSource = source;
    this.isVoicePlaying = true;
    this._notify();
  }

  stopVoiceover() {
    if (this.voiceSource) {
      try {
        this.voiceSource.stop();
      } catch (_) {}
      this.voiceSource = null;
    }
    this.isVoicePlaying = false;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.chimeGain) {
        this.chimeGain.gain.cancelScheduledValues(now);
        this.chimeGain.gain.setValueAtTime(this.chimeGain.gain.value, now);
        this.chimeGain.gain.linearRampToValueAtTime(0.85, now + 0.8);
      }
      if (this.ambienceGain) {
        this.ambienceGain.gain.cancelScheduledValues(now);
        this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
        this.ambienceGain.gain.linearRampToValueAtTime(0.7, now + 0.8);
      }
    }
    this._notify();
  }

  toggleVoiceover() {
    if (this.isVoicePlaying) {
      this.stopVoiceover();
      return false;
    } else {
      this.playVoiceover();
      return true;
    }
  }

  // ─── Natural Wind & Organic Air Ambience (Replaces Synthetic Piano) ───────

  _buildNaturalWindAmbience() {
    if (!this.ctx || !this.ambienceGain) return;
    const ctx = this.ctx;

    // Create a 5-second stereo natural pink-noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const output = noiseBuffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Paul Kellet's refined pinking filter algorithm
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    // Soft resonant bandpass filter simulating outdoor air breeze
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(260, ctx.currentTime);
    windFilter.Q.setValueAtTime(0.85, ctx.currentTime);

    // Ultra-slow breeze breathing LFO
    const breezeLfo = ctx.createOscillator();
    breezeLfo.frequency.setValueAtTime(0.045, ctx.currentTime);
    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(90, ctx.currentTime);
    breezeLfo.connect(breezeGain);
    breezeGain.connect(windFilter.frequency);
    breezeLfo.start();
    this.oscillators.push(breezeLfo);

    // Warm grounded subtle sub-harmonic resonance (65.4 Hz C2)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65.4, ctx.currentTime);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.035, ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(this.ambienceGain);
    subOsc.start();
    this.oscillators.push(subOsc);

    windSource.connect(windFilter);
    windFilter.connect(this.ambienceGain);

    if (this.convolver) {
      const windReverb = ctx.createGain();
      windReverb.gain.setValueAtTime(0.25, ctx.currentTime);
      windFilter.connect(windReverb);
      windReverb.connect(this.convolver);
    }

    windSource.start();
    this.windSource = windSource;
    this.windFilter = windFilter;
  }

  // ─── Authentic Natural Wind Chimes (Mid & Low Registers) ───────────────────

  _startNaturalChimes() {
    // Tuned pentatonic mid and low wind chime series (D3, F3, G3, A3, C4, D4, E4, G4)
    // Completely replaces shrill high notes with deep, resonant, peaceful chime tubes
    const chimeTuning = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00];

    const triggerWindGust = () => {
      if (this.ctx && this.isPlaying && this.ctx.state === 'running' && !this.isVoicePlaying) {
        // Natural wind gusts stir 1 to 3 chime tubes with organic micro-spacing
        const clusterCount = Math.random() > 0.45 ? (Math.random() > 0.65 ? 3 : 2) : 1;
        let cumulativeDelay = 0;

        for (let i = 0; i < clusterCount; i++) {
          const freq = chimeTuning[Math.floor(Math.random() * chimeTuning.length)];
          const velocity = 0.55 + Math.random() * 0.45;

          setTimeout(() => {
            if (this.ctx && this.isPlaying && !this.isVoicePlaying) {
              this._playNaturalChime(freq, velocity);
            }
          }, cumulativeDelay);

          // Micro-interval between chimes touching in the breeze (120ms - 280ms)
          cumulativeDelay += 120 + Math.random() * 160;
        }
      }

      // Natural pause between wind gusts (4.5 to 8.5 seconds)
      const nextGust = 4500 + Math.random() * 4000;
      this.chimeTimeout = setTimeout(triggerWindGust, nextGust);
    };

    // First gust stirs after 2.5 seconds
    this.chimeTimeout = setTimeout(triggerWindGust, 2500);
  }

  /**
   * Physically modeled natural tubular wind chime:
   * - Fundamental frequency (f0) with organic dual-oscillator phase beating.
   * - Characteristic inharmonic cylindrical transverse modes (2.756*f0 and 5.404*f0).
   * - Soft clapper strike transient (wooden striker contact tap).
   * - Natural exponential acoustic damping into spatial reverb.
   */
  _playNaturalChime(freq, velocity = 0.8) {
    if (!this.ctx || !this.chimeGain) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // ── 1. Soft Clapper Contact Transient (Wooden/Acrylic Strike Tap) ──
      const strikeBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.015), ctx.sampleRate);
      const strikeData = strikeBuffer.getChannelData(0);
      for (let i = 0; i < strikeData.length; i++) {
        strikeData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
      }
      const strikeSource = ctx.createBufferSource();
      strikeSource.buffer = strikeBuffer;
      const strikeFilter = ctx.createBiquadFilter();
      strikeFilter.type = 'bandpass';
      strikeFilter.frequency.setValueAtTime(freq * 1.8, now);
      strikeFilter.Q.setValueAtTime(2.0, now);

      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.04 * velocity, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      strikeSource.connect(strikeFilter);
      strikeFilter.connect(strikeGain);
      strikeGain.connect(this.chimeGain);
      strikeSource.start(now);

      // ── 2. Primary Fundamental Resonant Tube (f0) ──
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Secondary slightly detuned oscillator for acoustic phase shimmer
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq + 0.35, now);

      const tubeGain = ctx.createGain();
      const peakAmp = 0.22 * velocity;
      tubeGain.gain.setValueAtTime(0.0001, now);
      tubeGain.gain.linearRampToValueAtTime(peakAmp, now + 0.004);
      // Long, soothing natural ringing decay (4.5 to 5.5 seconds)
      tubeGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

      osc1.connect(tubeGain);
      osc2.connect(tubeGain);

      // ── 3. First Cylindrical Inharmonic Mode (2.756 * f0) ──
      const mode1 = ctx.createOscillator();
      mode1.type = 'sine';
      mode1.frequency.setValueAtTime(freq * 2.756, now);

      const mode1Gain = ctx.createGain();
      mode1Gain.gain.setValueAtTime(0.0001, now);
      mode1Gain.gain.linearRampToValueAtTime(peakAmp * 0.24, now + 0.003);
      // Upper mode dampens much faster in physical metal (1.4 seconds)
      mode1Gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      mode1.connect(mode1Gain);

      // ── 4. Second Cylindrical Inharmonic Mode (5.404 * f0) ──
      const mode2 = ctx.createOscillator();
      mode2.type = 'sine';
      mode2.frequency.setValueAtTime(freq * 5.404, now);

      const mode2Gain = ctx.createGain();
      mode2Gain.gain.setValueAtTime(0.0001, now);
      mode2Gain.gain.linearRampToValueAtTime(peakAmp * 0.06, now + 0.002);
      mode2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      mode2.connect(mode2Gain);

      // Connect to chime bus
      tubeGain.connect(this.chimeGain);
      mode1Gain.connect(this.chimeGain);
      mode2Gain.connect(this.chimeGain);

      // Send to spatial acoustic reverb
      if (this.convolver) {
        const reverbSend = ctx.createGain();
        reverbSend.gain.setValueAtTime(0.48, now);
        tubeGain.connect(reverbSend);
        mode1Gain.connect(reverbSend);
        reverbSend.connect(this.convolver);
      }

      // Start chime resonance
      osc1.start(now);
      osc2.start(now);
      mode1.start(now);
      mode2.start(now);

      osc1.stop(now + 5.5);
      osc2.stop(now + 5.5);
      mode1.stop(now + 1.5);
      mode2.stop(now + 0.5);
    } catch (e) {
      console.warn('Natural chime acoustic error:', e);
    }
  }

  // ─── Spatial Acoustic Convolution Reverb ──────────────────────────────────

  _buildReverb() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const duration = 2.4;
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const d = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.1);
      }
    }

    this.convolver = ctx.createConvolver();
    this.convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.38, ctx.currentTime);
    this.convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);
  }

  // ─── Tactile Natural Chime UI Feedback ────────────────────────────────────

  playHover() {
    if (!this.isPlaying || !this.ctx || !this.chimeGain) return;
    try {
      // Delicate mini-touch of a 293.66 Hz (D4) natural chime tube
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(293.66, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.chimeGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (_) {}
  }

  playClick() {
    if (!this.isPlaying || !this.ctx || !this.chimeGain) return;
    try {
      // Tactile clapper contact with a 261.63 Hz (C4) chime tube
      this._playNaturalChime(261.63, 0.75);
    } catch (_) {}
  }

  playStageTransition() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      // Resonant natural chime dual ring (G3 + D4) when gliding between portfolio stages
      this._playNaturalChime(196.00, 0.85);
      setTimeout(() => {
        if (this.ctx && this.isPlaying) {
          this._playNaturalChime(293.66, 0.7);
        }
      }, 140);
    } catch (_) {}
  }
}

export const soundEngine = new SoundEngine();
