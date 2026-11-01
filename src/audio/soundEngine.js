/**
 * Procedural Web Audio API Sound Engine — Cinematic Soothing Ambient & Voice Fusion
 * Acoustically calibrated for laptop speakers, desktop monitors, and headphones.
 * Frequencies centered in the warm golden audible range (260Hz - 660Hz, C4-E5).
 * Generative ambient chord pads with gentle breathing waves and ethereal starlight chimes.
 * Neural Voiceover Integration with automated cinematic audio ducking.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isVoicePlaying = false;
    this.isInitialized = false;
    this.listeners = new Set();

    // Audible, soothing master volume
    this.TARGET_VOLUME = 0.35;

    // Nodes
    this.masterGain = null;
    this.padGain = null;
    this.padFilter = null;
    this.convolver = null;
    this.voiceGain = null;
    this.voiceBuffer = null;
    this.voiceSource = null;
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

      // 1. MUST create master gain node FIRST so all subsequent nodes can safely connect
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 2. Dedicated Voiceover Gain Node
      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(1.15, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      // 3. Build spatial acoustic reverb
      this._buildReverb();

      // 4. Build lush soothing ambient pad (Cmaj9)
      this._buildSoothingPad();

      // 5. Start generative star chimes
      this._startCelestialChimes();

      // 6. Preload voiceover audio buffer
      this._loadVoiceover();

      // 7. Setup user gesture unlock
      this._setupUserGestureUnlock();

      this.isInitialized = true;
    } catch (e) {
      console.warn('SoundEngine init error:', e);
    }
  }

  // Preload voiceover file into Web Audio buffer
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

  // Universal user-gesture listener to unlock browser autoplay policy
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

  // Start / Resume playing the soothing ambient music
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
      // Smooth linear ramp to clearly audible volume
      this.masterGain.gain.linearRampToValueAtTime(this.TARGET_VOLUME, now + 1.2);
    }

    this._notify();
  }

  // Mute / Stop playing
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

  // Toggle button in Navbar
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

  // ─── Neural Voiceover Integration (Automated Audio Ducking) ───────────────

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

    // Stop any existing voice playback
    if (this.voiceSource) {
      try {
        this.voiceSource.stop();
      } catch (_) {}
      this.voiceSource = null;
    }

    const now = this.ctx.currentTime;

    // ── DUCK BACKGROUND MUSIC ──
    // Smoothly lower ambient pad from 0.75 down to 0.22 so speech is clear
    if (this.padGain) {
      this.padGain.gain.cancelScheduledValues(now);
      this.padGain.gain.setValueAtTime(this.padGain.gain.value, now);
      this.padGain.gain.linearRampToValueAtTime(0.22, now + 0.5);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.voiceBuffer;

    // Blend slight acoustic space reverb on vocal channel
    if (this.convolver) {
      const voiceReverb = this.ctx.createGain();
      voiceReverb.gain.setValueAtTime(0.16, now);
      source.connect(voiceReverb);
      voiceReverb.connect(this.convolver);
    }

    source.connect(this.voiceGain);

    source.onended = () => {
      this.isVoicePlaying = false;
      this.voiceSource = null;
      // ── RESTORE MUSIC VOLUME ──
      // Smoothly swell ambient pad back up to 0.75
      if (this.padGain && this.ctx) {
        const endNow = this.ctx.currentTime;
        this.padGain.gain.cancelScheduledValues(endNow);
        this.padGain.gain.setValueAtTime(this.padGain.gain.value, endNow);
        this.padGain.gain.linearRampToValueAtTime(0.75, endNow + 1.2);
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
    if (this.padGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.padGain.gain.cancelScheduledValues(now);
      this.padGain.gain.setValueAtTime(this.padGain.gain.value, now);
      this.padGain.gain.linearRampToValueAtTime(0.75, now + 0.8);
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

  // ─── Warm, Lush Soothing Pad (Cmaj9 / Fmaj9 Open Voicing) ─────────────────

  _buildSoothingPad() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(580, ctx.currentTime);
    this.padFilter.Q.setValueAtTime(1.1, ctx.currentTime);
    this.padFilter.connect(this.masterGain);

    if (this.convolver) {
      const reverbSend = ctx.createGain();
      reverbSend.gain.setValueAtTime(0.35, ctx.currentTime);
      this.padFilter.connect(reverbSend);
      reverbSend.connect(this.convolver);
    }

    this.padGain = ctx.createGain();
    this.padGain.gain.setValueAtTime(0.75, ctx.currentTime);
    this.padGain.connect(this.padFilter);

    const chordNotes = [
      { freq: 261.6, gain: 0.35, detune: -0.4 },
      { freq: 329.6, gain: 0.30, detune: 0.3 },
      { freq: 392.0, gain: 0.28, detune: -0.3 },
      { freq: 493.9, gain: 0.22, detune: 0.5 },
      { freq: 587.3, gain: 0.18, detune: -0.2 }
    ];

    chordNotes.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + detune, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(gain, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.padGain);
      osc.start();
      this.oscillators.push(osc);

      const overtone = ctx.createOscillator();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 0.5 + detune, ctx.currentTime);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(gain * 0.2, ctx.currentTime);

      overtone.connect(overtoneGain);
      overtoneGain.connect(this.padGain);
      overtone.start();
      this.oscillators.push(overtone);
    });

    const breatheLfo = ctx.createOscillator();
    breatheLfo.frequency.setValueAtTime(0.06, ctx.currentTime);
    const breatheGain = ctx.createGain();
    breatheGain.gain.setValueAtTime(0.2, ctx.currentTime);
    breatheLfo.connect(breatheGain);
    breatheGain.connect(this.padGain.gain);
    breatheLfo.start();
    this.oscillators.push(breatheLfo);

    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const filterGain = ctx.createGain();
    filterGain.gain.setValueAtTime(80, ctx.currentTime);
    filterLfo.connect(filterGain);
    filterGain.connect(this.padFilter.frequency);
    filterLfo.start();
    this.oscillators.push(filterLfo);
  }

  // ─── Generative Celestial Chimes (Sparse, Peaceful, Ambient) ─────────────

  _startCelestialChimes() {
    const chimeFrequencies = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];

    const playRandomChime = () => {
      if (this.ctx && this.isPlaying && this.ctx.state === 'running' && !this.isVoicePlaying) {
        const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
        this._playSoftBell(freq);
      }
      const nextDelay = 6000 + Math.random() * 5000;
      this.chimeTimeout = setTimeout(playRandomChime, nextDelay);
    };

    this.chimeTimeout = setTimeout(playRandomChime, 3000);
  }

  _playSoftBell(freq) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);

      if (this.convolver) {
        const reverbSend = ctx.createGain();
        reverbSend.gain.setValueAtTime(0.6, now);
        gain.connect(reverbSend);
        reverbSend.connect(this.convolver);
      }

      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.2);
    } catch (e) {
      console.warn('Bell chime error:', e);
    }
  }

  // ─── Lush Spatial Reverb ──────────────────────────────────────────────────

  _buildReverb() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const duration = 2.0;
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const d = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.2);
      }
    }

    this.convolver = ctx.createConvolver();
    this.convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.35, ctx.currentTime);
    this.convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);
  }

  // ─── Soothing, Tactile UI Feedback ────────────────────────────────────────

  playHover() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.linearRampToValueAtTime(420, now + 0.03);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  playClick() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.linearRampToValueAtTime(261.6, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  playStageTransition() {
    if (!this.isPlaying || !this.ctx) return;
    this._playSoftBell(659.25);
  }
}

export const soundEngine = new SoundEngine();
