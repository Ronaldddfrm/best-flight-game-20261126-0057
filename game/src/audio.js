export class Sfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineGain = null;
  }

  ensure() {
    if (this.ctx) return;
    try {
      const AudioCtx = typeof AudioContext !== 'undefined' ? AudioContext : typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : null;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    } catch (_) {}
  }

  engine(throttle) {
    this.ensure();
    if (!this.ctx) return;
    if (throttle <= 0.05) {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
        this.engineOsc = null;
      }
      if (this.engineGain) {
        this.engineGain.disconnect();
        this.engineGain = null;
      }
      return;
    }
    const freq = 50 + throttle * 90;
    const gainVal = 0.02 + throttle * 0.05;
    if (!this.engineOsc) {
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();
    } else {
      this.engineOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      this.engineGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    }
  }

  chime() {
    this.ensure();
    if (!this.ctx || this.muted) return;
    const playNote = (freq, dur, when) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, when);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, when);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(when);
      osc.stop(when + dur);
    };
    playNote(880, 0.12, this.ctx.currentTime);
    playNote(1320, 0.12, this.ctx.currentTime + 0.12);
  }

  thud() {
    this.ensure();
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  crash() {
    this.ensure();
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    const endTime = this.ctx.currentTime + 0.5;
    osc.frequency.linearRampToValueAtTime(60, endTime);
    osc.stop(endTime);
    // noise
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.connect(gain);
    noise.start();
    noise.stop(endTime);
  }

  setMuted(b) {
    this.muted = b;
    if (this.engineGain) {
      this.engineGain.gain.setValueAtTime(b ? 0 : this.engineGain.gain.value, this.ctx.currentTime);
    }
  }
}
