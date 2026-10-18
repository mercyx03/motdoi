/* Minh họa anime 2D bằng SVG: tóc nhiều lớp, mắt cel và phong cảnh có ánh sáng. Giữ kích thước và vị trí của tranh cũ.
   Ngoại hình lấy từ danh tính cố định, không đổi mỗi khi RNG của cuộc đời chạy. */
(function (G) {
  'use strict';
  var E = G.E, oldKind = E.art.houseKind;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function seed(l, k) { var s = [l.name, l.birthYear, l.birthMonth, l.pool, k || 0].join('|'), h = 2166136261; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function rect(o, x, y, w, h, fill, radius, extra) { o.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (radius || 0) + '" fill="' + fill + '" ' + (extra || '') + '/>'); }
  function ellipse(o, x, y, rx, ry, fill, extra) { o.push('<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" ' + (extra || '') + '/>'); }
  function path(o, d, fill, stroke, width, extra) { o.push('<path d="' + d + '" fill="' + (fill || 'none') + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (width || 1) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + ' ' + (extra || '') + '/>'); }
  function svg(w, h, o, cls, label) { return '<svg class="art2d ' + cls + '" role="img" aria-label="' + esc(label) + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">' + o.join('') + '</svg>'; }
  function skin(l, k) { var pool = l.pool || 'vn', colors = /^(afr|afw|afe|afs|et|so|ss|ao|ht|car)$/.test(pool) ? ['#80543f', '#97674b', '#684637'] : /^(in|pk|bd|lk|np|ar|fa|af|tr|es_la|br|ph|id|my|th|kh|la|mm|mg|pac)$/.test(pool) ? ['#bd8967', '#d6a17c', '#aa795a'] : ['#ebbf9d', '#f3d1b0', '#dfad89']; return colors[Math.floor(seed(l, 10 + (k || 0)) * colors.length)]; }
  function hair(l, age, k) { if (age >= 75) return '#d9dddf'; if (age >= 58) return '#a2a6ad'; var c = /^(vn|cn|kr|kp|jp|sg|mn|afr|afw|afe|afs)$/.test(l.pool || 'vn') ? ['#292729', '#3b2b28', '#242c33'] : ['#36292b', '#65462f', '#9b743e', '#684332']; return c[Math.floor(seed(l, 20 + (k || 0)) * c.length)]; }
  function outfit(l, age) {
    var c = l.job ? E.jobDef(l) : null, id = c && c.id, cat = c && c.cat;
    if (l.jailUntil != null && l.age < l.jailUntil) return { color: '#7d8fa1', stripes: true };
    if (age >= 6 && age < 18 && l.school) return { color: '#e7f0f1', scarf: age <= 14 };
    if (id === 'cong_an') return { color: '#496653', cap: true };
    if (id === 'quan_doi') return { color: '#526445', cap: true };
    if (cat === 'med') return { color: '#e5eef0', medical: true };
    if (cat === 'office' || cat === 'sale' || /ngan_hang/.test(id || '')) return { color: '#354c68', tie: true };
    if (id === 'bartender' || id === 'barista') return { color: '#eee4d4', apron: true };
    return { color: ['#547f7d', '#a46e6d', '#5d7192', '#a28a59', '#78658b'][Math.floor(seed(l, 33) * 5)] };
  }
  // Chân dung anime: cằm thuôn, mắt nhiều lớp, tóc chia lọn và bóng cel.
  function head(o, p, x, y, scale) {
    o.push('<g class="anime-head" transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">');
    var F = p.sex === 'F' && p.age >= 3, ink = '#343044', baby = p.age < 3;
    if (F) {
      path(o, 'M-24-7 Q-29-36-4-37 Q25-38 28-9 L30 37 L21 31 L17 43 Q0 37-21 43 L-26 32 L-31 37Z', p.hair, ink, .8);
      path(o, 'M-23-7 Q-26 17-21 32 M22-7 Q27 20 22 34', null, '#d9c8d9', 1.1, 'opacity=".16"');
    }
    path(o, 'M-7 17 L-7 36 Q0 41 7 36 L7 17Z', p.skin, ink, .65);
    path(o, 'M-7 23 Q0 32 7 23 L7 29 Q0 35-7 29Z', '#a65d65', null, 0, 'opacity=".22"');
    ellipse(o, -20, 4, 4, 6, p.skin, 'stroke="' + ink + '" stroke-width=".65"'); ellipse(o, 20, 4, 4, 6, p.skin, 'stroke="' + ink + '" stroke-width=".65"');
    path(o, baby ? 'M-20-11 Q0-34 20-11 L20 10 Q18 28 0 29 Q-18 28-20 10Z' : 'M-21-12 C-18-34 18-34 21-12 L20 8 Q18 19 9 25 L0 31 L-9 25 Q-18 19-20 8Z', p.skin, ink, .8);
    path(o, 'M16-15 Q25 2 17 16 L0 31 L8 23 Q17 13 15 5Z', '#bd7f80', null, 0, 'opacity=".18"');
    path(o, 'M-13-15 Q-4-24 9-18', null, '#fff5dc', 3, 'opacity=".3"');
    [-1, 1].forEach(function (side) {
      o.push('<g class="anime-eye" transform="translate(' + side * 9.5 + ' 4) scale(' + side + ' 1)">');
      var ry = p.age >= 60 ? 3.5 : baby ? 5 : F ? 6.5 : 5.3;
      path(o, 'M-5-1 Q0-' + (ry + 3) + ' 6-1 Q4 ' + (ry + 3) + '-2 ' + ry + ' Q-5 3-5-1Z', '#fff8f0', ink, .5);
      ellipse(o, .3, .7, 3.4, ry, '#485674');
      ellipse(o, .3, 2.6, 2.8, Math.max(1, ry - 2), '#9bafb5');
      ellipse(o, .3, -.2, 1.5, Math.max(2, ry - 1), '#282a43');
      ellipse(o, -1, -1.7, 1.25, 1.7, '#ffffff'); ellipse(o, 1.9, 3, .7, .8, '#fff4d6');
      path(o, 'M-6-1 Q0-' + (ry + 3.5) + ' 6-1 L8-3 M-4 ' + (ry - 1) + ' Q1 ' + (ry + 2) + ' 5 2', null, ink, F ? 1.4 : 1.1);
      if (F) path(o, 'M5-3 L7-5 M3-4 L4-6', null, ink, .8);
      path(o, 'M-5-' + (ry + 5) + ' Q0-' + (ry + 7) + ' 5-' + (ry + 4), null, p.hair, 1.2);
      o.push('</g>');
    });
    ellipse(o, -14, 13, 4.7, 2.6, '#e88699', 'opacity=".25"'); ellipse(o, 14, 13, 4.7, 2.6, '#e88699', 'opacity=".25"');
    path(o, 'M1 10 L-1 15 L2 15', null, '#aa6d74', .65);
    path(o, p.hap < 35 ? 'M-4 22 Q0 19 4 22' : p.hap < 55 ? 'M-3 21 Q0 22 3 21' : 'M-4 20 Q0 24 5 19', null, '#975167', 1);
    path(o, 'M-2 24 L2 24', null, '#fff1df', .65, 'opacity=".6"');
    if (baby) path(o, 'M-10-23 Q-12-35-1-33 Q8-32 3-25 Q-2-31-4-25 M1-30 Q15-36 17-23', null, p.hair, 2.5);
    else {
      path(o, F ? 'M-24 4 Q-30-21-18-31 Q-6-42 13-33 Q31-29 25 3 L19-8 L16-21 Q11-8 5-5 L7-21 Q-1-8-8-4 L-5-20 Q-13-8-19-3 L-19-15Z' : 'M-23 1 L-26-13 L-23-25 L-28-29 L-15-29 L-17-36 L-4-32 L4-39 L10-33 Q29-33 25-13 L21 4 L17-11 L12-21 L12-8 L3-17 L-2-8 L-10-16 L-18 2 L-18-13Z', p.hair, ink, .8);
      path(o, F ? 'M-19-22 Q-12-32 2-32 M5-31 Q16-30 20-20 M-17-19 L-13-23 M8-25 L5-19' : 'M-18-24 L-8-28 L-3-26 M2-30 L9-28 L17-23 M-11-22 L-7-20 M13-20 L17-16', null, '#d4c1d6', 1.7, 'opacity=".24"');
      path(o, 'M-20-12 L-19-5 M21-12 L22-5', null, '#fff1da', .8, 'opacity=".28"');
    }
    if (p.age >= 60) { rect(o, -17, -2, 14, 12, 'none', 4, 'stroke="#786f8b" stroke-width=".9"'); rect(o, 3, -2, 14, 12, 'none', 4, 'stroke="#786f8b" stroke-width=".9"'); path(o, 'M-3 2 Q0 0 3 2 M-17 2 L-21 0 M17 2 L21 0', null, '#786f8b', .9); path(o, 'M-16 14 L-12 15 M12 15 L16 14 M-7 18 L-8 22 M7 18 L8 22', null, '#a67b78', .6); }
    if (p.age >= 75) path(o, 'M-7-8 Q0-10 7-8 M-6-12 Q0-14 6-12', null, '#b58f89', .65);
    if (p.cap) { path(o, 'M-25-18 Q0-40 25-18 L22-10 L-22-10Z', p.color, ink, .8); path(o, 'M-25-11 Q0-5 25-11 L20-5 L-20-5Z', '#263f42', ink, .6); ellipse(o, 0, -20, 3, 3, '#efd38a'); }
    o.push('</g>');
  }
  function person(l, age, sex, k, color) { return { age: Math.max(0, age || 0), sex: sex, skin: skin(l, k), hair: hair(l, age, k), color: color || outfit(l, age).color, hap: l.st ? l.st.hap : 65 }; }
  function avatar(l) {
    var age = l.alive === false && l.death ? l.death.age : l.age || 0, p = person(l, age, l.sex, 0), fit = outfit(l, age), o = [], id = 'portrait-' + Math.floor(seed(l, 99) * 1e9);
    o.push('<defs><linearGradient id="' + id + '" x2="1" y2="1"><stop stop-color="#526181"/><stop offset=".55" stop-color="#44415d"/><stop offset="1" stop-color="#c49294"/></linearGradient></defs>');
    rect(o, 0, 0, 160, 160, 'url(#' + id + ')', 0); ellipse(o, 126, 26, 52, 52, '#d4c79f', 'opacity=".08"'); ellipse(o, 26, 152, 62, 46, '#6c9b9c', 'opacity=".12"');
    for (var light = 0; light < 9; light++) ellipse(o, seed(l, light + 710) * 160, seed(l, light + 730) * 160, 2 + seed(l, light + 750) * 6, 2 + seed(l, light + 750) * 6, '#ffe6bd', 'opacity=".13"');
    path(o, 'M0 156 Q80 100 160 125 L160 160H0Z', '#dcc2bc', null, 0, 'opacity=".08"');
    if (age < 2) {
      path(o, 'M34 157 Q27 119 56 105 Q79 91 106 109 Q133 123 126 160Z', '#f1e3c8');
      path(o, 'M40 124 Q82 135 118 113 M48 151 Q86 155 122 132', null, '#d8c6a7', 2);
      head(o, p, 80, 65, 1.03);
    } else {
      path(o, 'M24 160 L27 130 Q33 108 62 104 L98 104 Q128 108 133 130 L137 160Z', fit.color);
      path(o, 'M28 159 L34 130 Q42 116 60 111 L65 160Z', '#1d263f', null, 0, 'opacity=".19"');
      path(o, 'M99 110 Q116 114 126 130 L130 159', null, '#fff0d5', 2.5, 'opacity=".3"');
      path(o, 'M63 105 L80 124 L97 105', null, '#fff5e8', 3, 'opacity=".65"');
      path(o, 'M38 144 L48 133 M117 142 L110 132 M69 151 L70 136', null, '#25253d', .9, 'opacity=".3"');
      if (fit.tie) path(o, 'M77 121 L83 121 L87 151 L80 158 L73 151Z', '#ca9e75');
      if (fit.apron) { path(o, 'M52 111 L60 111 L61 128 L100 128 L102 111 L110 114 L112 160 L49 160Z', '#435254'); path(o, 'M66 145 L96 145', null, '#b8c3bd', 1.4); }
      if (fit.scarf) path(o, 'M60 109 L80 124 L100 109 L88 128 L89 147 L79 141 L75 126Z', '#bc5a51');
      if (fit.medical) { path(o, 'M59 112 L59 136 Q59 147 71 147 Q82 147 82 135 L82 115 M82 135 Q84 152 101 144', null, '#6b7c89', 2.5); ellipse(o, 102, 144, 4, 4, '#8195a2'); }
      if (fit.stripes) { path(o, 'M30 136 L130 136 M26 151 L135 151', null, '#dce3e7', 5, 'opacity=".65"'); }
      p.cap = fit.cap; head(o, p, 80, age < 12 ? 68 : 61, age < 12 ? 1.02 : 1.12);
    }
    if (l.alive === false) rect(o, 0, 0, 160, 160, '#172432', 0, 'opacity=".3"');
    return svg(160, 160, o, 'avatar', 'Chân dung anime 2D của ' + l.name);
  }
  function figure(o, x, ground, p, me) {
    var scale = p.age < 2 ? 0.38 : p.age < 12 ? 0.49 : p.age < 18 ? 0.62 : 0.69;
    o.push('<g transform="translate(' + x + ' ' + ground + ') scale(' + scale + ')">');
    ellipse(o, 0, 0, 24, 5, '#142c35', 'opacity=".14"');
    if (p.age < 2) { path(o, 'M-18-11 Q-28-40 0-43 Q28-39 18-11Z', '#efe3cd'); head(o, p, 0, -55, 0.7); }
    else {
      path(o, 'M-12-42 L-12-6 M11-42 L11-6', null, '#39475b', 10);
      path(o, 'M-18-6 L-7-6 M6-6 L19-6', null, '#273b49', 6);
      path(o, 'M-19-74 Q0-85 19-74 L23-41 Q0-35-23-41Z', p.color, '#353347', .8);
      path(o, 'M-18-71 L-10-67 L-9-41 L-22-42Z', '#252c46', null, 0, 'opacity=".18"');
      path(o, 'M-7-77 L0-69 L8-77 M12-64 L16-44', null, '#fff1e4', 1.8, 'opacity=".45"');
      path(o, 'M-19-69 L-29-46 M19-69 L29-46', null, p.color, 8);
      ellipse(o, -29, -44, 4, 5, p.skin); ellipse(o, 29, -44, 4, 5, p.skin);
      head(o, p, 0, -100, 0.7);
      if (p.age >= 75) path(o, 'M33-47 L37-3 M33-47 Q41-53 42-44', null, '#987b59', 2.5);
    }
    if (me) { ellipse(o, 0, -133, 7, 7, '#e3bf78'); path(o, 'M-3-132 L0-129 L4-135', null, '#514c3d', 1.8); }
    o.push('</g>');
  }
  function houseKind(l) {
    var old = oldKind(l); if (old === 'prison' || old === 'compound') return old;
    if (l.indep && l.ownHouse && l.houseName) { if (/căn hộ|chung cư/i.test(l.houseName)) return 'cc'; if (/biệt thự|dinh thự/i.test(l.houseName)) return 'villa'; if (/nhà phố|nhà ống/i.test(l.houseName)) return 'ong'; }
    return old;
  }
  function companions(l) {
    var list = [], f = l.fam || {}, a = l.age, kind = houseKind(l);
    if (kind === 'prison' || kind === 'compound') return [Object.assign(person(l, a, l.sex, 0, '#8598aa'), { me: true })];
    if (!l.indep || a < 20 || l.flags.caring) { if (f.fAlive && !f.noDad) list.push(person(l, f.fAge + a, 'M', 'father', '#5d7991')); if (f.mAlive) list.push(person(l, f.mAge + a, 'F', 'mother', '#aa7778')); }
    if (!l.indep || a < 18) E.H.sibs(l).slice(0, 3).forEach(function (s) { list.push(person(l, Math.max(0, a - s.born), s.sex, 'sibling-' + s.n, '#7c9477')); });
    list.push(Object.assign(person(l, a, l.sex, 0), { me: true }));
    if (l.partner && l.partner.alive !== false && l.partner.status !== 'dating') list.push(person(l, l.partner.age, l.partner.sex, 'partner-' + l.partner.name, '#9380a8'));
    (l.kids || []).filter(function (c) { return c.alive && c.custody !== 'ex' && a - c.born < 25; }).slice(0, 4).forEach(function (c) { list.push(person(l, a - c.born, c.sex, 'child-' + (c.name || c.born + c.sex), '#c6a46d')); });
    return list.slice(0, 8);
  }
  function house(o, kind, night) {
    var wall = night ? '#606d91' : '#f0dec9', win = night ? '#ffd3a2' : '#99cbdc';
    function window(x, y, w, h) { w = w || 21; h = h || 28; rect(o, x - 2, y - 2, w + 4, h + 4, '#647487', 1); rect(o, x, y, w, h, win, 1); path(o, 'M' + x + ' ' + (y + h) + ' l' + w + ' -' + h + ' M' + x + ' ' + (y + h - 8) + ' l' + (w - 8) + ' -' + (h - 8), null, '#fff5e6', 2, 'opacity=".3"'); path(o, 'M' + (x + w / 2) + ' ' + y + ' V' + (y + h) + ' M' + x + ' ' + (y + h / 2) + ' h' + w, null, '#e5d8c9', 1.4); rect(o, x - 3, y + h, w + 6, 3, '#8f8490', 0); }
    if (kind === 'prison' || kind === 'compound') {
      rect(o, 36, 56, 528, 144, night ? '#3d5265' : '#9aabba', 8); rect(o, 27, 48, 546, 13, '#61798a', 4);
      for (var b = 0; b < 7; b++) { rect(o, 62 + b * 71, 84, 43, 58, '#263f53', 3); for (var bar = 0; bar < 3; bar++) path(o, 'M' + (71 + b * 71 + bar * 12) + ' 85 V141', null, '#bbc4c9', 3); }
      path(o, 'M10 197 L590 197 M20 157 L580 157', null, '#516577', 3); return;
    }
    if (kind === 'ong' || kind === 'cc') {
      rect(o, 62, kind === 'cc' ? 43 : 55, kind === 'cc' ? 154 : 100, kind === 'cc' ? 157 : 145, wall, 5);
      for (var floor = 0; floor < 3; floor++) { window(75, 66 + floor * 41, 27, 29); window(115, 66 + floor * 41, 27, 29); if (kind === 'cc') window(165, 66 + floor * 41, 28, 29); path(o, 'M65 ' + (101 + floor * 41) + ' H' + (kind === 'cc' ? 210 : 157), null, '#a89e90', 3); }
      rect(o, 57, kind === 'cc' ? 37 : 49, kind === 'cc' ? 165 : 110, 9, '#67808d', 3); rect(o, 108, 170, 30, 30, '#77614d', 2); rect(o, 145, kind === 'cc' ? 46 : 58, 17, 142, '#665c7d', 0, 'opacity=".15"'); path(o, 'M67 55 V195', null, '#fff5e4', 2, 'opacity=".45"'); return;
    }
    if (kind === 'tro') { rect(o, 30, 126, 223, 74, wall, 5); path(o, 'M25 126 L258 126 L251 113 L33 113Z', '#7c9299'); for (var room = 0; room < 3; room++) { rect(o, 47 + room * 70, 152, 29, 48, '#667f8c', 3); window(80 + room * 70, 143, 15, 20); } return; }
    var low = kind === 'tam', high = kind === 'san', long = kind === 'dai';
    rect(o, 43, high ? 133 : 132, long ? 231 : 169, high ? 47 : 68, wall, 4);
    if (high) { path(o, 'M50 179 V200 M200 179 V200 M125 180 L145 200', null, '#7c6550', 5); }
    path(o, 'M28 134 L' + (long ? 155 : 127) + ' ' + (low ? 100 : 80) + ' L' + (long ? 286 : 227) + ' 134Z', low ? '#a79772' : '#a45f50');
    path(o, 'M47 127 L' + (long ? 155 : 127) + ' ' + (low ? 102 : 86) + ' L' + (long ? 266 : 208) + ' 127', null, '#c68f73', 2);
    path(o, 'M43 135 L212 135 L212 146 L43 146Z', '#6b5471', null, 0, 'opacity=".22"');
    path(o, 'M147 139 L212 139 L212 200 L147 200Z', '#b3a0aa', null, 0, 'opacity=".2"');
    if (!low) for (var tile = 0; tile < 7; tile++) path(o, 'M' + (50 + tile * 23) + ' 128 L' + (127 + (tile - 3) * 4) + ' 90', null, '#754d61', .8, 'opacity=".55"');
    path(o, 'M54 119 H201 M75 108 H180 M97 97 H156', null, '#efb595', .75, 'opacity=".45"');
    rect(o, 112, high ? 143 : 155, 31, high ? 36 : 45, '#7b6050', 2); window(61, 147, 29, 25); window(165, 147, 29, 25);
    if (kind === 'villa') { rect(o, 209, 122, 62, 78, '#ddd9ca', 5); window(226, 137, 26, 35); path(o, 'M199 125 L240 98 L281 125Z', '#a45f50'); rect(o, 36, 192, 244, 8, '#b2ac9b', 2); }
  }
  var HOUSE_NAMES = { tile: 'nhà mái ngói', ong: 'nhà ống', cc: 'căn hộ chung cư', villa: 'biệt thự', san: 'nhà sàn', trinh: 'nhà trình tường', tam: 'nhà tạm', dai: 'nhà dài', tro: 'phòng trọ' };
  function petFigure(o, pet, x) {
    if (pet.k === 'cá cảnh' || pet.k === 'cá') { ellipse(o, x, 220, 14, 13, '#c4dad6', 'opacity=".8"'); path(o, 'M' + (x - 12) + ' 218 Q' + x + ' 214 ' + (x + 12) + ' 218', null, '#77acbf', 2); ellipse(o, x, 222, 6, 3, '#d7a15f'); return; }
    if (pet.k === 'chim') { path(o, 'M' + x + ' 231 V207 M' + (x - 13) + ' 223 H' + (x + 13), null, '#9a835f', 2); ellipse(o, x, 215, 7, 8, '#adbb76'); ellipse(o, x + 5, 208, 5, 5, '#c3ce8a'); path(o, 'M' + (x + 9) + ' 208 l4 2-4 2Z', '#c9a66c'); return; }
    if (pet.k === 'rùa') { ellipse(o, x, 226, 14, 7, '#829879'); ellipse(o, x + 16, 227, 5, 4, '#a6b18a'); return; }
    ellipse(o, x, 226, 13, 7, pet.k === 'mèo' ? '#bca58c' : '#bb976d'); ellipse(o, x + 10, 219, 6, 7, '#c7af8a');
    if (pet.k === 'mèo') path(o, 'M' + (x + 5) + ' 215 l1-7 5 5 l5-5 0 8Z', '#c7af8a');
    else if (pet.k === 'thỏ') { ellipse(o, x + 7, 209, 2, 8, '#e1d6c2'); ellipse(o, x + 13, 208, 2, 8, '#e1d6c2'); }
    else path(o, 'M' + (x + 6) + ' 215 q-5 10-7 4', null, '#92785c', 4);
    if (pet.k !== 'thỏ') path(o, 'M' + (x - 12) + ' 224 q-12-12-8-16', null, '#b99c7b', 3);
  }
  function caption(l) {
    if (l.alive === false) return 'Nơi an nghỉ của ' + l.name;
    var kind = houseKind(l), f = l.fam, who = [], a = l.age;
    if (kind === 'prison') return 'Trại giam · còn ' + Math.max(0, l.jailUntil - a) + ' năm';
    if (kind === 'compound') return 'Khu nhà bị giam giữ';
    if (!l.indep || a < 20 || l.flags.caring) { if (f.mAlive && f.fAlive && !f.noDad) who.push('bố mẹ'); else if (f.mAlive) who.push('mẹ'); else if (f.fAlive && !f.noDad) who.push('bố'); }
    if ((!l.indep || a < 18) && E.H.sibs(l).length) who.push(E.H.sibs(l).length + ' anh chị em');
    if (l.partner && l.partner.alive !== false && l.partner.status !== 'dating') who.push(E.H.partnerWord(l, l.partner));
    var kids = (l.kids || []).filter(function (c) { return c.alive && c.custody !== 'ex' && a - c.born < 25; }); if (kids.length) who.push(kids.length + ' con');
    E.H.pets(l).slice(0, 2).forEach(function (p) { who.push(p.k + ' ' + p.n); });
    var where = l.abroad ? l.abroad.name : l.cityStudent ? l.cityStudent.city : l.movedTo || l.place || 'Nơi đang sống';
    return where + ' · ' + (HOUSE_NAMES[kind] || 'nhà ở') + (who.length ? ' · cùng ' + who.join(', ') : ' · một mình');
  }
  function scene(l) {
    var o = [], kind = houseKind(l), night = l.alive === false || (l.st && l.st.hap < 40), dusk = !night && l.st && l.st.hap < 62, urban = l.urban || (l.abroad && l.abroad.perm), id = 'sky-' + Math.floor(seed(l, 99) * 1e9);
    var sky = night ? ['#222b58', '#77749a'] : dusk ? ['#7378b4', '#ffc3a5'] : ['#78b4e4', '#f4e9d8'];
    o.push('<defs><linearGradient id="' + id + '" x2="0" y2="1"><stop stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>'); rect(o, 0, 0, 600, 240, 'url(#' + id + ')');
    for (var halo = 4; halo > 0; halo--) ellipse(o, 494, dusk ? 139 : 43, (night ? 18 : 23) + halo * 12, (night ? 18 : 23) + halo * 12, '#fff1cc', 'opacity=".035"');
    ellipse(o, 494, dusk ? 139 : 43, night ? 15 : 20, night ? 15 : 20, night ? '#fff0d9' : '#fff1ce');
    if (!night) { path(o, 'M470 0 L600 0 L354 222 L245 240Z', '#fff1d4', null, 0, 'opacity=".09"'); path(o, 'M505 0 L545 0 L140 240 L86 240Z', '#ffeecb', null, 0, 'opacity=".06"'); }
    if (night) for (var s = 0; s < 18; s++) ellipse(o, 20 + seed(l, s + 90) * 560, 12 + seed(l, s + 180) * 100, 1, 1, '#e5e6d6', 'opacity=".65"');
    else for (var c = 0; c < 4; c++) {
      var x = -40 + seed(l, 400 + c) * 570, y = 16 + seed(l, 500 + c) * 61;
      path(o, 'M' + x + ' ' + y + ' q10-15 27-8 q3-20 25-17 q18-16 35 5 q23-5 30 14 q15-3 23 11 q-65 10-140-5Z', dusk ? '#f4c8c9' : '#fef6ef', null, 0, 'opacity=".83"');
      path(o, 'M' + (x + 12) + ' ' + (y + 1) + ' q22-9 42-2 q22-10 42 0 q16-5 34 2 q-60 10-118 0Z', dusk ? '#c79cbb' : '#cbdbe8', null, 0, 'opacity=".44"');
    }
    if (urban) for (var b = 0; b < 9; b++) {
      var h = 37 + seed(l, 600 + b) * 85, bx = b * 74 - 13;
      rect(o, bx, 191 - h, 55, h, night ? '#414b75' : '#91aac7', 1, 'opacity=".6"');
      rect(o, bx + 40, 191 - h, 15, h, night ? '#354163' : '#8396b3', 0, 'opacity=".5"');
      path(o, 'M' + (bx + 4) + ' ' + (190 - h) + ' h45', null, '#f0d5cc', 1.2, 'opacity=".55"');
      for (var by = 0; by < 4; by++) for (var bw = 0; bw < 3; bw++) rect(o, bx + 7 + bw * 13, 199 - h + by * 17, 5, 8, night ? '#ebc3a3' : '#d6e7ec', 0, 'opacity=".5"');
    }
    else if (l.coast) { path(o, 'M0 140 Q170 131 300 143 T600 137 L600 200 H0Z', night ? '#4b628b' : '#6eb3d4'); for (var w = 0; w < 8; w++) path(o, 'M' + (w * 80) + ' 163 q17-4 35 0', null, '#e2e8dd', 1.4, 'opacity=".65"'); }
    else { path(o, 'M0 167 Q80 93 160 151 Q235 78 322 144 Q435 68 600 156 L600 205 H0Z', night ? '#4f577e' : '#8eafbb'); path(o, 'M0 182 Q150 127 294 165 Q438 130 600 174 V208 H0Z', night ? '#485f77' : '#a6bdb2'); }
    path(o, 'M0 194 Q200 185 600 197 V240 H0Z', urban ? '#9d9cab' : night ? '#455875' : '#98b28c');
    path(o, 'M0 221 Q240 209 600 226 V240 H0Z', urban ? '#c9bcb9' : night ? '#57617d' : '#d7cba7');
    path(o, 'M232 199 L194 240 H291 L286 199Z', night ? '#636781' : '#e8d5bd', null, 0, 'opacity=".75"');
    if (urban) { path(o, 'M0 222 Q300 207 600 226 M0 234 Q300 217 600 238', null, '#faf0d9', 1, 'opacity=".4"'); for (var paving = 0; paving < 10; paving++) path(o, 'M' + paving * 70 + ' 216 l-16 24', null, '#7e7d94', .7, 'opacity=".25"'); }
    else for (var grass = 0; grass < 40; grass++) { var gx = seed(l, 810 + grass) * 600, gy = 198 + seed(l, 910 + grass) * 40; path(o, 'M' + gx + ' ' + gy + ' l-2-5 m2 5 3-4', null, night ? '#879491' : '#758c70', .8, 'opacity=".5"'); }
    if (l.alive !== false) house(o, kind, night);
    else { path(o, 'M104 198 V158 Q126 133 148 158 V198Z', '#a6b1af'); path(o, 'M126 157 V181 M118 166 H134', null, '#71878b', 3); ellipse(o, 126, 201, 37, 5, '#5e7667'); ellipse(o, 158, 191, 5, 5, '#cd9798'); }
    if (kind !== 'prison' && kind !== 'compound') {
      [14, 568].forEach(function (tx) {
        path(o, 'M' + tx + ' 202 Q' + (tx + 6) + ' 157 ' + tx + ' 118', null, '#706576', 7);
        path(o, 'M' + tx + ' 165 l-13-20 M' + (tx + 1) + ' 153 l18-19', null, '#706576', 3);
        for (var leaf = 0; leaf < 19; leaf++) {
          var lx = tx - 30 + seed(l, 1200 + leaf) * 60, ly = 105 + seed(l, 1300 + leaf) * 53;
          ellipse(o, lx, ly, 11 + seed(l, 1400 + leaf) * 9, 9 + seed(l, 1500 + leaf) * 8, night ? ['#4d6476', '#5b7580', '#69838a'][leaf % 3] : ['#6b9688', '#8db39a', '#b6c69f', '#79a28f'][leaf % 4]);
          path(o, 'M' + (lx - 5) + ' ' + (ly - 4) + ' q5-3 10 0', null, night ? '#b6b5b1' : '#e2dbb0', 1, 'opacity=".25"');
        }
      });
    }
    if (l.alive !== false) {
      var people = companions(l), spacing = people.length > 6 ? 36 : 43, start = people.length === 1 ? 350 : Math.max(293, 405 - (people.length - 1) * spacing / 2);
      people.forEach(function (p, i) { figure(o, start + i * spacing, 209 + (i % 2) * 3, p, p.me); });
      if (kind !== 'prison' && kind !== 'compound') E.H.pets(l).slice(0, 2).forEach(function (pet, i) { petFigure(o, pet, 307 + i * 33); });
    }
    return svg(600, 240, o, 'scene', 'Minh họa anime 2D: ' + caption(l));
  }
  E.art = { avatar: avatar, scene: scene, caption: caption, houseKind: houseKind, companions: companions, style: '2d', theme: 'anime' };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
