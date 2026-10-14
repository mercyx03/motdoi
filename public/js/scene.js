/* Một Đời — tranh pixel: chân dung nhân vật & khung cảnh gia đình (SVG thuần, không cần ảnh ngoài). */
(function (G) {
  'use strict';
  var E = G.E;

  function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; }
  function R(l, k) { return hash(((l.rs | 0) + k * 7919) | 0); }
  function rect(o, x, y, w, h, c, op) { o.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"' + (op != null ? ' opacity="' + op + '"' : '') + '/>'); }
  function svg(w, h, body, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">' + body.join('') + '</svg>'; }

  var AFRICA = /^(afr|afw|afe|afs|et|so|ss|ao|ht|car)$/, BROWN = /^(in|pk|bd|lk|np|ar|fa|af|tr|es_la|br|ph|id|my|th|kh|la|mm|mg|pac|az|ca|tj|he|hy|ka|sq)$/, EASTASIA = /^(vn|cn|kr|kp|jp|sg|mn)$/;
  function skinOf(l, k) {
    var p = l.pool || 'vn', t = R(l, 11 + (k || 0));
    if (AFRICA.test(p)) return ['#6b3f26', '#7a4a2e', '#8d5a3b'][Math.floor(t * 3)];
    if (BROWN.test(p)) return ['#b97e52', '#c48a5c', '#a86f45'][Math.floor(t * 3)];
    if (EASTASIA.test(p)) return ['#efc4a0', '#e8b98f', '#f3cfae'][Math.floor(t * 3)];
    return ['#f2d0b5', '#ecc3a4', '#f6dac4'][Math.floor(t * 3)];
  }
  function hairOf(l, age, k) {
    if (age >= 75) return '#e8e8e8';
    if (age >= 58) return '#b5b5b5';
    var p = l.pool || 'vn', t = R(l, 21 + (k || 0));
    if (EASTASIA.test(p) || AFRICA.test(p) || BROWN.test(p)) return t < 0.85 ? '#1d1612' : '#4a2f1f';
    return ['#2a1d14', '#5a3a22', '#8a5a2e', '#d8b25e', '#b5552a'][Math.floor(t * 5)];
  }
  function stageOf(a) { return a < 2 ? 'baby' : a < 12 ? 'child' : a < 18 ? 'teen' : a < 60 ? 'adult' : 'elder'; }
  function outfit(l, a) {
    var c = l.job ? E.jobDef(l) : null, cat = c ? c.cat : '';
    if (l.jailUntil != null && l.age < l.jailUntil) return { body: '#3d4f6a', stripe: '#c9a227', hat: null };
    if (a < 18 && l.school && G.E.isVN(l)) return { body: '#f4f4f0', pants: '#24407a', scarf: a <= 14 ? '#d12f2f' : null };
    if (c && c.id === 'cong_an') return { body: '#2f4f86', hat: 'police', hatC: '#24406e' };
    if (c && c.id === 'quan_doi') return { body: '#4d6a34', hat: 'army', hatC: '#3d5728' };
    if (cat === 'med') return { body: '#f3f6f8', steth: true };
    if (cat === 'farm' && G.E.isVN(l)) return { body: '#6f5a3c', hat: 'non' };
    if (cat === 'office' || cat === 'sale') return { body: '#2f3e5c', tie: '#b23b3b' };
    if (cat === 'crime') return { body: '#1e1e22', chain: true };
    if (cat === 'show' || cat === 'creator') return { body: ['#b0397f', '#3b7fd1', '#e0a422'][Math.floor(R(l, 31) * 3)], star: true };
    if (cat === 'sport') return { body: '#d23a3a', num: true };
    if (cat === 'worker' || cat === 'poor') return { body: '#c7782f' };
    if (a >= 60) return { body: G.E.isVN(l) && l.sex === 'F' ? '#6b4f7a' : '#7d6a55', hat: G.E.isVN(l) && !l.urban && R(l, 41) < 0.5 ? 'non' : null };
    return { body: ['#3d7a6a', '#7a3d5c', '#3d5a8a', '#8a6d3d', '#5a3d8a'][Math.floor(R(l, 33) * 5)] };
  }

  // ---------- chân dung 16×16 ----------
  function avatar(l) {
    var a = l.alive ? l.age : l.death.age, st = stageOf(a), F = l.sex === 'F';
    var skin = skinOf(l), hair = hairOf(l, a), o = [], fit = outfit(l, a);
    var hap = l.st ? l.st.hap : 60;
    rect(o, 0, 0, 16, 16, '#17283a');
    rect(o, 0, 11, 16, 5, '#1d3247');
    if (st === 'baby') {
      rect(o, 3, 11, 10, 5, '#f6e7c8'); rect(o, 4, 10, 8, 1, '#f6e7c8');
      rect(o, 4, 4, 8, 7, skin); rect(o, 5, 3, 6, 1, skin); rect(o, 5, 11, 6, 0.01, skin);
      rect(o, 7, 2, 2, 2, hair);
      rect(o, 6, 7, 1, 1, '#1b1b1b'); rect(o, 9, 7, 1, 1, '#1b1b1b');
      rect(o, 5, 8, 1, 1, '#f2a0a0', 0.8); rect(o, 10, 8, 1, 1, '#f2a0a0', 0.8);
      rect(o, 7, 9, 2, 1, '#c0605a');
      return svg(16, 16, o, 'px avatar');
    }
    var small = st === 'child';
    var hx = small ? 5 : 4, hw = small ? 6 : 8, hy = small ? 5 : 3, hh = small ? 6 : 8;
    // tóc dài phía sau (nữ)
    if (F && st !== 'elder') rect(o, hx - 1, hy, hw + 2, hh + (small ? 3 : 5), hair);
    if (F && st === 'elder') rect(o, hx + 1, hy - 2, hw - 2, 2, hair); // búi tóc
    // thân
    var bx = small ? 4 : 3, bw = small ? 8 : 10, by = hy + hh + 1;
    rect(o, bx, by, bw, 16 - by, fit.body);
    rect(o, bx + 1, by - 1, bw - 2, 1, fit.body);
    if (fit.stripe) { for (var sy = by + 1; sy < 16; sy += 2) rect(o, bx, sy, bw, 1, fit.stripe, 0.7); }
    if (fit.scarf) { rect(o, 6.5, by - 1, 3, 1, fit.scarf); rect(o, 7, by, 2, 2, fit.scarf); }
    if (fit.tie) { rect(o, 7.5, by, 1, 3, fit.tie); rect(o, 6, by, 1, 1, '#e8e8e8'); rect(o, 9, by, 1, 1, '#e8e8e8'); }
    if (fit.steth) { rect(o, 5, by + 1, 1, 2, '#555'); rect(o, 10, by + 1, 1, 2, '#555'); rect(o, 6, by + 3, 4, 1, '#555'); }
    if (fit.chain) rect(o, 6, by + 1, 4, 1, '#d4af37');
    if (fit.star) rect(o, 10, by + 2, 1, 1, '#ffe27a');
    if (fit.num) { rect(o, 7, by + 1, 2, 2, '#fff'); }
    // cổ & đầu
    rect(o, 7, by - 1, 2, 1, skin);
    rect(o, hx + 1, hy, hw - 2, 1, skin); rect(o, hx, hy + 1, hw, hh - 1, skin); rect(o, hx + 1, hy + hh, hw - 2, 1, skin);
    // tóc trên
    rect(o, hx, hy - 1, hw, 2, hair); rect(o, hx - (F ? 1 : 0), hy, 1, F ? 6 : 3, hair); rect(o, hx + hw - (F ? 0 : 1), hy, 1, F ? 6 : 3, hair);
    if (!F) rect(o, hx + 1, hy + 1, 3, 1, hair);
    else rect(o, hx + 1, hy + 1, hw - 2, 1, hair);
    if (st === 'adult' && !F && a >= 35 && R(l, 51) < 0.4) rect(o, hx + 2, hy + hh - 1, hw - 4, 1, hair, 0.55); // râu
    // mặt
    var ey = hy + (small ? 3 : 4);
    rect(o, hx + (small ? 1 : 2), ey, 1, 1, '#1b1b1b'); rect(o, hx + hw - (small ? 2 : 3), ey, 1, 1, '#1b1b1b');
    if (st === 'elder') { rect(o, hx + 1, ey, 3, 1, '#9aa7b0', 0.55); rect(o, hx + hw - 4, ey, 3, 1, '#9aa7b0', 0.55); }
    if (small || st === 'teen') { rect(o, hx + 1, ey + 2, 1, 1, '#f2a0a0', 0.7); rect(o, hx + hw - 2, ey + 2, 1, 1, '#f2a0a0', 0.7); }
    var my = ey + (small ? 2 : 3), mx = hx + hw / 2 - 1;
    if (hap >= 55) { rect(o, mx, my, 2, 1, '#9c3d3a'); rect(o, mx - 1, my - 1, 1, 1, '#9c3d3a'); rect(o, mx + 2, my - 1, 1, 1, '#9c3d3a'); }
    else if (hap >= 35) rect(o, mx, my, 2, 1, '#9c3d3a');
    else { rect(o, mx, my - 1, 2, 1, '#9c3d3a'); rect(o, mx - 1, my, 1, 1, '#9c3d3a'); rect(o, mx + 2, my, 1, 1, '#9c3d3a'); }
    // mũ
    if (fit.hat === 'non') { rect(o, 7, 0, 2, 1, '#e8d39a'); rect(o, 5, 1, 6, 1, '#e8d39a'); rect(o, 3, 2, 10, 1, '#dcc584'); rect(o, 2, 3, 12, 1, '#c9b06c'); }
    if (fit.hat === 'police' || fit.hat === 'army') { rect(o, hx - 1, hy - 2, hw + 2, 2, fit.hatC); rect(o, hx - 1, hy, hw + 2, 1, '#14213a'); rect(o, 7, hy - 2, 2, 1, '#e0b84a'); }
    if (!l.alive) rect(o, 0, 0, 16, 16, '#000', 0.35);
    return svg(16, 16, o, 'px avatar');
  }

  // ---------- người tí hon trong khung cảnh ----------
  function figure(o, x, gy, p) {
    var h = p.st === 'baby' ? 4 : p.st === 'child' ? 7 : p.st === 'teen' ? 9 : 10;
    var top = gy - h;
    if (p.st === 'baby') { rect(o, x + 1, top, 3, 2, p.skin); rect(o, x, top + 2, 5, 2, '#f6e7c8'); return; }
    var head = p.st === 'child' ? 2 : 3, body = p.st === 'child' ? 3 : 4;
    rect(o, x + 1, top, 3, 1, p.hair);
    rect(o, x + 1, top + 1, 3, head - 1 + 1, p.skin);
    if (p.F) { rect(o, x, top, 1, head + 1, p.hair); rect(o, x + 4, top, 1, head + 1, p.hair); }
    rect(o, x, top + head + 1, 5, body, p.cloth);
    rect(o, x + 1, gy - (h - head - 1 - body), 1, h - head - 1 - body, p.legs || '#2b2b33');
    rect(o, x + 3, gy - (h - head - 1 - body), 1, h - head - 1 - body, p.legs || '#2b2b33');
    if (p.cane) rect(o, x + 5, top + head + 2, 1, h - head - 2, '#7a5a3a');
    if (p.hat === 'non') { rect(o, x + 2, top - 2, 1, 1, '#e8d39a'); rect(o, x, top - 1, 5, 1, '#dcc584'); }
    if (p.me) { rect(o, x, top - 6, 5, 1, '#ffd166'); rect(o, x + 1, top - 5, 3, 1, '#ffd166'); rect(o, x + 2, top - 4, 1, 1, '#ffd166'); }
  }
  function person(l, age, sex, k, cloth, me) {
    return { st: stageOf(age), F: sex === 'F', skin: skinOf(l, k), hair: hairOf(l, age, k), cloth: cloth, me: me, cane: age >= 75, hat: G.E.isVN(l) && !l.urban && age >= 25 && R(l, 61 + k) < 0.35 ? 'non' : null };
  }

  function houseKind(l) {
    if (l.jailUntil != null && l.age < l.jailUntil) return 'prison';
    if (l.abroad && l.abroad.trapped) return 'compound';
    var q = l.fam.q, a = l.age;
    if (l.indep && a >= 20) {
      if (l.ownHouse) return l.urban ? (q >= 4 || (l.houseVal > l.base * 40) ? 'villa' : 'ong') : 'tile';
      return l.urban ? 'tro' : 'tile';
    }
    var t = l.houseType || '';
    if (/sàn/.test(t)) return 'san'; if (/trình/.test(t)) return 'trinh'; if (/dài/.test(t)) return 'dai';
    if (/chung cư/.test(t)) return 'cc'; if (/ống|hẻm/.test(t)) return 'ong';
    if (l.fam.home === 'nhà tạm') return 'tam';
    if (q >= 5) return 'villa';
    if (!G.E.isVN(l)) return l.urban ? (q >= 4 ? 'cc' : 'ong') : (q <= 2 ? 'tam' : 'tile');
    return l.urban ? 'ong' : 'tile';
  }
  var HOUSE_NAME = { tile: 'nhà mái ngói', ong: 'nhà ống', cc: 'căn hộ chung cư', villa: 'biệt thự', san: 'nhà sàn', trinh: 'nhà trình tường', tam: 'nhà tạm', dai: 'nhà dài', tro: 'phòng trọ', prison: 'trại giam', compound: 'khu nhà rào kẽm gai' };

  function drawHouse(o, kind, night, l) {
    var win = night ? '#ffd66b' : '#9fc4d8', gy = 40;
    function w(x, y, ww, hh) { rect(o, x, y, ww || 3, hh || 3, win); }
    function roof(x0, x1, y0, rows, c) { for (var i = 0; i < rows; i++) rect(o, x0 + (rows - i), y0 + i, (x1 - x0) - 2 * (rows - i), 1, c); }
    if (kind === 'tile') { rect(o, 10, 29, 26, 11, '#d9c7a3'); roof(8, 38, 22, 7, '#a33b2b'); rect(o, 21, 33, 4, 7, '#6b4226'); w(13, 32); w(30, 32); }
    else if (kind === 'ong') { var c = ['#c99bd6', '#9cc7a8', '#e2b07a', '#9bb7e0'][Math.floor(R(l, 71) * 4)]; rect(o, 14, 12, 16, 28, c); for (var f = 0; f < 3; f++) { w(17, 15 + f * 8, 4, 3); w(23, 15 + f * 8, 4, 3); rect(o, 14, 20 + f * 8, 16, 1, '#00000033'); } rect(o, 20, 34, 4, 6, '#5a3a24'); rect(o, 13, 11, 18, 1, '#555'); }
    else if (kind === 'cc') { rect(o, 6, 6, 34, 34, '#7d8a99'); for (var yy = 9; yy < 36; yy += 5) for (var xx = 9; xx < 38; xx += 5) rect(o, xx, yy, 3, 3, R(l, xx * yy) < 0.6 ? win : '#3a4655'); rect(o, 20, 35, 6, 5, '#2e3742'); }
    else if (kind === 'villa') { rect(o, 4, 26, 40, 14, '#f1ede4'); roof(2, 46, 19, 7, '#b33a2b'); w(8, 30, 5, 4); w(16, 30, 5, 4); w(32, 30, 5, 4); rect(o, 23, 31, 5, 9, '#6b4226'); rect(o, 0, 37, 48, 3, '#3f7a3a'); rect(o, 2, 33, 2, 4, '#2f6a2a'); rect(o, 44, 33, 2, 4, '#2f6a2a'); }
    else if (kind === 'san') { rect(o, 8, 28, 30, 2, '#6b4426'); for (var px = 9; px < 38; px += 6) rect(o, px, 30, 1, 10, '#5a3a20'); rect(o, 10, 21, 26, 7, '#8a5a34'); roof(6, 40, 13, 8, '#b89a5a'); w(14, 23, 3, 3); w(29, 23, 3, 3); rect(o, 20, 30, 1, 10, '#8a6a3a'); rect(o, 21, 31, 3, 1, '#8a6a3a'); rect(o, 21, 34, 3, 1, '#8a6a3a'); rect(o, 21, 37, 3, 1, '#8a6a3a'); }
    else if (kind === 'trinh') { rect(o, 10, 26, 26, 14, '#c49a5c'); roof(8, 38, 18, 8, '#6b5a3a'); rect(o, 21, 32, 4, 8, '#4a3220'); w(13, 30); }
    else if (kind === 'tam') { rect(o, 12, 30, 22, 10, '#7f95a3'); rect(o, 10, 28, 26, 2, '#9aa9b2'); rect(o, 16, 33, 3, 7, '#4a3a2a'); rect(o, 26, 32, 3, 3, win); rect(o, 22, 29, 6, 1, '#a8642f'); }
    else if (kind === 'dai') { rect(o, 3, 27, 42, 2, '#6b4426'); for (var dx = 4; dx < 45; dx += 5) rect(o, dx, 29, 1, 11, '#5a3a20'); rect(o, 4, 21, 40, 6, '#8a5a34'); roof(1, 47, 14, 7, '#a88a4a'); }
    else if (kind === 'tro') { rect(o, 4, 27, 40, 13, '#c7b8a0'); rect(o, 3, 25, 42, 2, '#8b8b8b'); for (var t = 0; t < 3; t++) { rect(o, 8 + t * 13, 32, 4, 8, '#5a6a7a'); w(13 + t * 13, 30, 3, 3); } rect(o, 16, 26, 16, 2, '#d12f2f'); }
    else if (kind === 'prison') { rect(o, 0, 12, 120, 28, '#596470'); for (var b = 4; b < 120; b += 5) rect(o, b, 14, 1, 24, '#2b3138'); rect(o, 0, 12, 120, 2, '#3a424b'); }
    else if (kind === 'compound') { rect(o, 2, 16, 44, 24, '#6c6f74'); for (var c2 = 4; c2 < 46; c2 += 4) rect(o, c2, 14, 1, 2, '#9aa0a6'); rect(o, 2, 14, 44, 1, '#9aa0a6'); for (var r2 = 6; r2 < 44; r2 += 6) rect(o, r2, 22, 3, 3, win); }
  }

  function companions(l) {
    var a = l.age, f = l.fam, list = [], k = 0;
    var dad = { sex: 'M', age: f.fAge + a }, mom = { sex: 'F', age: f.mAge + a };
    var withParents = !l.indep || a < 20 || l.flags.caring;
    var meCloth = outfit(l, a).body;
    if (withParents) {
      if (f.fAlive && !f.noDad) list.push(person(l, dad.age, 'M', ++k, '#3d5a8a'));
      if (f.mAlive) list.push(person(l, mom.age, 'F', ++k, G.E.isVN(l) ? '#b44a5a' : '#8a3d6a'));
    }
    if (!l.indep || a < 18) for (var s = 0; s < Math.min(3, f.sibs); s++) list.push(person(l, a + 2 + s * 2, R(l, 81 + s) < 0.5 ? 'M' : 'F', ++k, ['#5a8a3d', '#d18a2f', '#3d8a8a'][s]));
    var me = person(l, a, l.sex, 0, meCloth, true); me.skin = skinOf(l); me.hair = hairOf(l, a);
    list.push(me);
    if (l.partner && l.partner.status !== 'dating') list.push(person(l, l.partner.age, l.partner.sex, ++k, '#7a5ac0'));
    l.kids.filter(function (c) { return c.alive && a - c.born < 25; }).slice(0, 4).forEach(function (c, i) { list.push(person(l, Math.max(0, a - c.born), c.sex, ++k, ['#e07a5f', '#3d8a6a', '#e0b84a', '#6a7ae0'][i])); });
    return list.slice(0, 9);
  }

  // ---------- khung cảnh 120×48 ----------
  function scene(l) {
    var o = [], W = 120, H = 48, gy = 40;
    var hap = l.st ? l.st.hap : 60, alive = l.alive;
    var time = !alive ? 'night' : hap >= 62 ? 'day' : hap >= 40 ? 'dusk' : 'night';
    var sky = { day: ['#7fc4e8', '#a9dbf2', '#d4eefa'], dusk: ['#3c3b6e', '#c46a5a', '#f2b27a'], night: ['#0d1630', '#16244a', '#24365e'] }[time];
    rect(o, 0, 0, W, 14, sky[0]); rect(o, 0, 14, W, 12, sky[1]); rect(o, 0, 26, W, 14, sky[2]);
    if (time === 'night') { for (var s = 0; s < 22; s++) rect(o, Math.floor(R(l, 100 + s) * W), Math.floor(R(l, 200 + s) * 24), 1, 1, '#fff', 0.5 + R(l, 300 + s) * 0.5); rect(o, 92, 5, 6, 6, '#f4f1d8'); rect(o, 91, 6, 1, 4, '#f4f1d8'); rect(o, 98, 6, 1, 4, '#f4f1d8'); rect(o, 95, 6, 2, 2, '#dcd8b8'); }
    else if (time === 'day') { rect(o, 94, 5, 8, 8, '#ffe27a'); rect(o, 93, 6, 10, 6, '#ffe27a'); rect(o, 92, 4, 12, 10, '#fff3b0', 0.25); }
    else { rect(o, 90, 22, 12, 6, '#ffb36b'); rect(o, 88, 24, 16, 4, '#ff9a5a', 0.6); }
    // mây
    for (var c = 0; c < 3; c++) { var cx = Math.floor(R(l, 400 + c) * 100), cy = 4 + Math.floor(R(l, 500 + c) * 10); var cc = time === 'night' ? '#2c3a5c' : time === 'dusk' ? '#e6a08a' : '#ffffff'; rect(o, cx, cy, 12, 3, cc, 0.85); rect(o, cx + 3, cy - 2, 6, 2, cc, 0.85); }
    // phông nền
    var reg = l.region || '', urban = l.urban || (l.abroad && l.abroad.perm), kind = houseKind(l);
    if (kind !== 'prison') {
      if (urban) { for (var b = 0; b < 12; b++) { var bh = 8 + Math.floor(R(l, 600 + b) * 22), bx = b * 10; rect(o, bx, gy - bh, 9, bh, time === 'night' ? '#1c2740' : '#7a8aa3', 0.85); if (time !== 'day') for (var wy = gy - bh + 2; wy < gy - 2; wy += 4) if (R(l, bx * wy) < 0.5) rect(o, bx + 2 + Math.floor(R(l, wy) * 4), wy, 1, 1, '#ffd66b'); } }
      else if (reg === 'MNPB' || reg === 'TN' || /af|np|bt|ka|hy|kp/.test(l.pool || '')) { var mc = time === 'night' ? '#1e2f3a' : '#5d7f6a'; for (var m = 0; m < 3; m++) { var mx = m * 45 - 10; for (var i = 0; i < 16; i++) rect(o, mx + i, gy - 4 - i, 40 - 2 * i, 1, mc); } }
      else if (l.coast) { rect(o, 0, gy - 6, W, 6, time === 'night' ? '#14304a' : '#3f8fc2'); for (var wv = 0; wv < W; wv += 7) rect(o, wv, gy - 5 + (wv % 3), 3, 1, '#e8f6ff', 0.6); }
    }
    // mặt đất
    var ground = urban ? (time === 'night' ? '#2c3138' : '#7b7f86') : (time === 'night' ? '#1f3a24' : '#5b8a3c');
    rect(o, 0, gy, W, H - gy, ground);
    if (!urban) { for (var rw = 0; rw < W; rw += 4) rect(o, rw, gy + 2 + (rw % 8 ? 0 : 2), 2, 1, time === 'night' ? '#2c5233' : '#7fb35a'); if (reg === 'DBSCL') rect(o, 0, gy + 4, W, 3, time === 'night' ? '#1d3f5a' : '#4f9fd1'); }
    else { rect(o, 0, gy + 3, W, 1, '#e8e8e8', 0.4); for (var lm = 6; lm < W; lm += 30) { rect(o, lm, gy - 14, 1, 14, '#444'); rect(o, lm - 1, gy - 15, 3, 1, time === 'day' ? '#bbb' : '#ffd66b'); } }
    // cây
    if (!urban && kind !== 'prison') { [52, 110].forEach(function (tx, i) { rect(o, tx + 2, gy - 6, 2, 6, '#6b4426'); rect(o, tx - 1, gy - 13, 8, 7, time === 'night' ? '#1f4a2a' : '#3f7a3a'); rect(o, tx + 1, gy - 15, 4, 2, time === 'night' ? '#1f4a2a' : '#3f7a3a'); if (G.E.isVN(l) && i === 1 && R(l, 700) < 0.6) { rect(o, tx + 2, gy - 22, 1, 9, '#7a6a3a'); rect(o, tx - 1, gy - 23, 7, 2, '#3f7a3a'); } }); }
    // nhà
    if (alive) drawHouse(o, kind, time === 'night', l);
    else { rect(o, 26, gy - 12, 10, 12, '#8a8f96'); rect(o, 27, gy - 13, 8, 1, '#8a8f96'); rect(o, 29, gy - 9, 4, 1, '#5a5f66'); rect(o, 30, gy - 11, 2, 5, '#5a5f66'); rect(o, 38, gy - 6, 1, 6, '#c96a3a'); rect(o, 38, gy - 8, 1, 2, '#ffd66b'); rect(o, 22, gy - 3, 3, 3, '#e05a7a'); }
    // người
    if (alive && kind !== 'prison') {
      var people = companions(l), x0 = kind === 'villa' || kind === 'dai' || kind === 'tro' ? 52 : 50;
      people.forEach(function (p, i) { figure(o, x0 + i * 7, gy, p); });
      var px2 = x0 + people.length * 7 + 1;
      E.H.pets(l).slice(0, 2).forEach(function (pt) { drawPet(o, pt, px2, gy); px2 += pt.k === 'chim' ? 7 : 6; });
    } else if (alive && kind === 'prison') { var me = person(l, l.age, l.sex, 0, '#3d4f6a', true); figure(o, 58, gy, me); }
    if (time === 'night' && hap < 30 && alive) for (var rn = 0; rn < 40; rn++) rect(o, Math.floor(R(l, 800 + rn + l.age) * W), Math.floor(R(l, 900 + rn + l.age) * 38), 1, 2, '#9fb6d6', 0.6);
    return svg(W, H, o, 'px scene');
  }

  // thú cưng pixel theo loài
  var PET_COL = { 'Corgi': '#e0a050', 'Husky': '#9aa6b2', 'Alaska': '#c8c8c8', 'Poodle': '#a0522d', 'Golden': '#e3b25a', 'Phốc sóc': '#f0a040', 'chó Phú Quốc': '#5a4030', 'mèo mướp': '#c9a36a', 'mèo Anh lông ngắn': '#8d99a6', 'mèo Ba Tư': '#f2efe8', 'mèo Xiêm': '#e8dcc4' };
  function drawPet(o, pt, x, gy) {
    var k = pt.k, c = PET_COL[pt.br] || (/Mực/.test(pt.n) ? '#333' : k === 'chó' ? '#c79a5a' : '#8a8a8a');
    if (k === 'chó') { rect(o, x, gy - 3, 4, 2, c); rect(o, x + 3, gy - 4, 2, 2, c); rect(o, x, gy - 1, 1, 1, c); rect(o, x + 3, gy - 1, 1, 1, c); rect(o, x - 1, gy - 4, 1, 1, c); }
    else if (k === 'mèo') { rect(o, x, gy - 3, 4, 2, c); rect(o, x + 3, gy - 4, 2, 2, c); rect(o, x + 3, gy - 5, 1, 1, c); rect(o, x + 4, gy - 5, 1, 1, c); rect(o, x, gy - 1, 1, 1, c); rect(o, x + 3, gy - 1, 1, 1, c); rect(o, x - 1, gy - 5, 1, 3, c); }
    else if (k === 'cá cảnh') { rect(o, x, gy - 4, 4, 4, '#9fd3ef', 0.75); rect(o, x + 1, gy - 3, 2, 1, pt.br === 'cá rồng' ? '#d33' : '#f08a24'); }
    else if (k === 'chim') { rect(o, x, gy - 8, 5, 1, '#b08a3a'); rect(o, x, gy - 7, 1, 7, '#b08a3a'); rect(o, x + 2, gy - 7, 1, 7, '#b08a3a', 0.6); rect(o, x + 4, gy - 7, 1, 7, '#b08a3a'); rect(o, x + 1, gy - 4, 2, 2, pt.br === 'vẹt' ? '#3fae4a' : '#e8c13a'); rect(o, x, gy - 1, 5, 1, '#b08a3a'); }
    else if (k === 'thỏ') { rect(o, x, gy - 3, 3, 3, '#eeeeee'); rect(o, x + 2, gy - 6, 1, 3, '#eeeeee'); }
    else if (k === 'rùa') { rect(o, x, gy - 2, 4, 2, '#4f7a3a'); rect(o, x + 4, gy - 2, 1, 1, '#8aa060'); }
    else rect(o, x, gy - 2, 3, 2, '#d9a066');
  }
  function caption(l) {
    var kind = houseKind(l), f = l.fam, a = l.age;
    if (!l.alive) return 'Nơi an nghỉ của ' + l.name;
    if (kind === 'prison') return 'Trại giam · còn ' + (l.jailUntil - a) + ' năm';
    if (kind === 'compound') return 'Một trại lừa đảo ở Campuchia';
    var where = l.abroad ? (l.abroad.perm ? l.place + ', ' + l.abroad.name : l.abroad.name) : l.cityStudent ? l.cityStudent.city : l.movedTo || (l.urban ? l.place : U2(l.place));
    var who = [];
    if (!l.indep || a < 20) { if (f.fAlive || f.mAlive) who.push(f.fAlive && f.mAlive ? 'bố mẹ' : f.mAlive ? 'mẹ' : 'bố'); if (f.sibs) who.push(f.sibs + ' anh chị'); }
    else { if (l.partner && l.partner.status !== 'dating') who.push(E.H.partnerWord(l, l.partner)); var k = l.kids.filter(function (c) { return c.alive && a - c.born < 25; }).length; if (k) who.push(k + ' con'); if (l.flags.caring) who.push(f.mAlive ? 'mẹ già' : 'bố già'); }
    E.H.pets(l).slice(0, 2).forEach(function (pt) { who.push(pt.k + ' ' + pt.n); });
    return where + ' · ' + HOUSE_NAME[kind] + (who.length ? ' · cùng ' + who.join(', ') : ' · một mình');
  }
  function U2(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  E.art = { avatar: avatar, scene: scene, caption: caption, houseKind: houseKind };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
