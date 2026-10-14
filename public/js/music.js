/* Một Đời — nhạc nền lofi chill tự sinh bằng Web Audio (không dùng file nhạc, không bản quyền).
   Piano điện (Rhodes) với hợp âm jazz 7/9, bass trầm, trống nhẹ có swing, tiếng đĩa than lạo xạo, giai điệu thưa qua delay.
   Trình duyệt chỉ cho phát âm thanh sau khi người dùng bấm, nên nhạc bắt đầu ở lần bấm đầu tiên. */
(function () {
  'use strict';
  var KEY = 'mkn.music';
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ on: S.want, vol: S.vol })); } catch (e) { /* bỏ qua */ } }
  var saved = load() || {};
  var S = { want: !!saved.on, vol: saved.vol == null ? 0.35 : +saved.vol, ctx: null, master: null, bus: null, delay: null, noise: null, lfo: null, timer: null, next: 0, step: 0, bar: 0, prog: 0, playing: false, listeners: [] };

  var BPM = 72, SPB = 60 / BPM, SWING = 0.6;
  // hợp âm: [bass (MIDI), các nốt hợp âm]
  var PROGS = [
    [[41, [57, 60, 64, 67]], [40, [55, 59, 62, 64]], [38, [53, 57, 60, 64]], [36, [55, 59, 60, 64]]], // Fmaj7 – Em7 – Dm9 – Cmaj7
    [[38, [53, 57, 60, 64]], [43, [53, 57, 59, 64]], [36, [52, 55, 59, 62]], [45, [55, 59, 60, 64]]], // Dm9 – G13 – Cmaj9 – Am9
    [[45, [55, 60, 64, 67]], [38, [53, 57, 60, 65]], [40, [55, 59, 62, 67]], [45, [55, 60, 64, 69]]], // Am7 – Dm7 – Em7 – Am7
    [[39, [55, 58, 62, 65]], [44, [55, 60, 63, 67]], [41, [56, 60, 63, 67]], [46, [56, 58, 62, 65]]]  // Ebmaj9 – Abmaj7 – Fm9 – Bb13
  ];
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function setup() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    var c = S.ctx = new AC();
    S.master = c.createGain(); S.master.gain.value = 0;
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2300; lp.Q.value = 0.4;
    var comp = c.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
    S.bus = c.createGain(); S.bus.gain.value = 1;
    S.bus.connect(lp); lp.connect(comp); comp.connect(S.master); S.master.connect(c.destination);
    // delay cho giai điệu
    S.delay = c.createDelay(1.5); S.delay.delayTime.value = SPB * 0.75;
    var fb = c.createGain(); fb.gain.value = 0.32; var wet = c.createGain(); wet.gain.value = 0.3;
    S.delay.connect(fb); fb.connect(S.delay); S.delay.connect(wet); wet.connect(S.bus);
    // nhiễu trắng dùng cho trống & đĩa than
    var len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    S.noise = buf;
    // tiếng hiss đĩa than liên tục
    var hiss = c.createBufferSource(); hiss.buffer = buf; hiss.loop = true;
    var hb = c.createBiquadFilter(); hb.type = 'bandpass'; hb.frequency.value = 4000; hb.Q.value = 0.6;
    var hg = c.createGain(); hg.gain.value = 0.012;
    hiss.connect(hb); hb.connect(hg); hg.connect(S.master); hiss.start();
    // "băng từ chao đảo": LFO làm lệch cao độ nhẹ
    S.lfo = c.createOscillator(); S.lfo.frequency.value = 0.35; S.lfoGain = c.createGain(); S.lfoGain.gain.value = 7;
    S.lfo.connect(S.lfoGain); S.lfo.start();
    return true;
  }

  function env(g, t, a, peak, dec, sus, rel, end) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * sus), t + a + dec);
    g.gain.setValueAtTime(Math.max(0.0001, peak * sus), end);
    g.gain.exponentialRampToValueAtTime(0.0001, end + rel);
  }
  function keys(m, t, dur, vel, toDelay) {
    var c = S.ctx, f = hz(m), g = c.createGain();
    var o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
    var o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2; var g2 = c.createGain(); g2.gain.value = 0.12;
    S.lfoGain.connect(o1.detune); S.lfoGain.connect(o2.detune);
    o1.connect(g); o2.connect(g2); g2.connect(g);
    g.connect(S.bus); if (toDelay) g.connect(S.delay);
    env(g, t, 0.012, vel, 0.9, 0.45, 1.6, t + dur);
    o1.start(t); o2.start(t); o1.stop(t + dur + 1.8); o2.stop(t + dur + 1.8);
  }
  function bass(m, t, dur) {
    var c = S.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = hz(m);
    o.connect(g); g.connect(S.bus);
    env(g, t, 0.02, 0.32, 0.3, 0.6, 0.35, t + dur);
    o.start(t); o.stop(t + dur + 0.5);
  }
  function kick(t, v) {
    var c = S.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(115, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(0.75 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.connect(g); g.connect(S.bus); o.start(t); o.stop(t + 0.4);
  }
  function noiseHit(t, type, freq, q, vol, dec) {
    var c = S.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = S.noise; f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    s.connect(f); f.connect(g); g.connect(S.bus);
    s.start(t, Math.random() * 1.5); s.stop(t + dec + 0.02);
  }
  function snare(t, v) { noiseHit(t, 'bandpass', 1700, 0.8, 0.28 * v, 0.2); var c = S.ctx, o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = 190; g.gain.setValueAtTime(0.12 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1); o.connect(g); g.connect(S.bus); o.start(t); o.stop(t + 0.12); }
  function hat(t, v) { noiseHit(t, 'highpass', 7500, 0.5, 0.05 * v, 0.05); }
  function crackle(t, span) {
    var n = Math.floor(rnd(1, 5));
    for (var i = 0; i < n; i++) { var c = S.ctx, s = c.createBufferSource(), g = c.createGain(), at = t + Math.random() * span; s.buffer = S.noise; g.gain.value = rnd(0.015, 0.05); s.connect(g); g.connect(S.master); s.start(at, Math.random() * 1.9, 0.003); }
  }

  // mỗi nhịp 8 ô (móc đơn) — ô lẻ lùi lại một chút để có swing
  function stepTime(base, i) { var beat = Math.floor(i / 2), off = i % 2; return base + beat * SPB + (off ? SPB * SWING : 0); }
  function scheduleBar(t0) {
    var P = PROGS[S.prog], ch = P[S.bar % 4], hum = function () { return rnd(-0.008, 0.008); };
    var breakdown = S.bar % 16 >= 14; // hai ô nhịp nghỉ trống cho "thở"
    // hợp âm: rải nhẹ từ dưới lên
    ch[1].forEach(function (m, j) { keys(m, t0 + j * 0.018 + hum(), SPB * 3.6, 0.075 + Math.random() * 0.02, false); });
    if (Math.random() < 0.45) ch[1].slice(1).forEach(function (m, j) { keys(m, stepTime(t0, 5) + j * 0.015, SPB * 1.2, 0.05, false); });
    bass(ch[0], t0, SPB * 1.6); bass(ch[0] + (Math.random() < 0.4 ? 7 : 0), stepTime(t0, 5), SPB * 1.2);
    if (!breakdown) {
      kick(t0 + hum(), 1); kick(stepTime(t0, 5) + hum(), 0.8); if (Math.random() < 0.35) kick(stepTime(t0, 3) + hum(), 0.55);
      snare(stepTime(t0, 2) + hum(), 1); snare(stepTime(t0, 6) + hum(), 0.95);
      for (var i = 0; i < 8; i++) if (Math.random() < 0.92) hat(stepTime(t0, i) + hum(), i % 2 ? 0.6 : 1);
    }
    // giai điệu thưa, nốt trong hợp âm lên một quãng tám
    for (var b = 0; b < 4; b++) if (Math.random() < (breakdown ? 0.5 : 0.3)) { var mm = ch[1][Math.floor(Math.random() * ch[1].length)] + 12; keys(mm, stepTime(t0, b * 2 + (Math.random() < 0.5 ? 1 : 0)), SPB * 0.9, 0.045, true); }
    crackle(t0, SPB * 4);
    S.bar++;
    if (S.bar % 16 === 0) S.prog = (S.prog + 1 + Math.floor(Math.random() * (PROGS.length - 1))) % PROGS.length;
  }
  function tick() {
    if (!S.ctx) return;
    while (S.next < S.ctx.currentTime + 0.6) { scheduleBar(S.next); S.next += SPB * 4; }
  }

  function start() {
    if (!S.ctx && !setup()) return false;
    if (S.ctx.state === 'suspended') S.ctx.resume();
    if (!S.playing) {
      S.playing = true; S.next = S.ctx.currentTime + 0.15; S.bar = 0; S.prog = Math.floor(Math.random() * PROGS.length);
      tick(); S.timer = setInterval(tick, 120);
    }
    var g = S.master.gain, now = S.ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(S.vol * 0.6, now + 2.5);
    notify(); return true;
  }
  function stop() {
    if (!S.ctx || !S.playing) { S.playing = false; notify(); return; }
    var g = S.master.gain, now = S.ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0, now + 0.8);
    S.playing = false; clearInterval(S.timer); S.timer = null;
    setTimeout(function () { if (!S.playing && S.ctx) S.ctx.suspend(); }, 900);
    notify();
  }
  function notify() { S.listeners.forEach(function (fn) { try { fn(api.state()); } catch (e) { /* bỏ qua */ } }); }

  var api = {
    supported: function () { return !!(window.AudioContext || window.webkitAudioContext); },
    toggle: function () { S.want = !S.want; save(); if (S.want) start(); else stop(); return S.want; },
    setVol: function (v) { S.vol = Math.max(0, Math.min(1, +v)); save(); if (S.ctx && S.playing) { var g = S.master.gain, now = S.ctx.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(S.vol * 0.6, now + 0.2); } notify(); },
    state: function () { return { on: S.playing, want: S.want, vol: S.vol }; },
    onChange: function (fn) { S.listeners.push(fn); },
    // người chơi đã bật nhạc ở lần trước: tự phát lại ở lần bấm đầu tiên (trình duyệt chặn tự phát khi chưa tương tác)
    resumeOnGesture: function () {
      if (!S.want) return;
      var go = function () { document.removeEventListener('pointerdown', go, true); document.removeEventListener('keydown', go, true); if (S.want && !S.playing) start(); };
      document.addEventListener('pointerdown', go, true); document.addEventListener('keydown', go, true);
    }
  };
  window.G = window.G || {}; window.G.Music = api;
})();
