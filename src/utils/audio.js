// Web Audio API sound engine — no audio files needed

let _ctx = null;
let _muted = localStorage.getItem('mathgame_muted') === 'true';
let _bgScheduler = null;
let _bgNoteIdx = 0;
let _bgNextTime = 0;
let _bgGain = null;

const HZ = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
  C6: 1046.50,
};

// Mary Had a Little Lamb — cheerful 8-bit loop
const BG_NOTES = [
  { f: HZ.E5, d: 0.18 }, { f: HZ.D5, d: 0.18 }, { f: HZ.C5, d: 0.18 }, { f: HZ.D5, d: 0.18 },
  { f: HZ.E5, d: 0.18 }, { f: HZ.E5, d: 0.18 }, { f: HZ.E5, d: 0.36 },
  { f: HZ.D5, d: 0.18 }, { f: HZ.D5, d: 0.18 }, { f: HZ.D5, d: 0.36 },
  { f: HZ.E5, d: 0.18 }, { f: HZ.G5, d: 0.18 }, { f: HZ.G5, d: 0.36 },
  { f: HZ.E5, d: 0.18 }, { f: HZ.D5, d: 0.18 }, { f: HZ.C5, d: 0.18 }, { f: HZ.D5, d: 0.18 },
  { f: HZ.E5, d: 0.18 }, { f: HZ.E5, d: 0.18 }, { f: HZ.E5, d: 0.18 }, { f: HZ.E5, d: 0.18 },
  { f: HZ.D5, d: 0.18 }, { f: HZ.D5, d: 0.18 }, { f: HZ.E5, d: 0.18 }, { f: HZ.D5, d: 0.18 },
  { f: HZ.C5, d: 0.54 }, { f: 0, d: 0.18 },
];

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function tone(freq, startTime, duration, type = 'square', vol = 0.15) {
  if (_muted || freq === 0) return;
  const ac = ctx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

// ── Sound effects ──────────────────────────────────────────

export function playCorrect() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  const arp = [HZ.C5, HZ.E5, HZ.G5, HZ.C6];
  arp.forEach((f, i) => tone(f, t + i * 0.08, 0.18, 'triangle', 0.22));
}

export function playWrong() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  tone(HZ.G4, t, 0.12, 'sawtooth', 0.18);
  tone(HZ.D4, t + 0.1, 0.12, 'sawtooth', 0.18);
  tone(HZ.A4 / 2, t + 0.18, 0.22, 'sawtooth', 0.14);
}

export function playTick() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  tone(HZ.A5, t, 0.04, 'square', 0.08);
}

export function playFanfare() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  const seq = [
    { f: HZ.C5, d: 0.12 }, { f: HZ.E5, d: 0.12 }, { f: HZ.G5, d: 0.12 },
    { f: HZ.C6, d: 0.12 }, { f: HZ.G5, d: 0.08 }, { f: HZ.A5, d: 0.08 },
    { f: HZ.C6, d: 0.4 },
  ];
  let cur = t;
  seq.forEach(({ f, d }) => {
    tone(f, cur, d * 1.1, 'triangle', 0.25);
    cur += d;
  });
  // bass thud
  tone(HZ.C4, t, 0.3, 'sine', 0.3);
  tone(HZ.G4, t + 0.36, 0.2, 'sine', 0.25);
}

export function playClick() {
  if (_muted) return;
  const ac = ctx();
  tone(HZ.C6, ac.currentTime, 0.05, 'sine', 0.1);
}

// ── Background music ───────────────────────────────────────

function scheduleBgNote() {
  const LOOKAHEAD = 0.12;   // seconds ahead to schedule
  const INTERVAL  = 60;     // ms between scheduler ticks

  const ac = ctx();
  while (_bgNextTime < ac.currentTime + LOOKAHEAD) {
    const note = BG_NOTES[_bgNoteIdx % BG_NOTES.length];
    if (note.f > 0 && _bgGain) {
      const osc = ac.createOscillator();
      osc.type = 'square';
      osc.frequency.value = note.f;
      osc.connect(_bgGain);
      osc.start(_bgNextTime);
      osc.stop(_bgNextTime + note.d * 0.9);
    }
    _bgNextTime += note.d;
    _bgNoteIdx++;
  }
  _bgScheduler = setTimeout(scheduleBgNote, INTERVAL);
}

export function startBgMusic() {
  if (_bgScheduler) return;
  const ac = ctx();
  _bgGain = ac.createGain();
  _bgGain.gain.value = _muted ? 0 : 0.07;
  _bgGain.connect(ac.destination);
  _bgNoteIdx = 0;
  _bgNextTime = ac.currentTime + 0.1;
  scheduleBgNote();
}

export function stopBgMusic() {
  clearTimeout(_bgScheduler);
  _bgScheduler = null;
  if (_bgGain) {
    try { _bgGain.disconnect(); } catch (_) {}
    _bgGain = null;
  }
}

// ── Mute toggle ────────────────────────────────────────────

export function toggleMute() {
  _muted = !_muted;
  localStorage.setItem('mathgame_muted', _muted);
  if (_bgGain) _bgGain.gain.value = _muted ? 0 : 0.07;
  return _muted;
}

export function isMuted() {
  return _muted;
}
